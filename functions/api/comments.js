// Cloudflare Pages Function: /api/comments
// 存储：Workers KV 绑定 COMMENTS_KV（单 JSON 文档，个人站规模足够）
// 删除：评论本人凭 deleteToken（x-delete-token），UP主凭环境变量 COMMENTS_ADMIN_KEY（x-admin-key）
// 点赞：POST {action:'like'|'unlike', id}；分页：GET ?page=&size=；限流：KV 记录每 IP 时间戳

const KEY = 'comments:v1';
const RATE_KEY = 'comments:ratelimit:v1';
const PAGE_SIZE = 5;
const POST_INTERVAL_MS = 30 * 1000;
const POST_HOUR_LIMIT = 10;
const LIKE_MINUTE_LIMIT = 30;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function load(env) {
  try {
    const raw = await env.COMMENTS_KV.get(KEY);
    if (!raw) return { comments: [] };
    const data = JSON.parse(raw);
    const comments = Array.isArray(data.comments) ? data.comments : [];
    return { comments: comments.map((item) => ({ likes: 0, ...item })) };
  } catch {
    return { comments: [] };
  }
}

async function save(env, store) {
  await env.COMMENTS_KV.put(KEY, JSON.stringify(store));
}

async function loadRates(env) {
  try {
    const raw = await env.COMMENTS_KV.get(RATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveRates(env, rates) {
  await env.COMMENTS_KV.put(RATE_KEY, JSON.stringify(rates));
}

function clientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

function bucketOf(rates, ip) {
  if (!rates[ip]) rates[ip] = { posts: [], likes: [] };
  return rates[ip];
}

function prune(list, windowMs, now) {
  while (list.length && now - list[0] > windowMs) list.shift();
}

function postCooldown(rates, ip) {
  const now = Date.now();
  const bucket = bucketOf(rates, ip);
  prune(bucket.posts, 3600 * 1000, now);
  const last = bucket.posts[bucket.posts.length - 1];
  if (last && now - last < POST_INTERVAL_MS) {
    return Math.ceil((POST_INTERVAL_MS - (now - last)) / 1000);
  }
  if (bucket.posts.length >= POST_HOUR_LIMIT) return 3600;
  return 0;
}

function likeCooldown(rates, ip) {
  const now = Date.now();
  const bucket = bucketOf(rates, ip);
  prune(bucket.likes, 60 * 1000, now);
  return bucket.likes.length >= LIKE_MINUTE_LIMIT ? 60 : 0;
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-delete-token, x-admin-key',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestGet(context) {
  if (!context.env.COMMENTS_KV) {
    return json({ ok: false, error: '评论存储未绑定（缺少 COMMENTS_KV）' }, 503);
  }
  const store = await load(context.env);
  const url = new URL(context.request.url);
  return json({
    ok: true,
    ...paginate(store, url.searchParams.get('page'), url.searchParams.get('size')),
  });
}

export async function onRequestPost(context) {
  if (!context.env.COMMENTS_KV) {
    return json({ ok: false, error: '评论存储未绑定（缺少 COMMENTS_KV）' }, 503);
  }
  let data = {};
  try {
    data = await context.request.json();
  } catch {
    return json({ ok: false, error: '请求格式不正确' }, 400);
  }
  const ip = clientIp(context.request);
  const rates = await loadRates(context.env);

  if (data.action === 'like' || data.action === 'unlike') {
    const wait = likeCooldown(rates, ip);
    if (wait) return json({ ok: false, error: '操作太频繁，请稍后再试', retryAfter: wait }, 429);
    const store = await load(context.env);
    const target = store.comments.find((item) => item.id === String(data.id || ''));
    if (!target) return json({ ok: false, error: '评论不存在' }, 404);
    target.likes = Math.max(0, (target.likes || 0) + (data.action === 'like' ? 1 : -1));
    bucketOf(rates, ip).likes.push(Date.now());
    await save(context.env, store);
    await saveRates(context.env, rates);
    return json({ ok: true, likes: target.likes });
  }

  const content = String(data.content || '').trim().slice(0, 500);
  if (!content) return json({ ok: false, error: '评论内容不能为空' }, 400);
  const wait = postCooldown(rates, ip);
  if (wait) return json({ ok: false, error: '发言太快了，请稍后再试', retryAfter: wait }, 429);
  const nickname = String(data.nickname || '').trim().slice(0, 24) || '访客';
  const parentId = data.parentId ? String(data.parentId) : null;
  const store = await load(context.env);
  if (parentId && !store.comments.some((item) => item.id === parentId)) {
    return json({ ok: false, error: '回复的评论已不存在' }, 400);
  }
  const comment = {
    id: crypto.randomUUID(),
    parentId,
    nickname,
    content,
    likes: 0,
    createdAt: Date.now(),
    token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
  };
  store.comments.push(comment);
  bucketOf(rates, ip).posts.push(Date.now());
  await save(context.env, store);
  await saveRates(context.env, rates);
  return json({ ok: true, comment: strip(comment), deleteToken: comment.token });
}

export async function onRequestDelete(context) {
  if (!context.env.COMMENTS_KV) {
    return json({ ok: false, error: '评论存储未绑定（缺少 COMMENTS_KV）' }, 503);
  }
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const token = context.request.headers.get('x-delete-token');
  const adminKey = context.request.headers.get('x-admin-key');
  const store = await load(context.env);
  const target = store.comments.find((item) => item.id === id);
  if (!target) return json({ ok: false, error: '评论不存在' }, 404);
  const isAdmin =
    Boolean(context.env.COMMENTS_ADMIN_KEY) && adminKey === context.env.COMMENTS_ADMIN_KEY;
  if (!isAdmin && token !== target.token) {
    return json({ ok: false, error: '无权删除这条评论' }, 403);
  }
  store.comments = store.comments.filter((item) => item.id !== id && item.parentId !== id);
  await save(context.env, store);
  return json({ ok: true });
}