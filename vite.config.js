import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DATA_FILE = path.resolve('.data/comments.json');
const DEV_ADMIN_KEY = process.env.COMMENTS_ADMIN_KEY || 'wanzi-dev-admin';
const PAGE_SIZE = 5;
const POST_INTERVAL_MS = 30 * 1000;
const POST_HOUR_LIMIT = 10;
const LIKE_MINUTE_LIMIT = 30;

const rateBuckets = new Map();

function bucketOf(ip) {
  let bucket = rateBuckets.get(ip);
  if (!bucket) {
    bucket = { posts: [], likes: [] };
    rateBuckets.set(ip, bucket);
  }
  return bucket;
}

function prune(list, windowMs, now) {
  while (list.length && now - list[0] > windowMs) list.shift();
}

function postCooldown(ip) {
  const now = Date.now();
  const bucket = bucketOf(ip);
  prune(bucket.posts, 3600 * 1000, now);
  const last = bucket.posts[bucket.posts.length - 1];
  if (last && now - last < POST_INTERVAL_MS) {
    return Math.ceil((POST_INTERVAL_MS - (now - last)) / 1000);
  }
  if (bucket.posts.length >= POST_HOUR_LIMIT) return 3600;
  return 0;
}

function likeCooldown(ip) {
  const now = Date.now();
  const bucket = bucketOf(ip);
  prune(bucket.likes, 60 * 1000, now);
  return bucket.likes.length >= LIKE_MINUTE_LIMIT ? 60 : 0;
}

function readStore() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const comments = Array.isArray(data.comments) ? data.comments : [];
    return { comments: comments.map((item) => ({ likes: 0, ...item })) };
  } catch {
    return { comments: [] };
  }
}

function writeStore(store) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function strip(item) {
  const copy = { ...item };
  delete copy.token;
  return copy;
}

function paginate(store, pageParam, sizeParam) {
  const size = Math.min(20, Math.max(1, Number.parseInt(sizeParam, 10) || PAGE_SIZE));
  const roots = store.comments
    .filter((item) => !item.parentId)
    .sort((a, b) => b.createdAt - a.createdAt);
  const asc = [...roots].sort((a, b) => a.createdAt - b.createdAt);
  const floorMap = new Map(asc.map((item, index) => [item.id, index + 1]));
  const total = roots.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  let page = Number.parseInt(pageParam, 10) || 1;
  page = Math.min(Math.max(1, page), pageCount);
  const slice = roots.slice((page - 1) * size, page * size).map((item) => ({
    ...item,
    floor: floorMap.get(item.id),
  }));
  const ids = new Set(slice.map((item) => item.id));
  const replies = store.comments.filter((item) => item.parentId && ids.has(item.parentId));
  return {
    page,
    size,
    total,
    pageCount,
    totalAll: store.comments.length,
    comments: [...slice, ...replies].map(strip),
  };
}

function localCommentsApi() {
  return {
    name: 'local-comments-api',
    configureServer(server) {
      server.middlewares.use('/api/comments', (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(obj));
        };
        const store = readStore();
        const ip = String(req.socket.remoteAddress || 'unknown');

        if (req.method === 'GET') {
          const url = new URL(req.url, 'http://localhost');
          return send(200, { ok: true, ...paginate(store, url.searchParams.get('page'), url.searchParams.get('size')) });
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            let data = {};
            try {
              data = JSON.parse(body || '{}');
            } catch {
              return send(400, { ok: false, error: '请求格式不正确' });
            }

            if (data.action === 'like' || data.action === 'unlike') {
              const wait = likeCooldown(ip);
              if (wait) return send(429, { ok: false, error: '操作太频繁，请稍后再试', retryAfter: wait });
              const target = store.comments.find((item) => item.id === String(data.id || ''));
              if (!target) return send(404, { ok: false, error: '评论不存在' });
              target.likes = Math.max(0, (target.likes || 0) + (data.action === 'like' ? 1 : -1));
              bucketOf(ip).likes.push(Date.now());
              writeStore(store);
              return send(200, { ok: true, likes: target.likes });
            }

            const content = String(data.content || '').trim().slice(0, 500);
            if (!content) return send(400, { ok: false, error: '评论内容不能为空' });
            const wait = postCooldown(ip);
            if (wait) return send(429, { ok: false, error: '发言太快了，请稍后再试', retryAfter: wait });
            const nickname = String(data.nickname || '').trim().slice(0, 24) || '访客';
            const parentId = data.parentId ? String(data.parentId) : null;
            if (parentId && !store.comments.some((item) => item.id === parentId)) {
              return send(400, { ok: false, error: '回复的评论已不存在' });
            }
            const comment = {
              id: crypto.randomUUID(),
              parentId,
              nickname,
              content,
              likes: 0,
              createdAt: Date.now(),
              token: crypto.randomBytes(24).toString('hex'),
            };
            store.comments.push(comment);
            bucketOf(ip).posts.push(Date.now());
            writeStore(store);
            return send(200, { ok: true, comment: strip(comment), deleteToken: comment.token });
          });
          return undefined;
        }

        if (req.method === 'DELETE') {
          const url = new URL(req.url, 'http://localhost');
          const id = url.searchParams.get('id');
          const token = req.headers['x-delete-token'];
          const adminKey = req.headers['x-admin-key'];
          const target = store.comments.find((item) => item.id === id);
          if (!target) return send(404, { ok: false, error: '评论不存在' });
          const isAdmin = adminKey === DEV_ADMIN_KEY;
          if (!isAdmin && token !== target.token) {
            return send(403, { ok: false, error: '无权删除这条评论' });
          }
          store.comments = store.comments.filter((item) => item.id !== id && item.parentId !== id);
          writeStore(store);
          return send(200, { ok: true });
        }

        return send(405, { ok: false, error: 'method not allowed' });
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), localCommentsApi()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
});