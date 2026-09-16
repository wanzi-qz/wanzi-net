import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Reply, Send, ShieldCheck, ThumbsUp, Trash2 } from 'lucide-react';

const API = '/api/comments';
const SIZE_KEY = 'wjy_comment_pagesize';
const COOLDOWN_SECONDS = 30;
const NICK_KEY = 'wjy_comment_nick';
const TOKEN_KEY = 'wjy_comment_tokens';
const LIKE_KEY = 'wjy_comment_likes';
const ADMIN_KEY = 'wjy_comment_admin';

function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function hueOf(name) {
  let h = 0;
  for (const ch of String(name)) h = (h * 31 + ch.codePointAt(0)) % 360;
  return h;
}

function Avatar({ name, size = 44 }) {
  const hue = hueOf(name || '?');
  const initial = String(name || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <span
      className="comment-avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `hsl(${hue} 42% 18%)`,
        color: `hsl(${hue} 72% 72%)`,
        borderColor: `hsl(${hue} 55% 42% / 0.55)`,
      }}
    >
      {initial}
    </span>
  );
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function pageItems(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const items = [1];
  if (page > 3) items.push('gap-left');
  for (let p = Math.max(2, page - 1); p <= Math.min(pageCount - 1, page + 1); p += 1) {
    items.push(p);
  }
  if (page < pageCount - 2) items.push('gap-right');
  items.push(pageCount);
  return items;
}

export default function CommentsSection() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalAll, setTotalAll] = useState(0);
  const [nick, setNick] = useState(() => loadJson(NICK_KEY, ''));
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyAt, setReplyAt] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [tokens, setTokens] = useState(() => loadJson(TOKEN_KEY, {}));
  const [liked, setLiked] = useState(() => loadJson(LIKE_KEY, {}));
  const [adminOn, setAdminOn] = useState(() => {
    try {
      return Boolean(window.sessionStorage.getItem(ADMIN_KEY));
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [confirmId, setConfirmId] = useState('');
  const [burstId, setBurstId] = useState('');
  const [pageSize, setPageSize] = useState(() => loadJson(SIZE_KEY, 10));
  const noticeTimer = useRef(0);

  const toast = useCallback((text) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const fetchList = useCallback(async (target = 1, size = 10) => {
    setStatus('loading');
    try {
      const res = await fetch(`${API}?page=${target}&size=${size}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || res.status);
      setComments(Array.isArray(data.comments) ? data.comments : []);
      setPage(data.page || 1);
      setPageCount(data.pageCount || 1);
      setTotalAll(typeof data.totalAll === 'number' ? data.totalAll : 0);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(err.message || '网络异常');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchList(1, pageSize);
  }, [fetchList, pageSize]);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldown((cur) => Math.max(0, cur - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const roots = useMemo(
    () => comments.filter((item) => !item.parentId).sort((a, b) => b.createdAt - a.createdAt),
    [comments],
  );
  const repliesOf = useCallback(
    (id) => comments.filter((item) => item.parentId === id).sort((a, b) => a.createdAt - b.createdAt),
    [comments],
  );

  const rememberToken = useCallback((id, token) => {
    setTokens((prev) => {
      const next = { ...prev, [id]: token };
      saveJson(TOKEN_KEY, next);
      return next;
    });
  }, []);

  const post = useCallback(async (payload) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || res.status);
    return data;
  }, []);

  const submitMain = async () => {
    const content = draft.trim();
    if (!content || submitting || cooldown > 0) return;
    setSubmitting(true);
    try {
      saveJson(NICK_KEY, nick.trim());
      const data = await post({ nickname: nick.trim(), content });
      rememberToken(data.comment.id, data.deleteToken);
      setDraft('');
      setCooldown(COOLDOWN_SECONDS);
      await fetchList(1, pageSize);
      toast('评论发布成功');
    } catch (err) {
      toast(`发布失败：${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (rootId, rootNick) => {
    const body = replyDraft.trim();
    if (!body || submitting || cooldown > 0) return;
    setSubmitting(true);
    try {
      saveJson(NICK_KEY, nick.trim());
      const prefix = replyAt && replyAt !== rootNick ? `@${replyAt} ` : '';
      const data = await post({ nickname: nick.trim(), parentId: rootId, content: prefix + body });
      rememberToken(data.comment.id, data.deleteToken);
      setReplyTo(null);
      setReplyAt('');
      setReplyDraft('');
      setCooldown(COOLDOWN_SECONDS);
      await fetchList(page, pageSize);
      toast('回复成功');
    } catch (err) {
      toast(`回复失败：${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (item) => {
    const wasLiked = Boolean(liked[item.id]);
    const delta = wasLiked ? -1 : 1;
    setComments((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, likes: Math.max(0, (entry.likes || 0) + delta) } : entry,
      ),
    );
    setLiked((prev) => {
      const next = { ...prev };
      if (wasLiked) delete next[item.id];
      else next[item.id] = true;
      saveJson(LIKE_KEY, next);
      return next;
    });
    if (!wasLiked) {
      setBurstId(item.id);
      window.setTimeout(() => setBurstId((cur) => (cur === item.id ? '' : cur)), 1600);
    }
    try {
      const data = await post({ action: wasLiked ? 'unlike' : 'like', id: item.id });
      setComments((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, likes: data.likes } : entry)),
      );
    } catch (err) {
      setComments((prev) =>
        prev.map((entry) =>
          entry.id === item.id ? { ...entry, likes: Math.max(0, (entry.likes || 0) - delta) } : entry,
        ),
      );
      setLiked((prev) => {
        const next = { ...prev };
        if (wasLiked) next[item.id] = true;
        else delete next[item.id];
        saveJson(LIKE_KEY, next);
        return next;
      });
      toast(`点赞失败：${err.message}`);
    }
  };

  const removeComment = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      window.setTimeout(() => setConfirmId((cur) => (cur === id ? '' : cur)), 3000);
      return;
    }
    setConfirmId('');
    const headers = {};
    if (tokens[id]) headers['x-delete-token'] = tokens[id];
    let adminKey = '';
    try {
      adminKey = window.sessionStorage.getItem(ADMIN_KEY) || '';
    } catch {
      adminKey = '';
    }
    if (adminOn && adminKey) headers['x-admin-key'] = adminKey;
    try {
      const res = await fetch(`${API}?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || res.status);
      await fetchList(page, pageSize);
      toast('已删除');
    } catch (err) {
      toast(`删除失败：${err.message}`);
    }
  };

  const toggleAdmin = () => {
    if (adminOn) {
      try {
        window.sessionStorage.removeItem(ADMIN_KEY);
      } catch {
        /* ignore */
      }
      setAdminOn(false);
      toast('已退出管理模式');
      return;
    }
    setAdminInput('');
    setAdminOpen(true);
  };

  const submitAdmin = () => {
    const key = adminInput.trim();
    if (!key) return;
    try {
      window.sessionStorage.setItem(ADMIN_KEY, key);
    } catch {
      /* ignore */
    }
    setAdminOn(true);
    setAdminOpen(false);
    setAdminInput('');
    toast('管理模式已开启');
  };

  const openReply = (rootId, atName) => {
    setReplyTo(rootId);
    setReplyAt(atName || '');
    setReplyDraft('');
  };

  const goToPage = (target) => {
    if (target < 1 || target > pageCount || target === page) return;
    fetchList(target, pageSize);
    const node = document.getElementById('comments');
    if (node) {
      window.scrollTo({
        top: node.getBoundingClientRect().top + window.scrollY - 70,
        behavior: 'smooth',
      });
    }
  };

  const changePageSize = (size) => {
    if (size === pageSize) return;
    saveJson(SIZE_KEY, size);
    setPageSize(size);
  };

  const canDelete = (item) => adminOn || Boolean(tokens[item.id]);
  const cooling = cooldown > 0;

  const likeButton = (item) => (
    <button
      type="button"
      className={`${liked[item.id] ? 'comment-like is-liked' : 'comment-like'}${burstId === item.id ? ' is-burst' : ''}`}
      onClick={() => toggleLike(item)}
      title={liked[item.id] ? '取消点赞' : '点赞'}
    >
      <ThumbsUp size={14} strokeWidth={1.8} fill={liked[item.id] ? 'currentColor' : 'none'} />
      {burstId === item.id && liked[item.id] && <span className="like-plus">+1</span>}
      {item.likes || 0}
    </button>
  );

  return (
    <section className="section comments" id="comments">
      <div className="shell">
        <Reveal className="section-heading">
          <div className="heading-index">06</div>
          <div className="heading-title">
            <p className="eyebrow">Comments / 06</p>
            <h2>
              <span className="mask">
                <span className="mask-line">评论互动</span>
              </span>
            </h2>
          </div>
          <p className="heading-intro">留下你的想法、疑问或一句问候，我会认真回复每一条留言。</p>
        </Reveal>

        <Reveal>
          <div className="comments-board">
            <div className="comments-composer">
              <Avatar name={nick.trim() || '我'} />
              <div className="composer-body">
                <input
                  className="composer-nick"
                  value={nick}
                  maxLength={24}
                  placeholder="昵称（选填，默认「访客」）"
                  onChange={(event) => setNick(event.target.value)}
                />
                <textarea
                  className="composer-input"
                  rows={3}
                  maxLength={500}
                  value={draft}
                  placeholder="说点什么吧…比如哪篇笔记帮到了你，或者网站哪里还能更好"
                  onChange={(event) => setDraft(event.target.value)}
                />
                <div className="composer-foot">
                  <span className="composer-count">
                    {cooling ? `发言冷却 ${cooldown}s` : `${draft.length} / 500`}
                  </span>
                  <button
                    className="composer-submit"
                    type="button"
                    disabled={!draft.trim() || submitting || cooling}
                    onClick={submitMain}
                  >
                    <Send size={15} strokeWidth={1.8} />
                    {cooling ? `冷却 ${cooldown}s` : '发表评论'}
                  </button>
                </div>
              </div>
            </div>

            <div className="comments-meta">
              <span className="comments-count">
                <MessageCircle size={16} strokeWidth={1.7} />
                共 {totalAll} 条评论
              </span>
              {adminOpen ? (
                <span className="comments-admin-form">
                  <input
                    type="password"
                    value={adminInput}
                    placeholder="管理密码"
                    autoFocus
                    onChange={(event) => setAdminInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitAdmin();
                      if (event.key === 'Escape') setAdminOpen(false);
                    }}
                  />
                  <button type="button" onClick={submitAdmin} disabled={!adminInput.trim()}>
                    确认
                  </button>
                  <button type="button" className="is-ghost" onClick={() => setAdminOpen(false)}>
                    取消
                  </button>
                </span>
              ) : (
                <button className="comments-admin" type="button" onClick={toggleAdmin}>
                  <ShieldCheck size={15} strokeWidth={1.7} />
                  {adminOn ? '退出管理' : 'UP主管理'}
                </button>
              )}
            </div>

            {status === 'loading' && <p className="comments-state">评论加载中…</p>}
            {status === 'error' && (
              <p className="comments-state comments-state-error">
                评论加载失败：{errorMsg}
                <button type="button" onClick={() => fetchList(page, pageSize)}>
                  重试
                </button>
              </p>
            )}
            {status === 'ready' && roots.length === 0 && (
              <p className="comments-state">还没有评论，来抢沙发～</p>
            )}

            {status === 'ready' && roots.length > 0 && (
              <ul className="comments-list">
                {roots.map((root) => {
                  const replies = repliesOf(root.id);
                  return (
                    <li key={root.id} className="comment-item">
                      <Avatar name={root.nickname} />
                      <div className="comment-main">
                        <div className="comment-head">
                          <strong className="comment-nick">{root.nickname}</strong>
                          <span className="comment-floor">#{root.floor}</span>
                          <span className="comment-time">{timeAgo(root.createdAt)}</span>
                        </div>
                        <p className="comment-content">{root.content}</p>
                        <div className="comment-actions">
                          {likeButton(root)}
                          <button type="button" onClick={() => openReply(root.id, '')}>
                            <Reply size={14} strokeWidth={1.8} />
                            回复
                          </button>
                          {canDelete(root) && (
                            <button type="button" className={confirmId === root.id ? 'is-danger is-armed' : 'is-danger'} onClick={() => removeComment(root.id)}>
                              <Trash2 size={14} strokeWidth={1.8} />
                              {confirmId === root.id ? '确认删除？' : '删除'}
                            </button>
                          )}
                        </div>

                        {replyTo === root.id && (
                          <div className="reply-composer">
                            <textarea
                              rows={2}
                              maxLength={500}
                              value={replyDraft}
                              placeholder={`回复 @${replyAt || root.nickname}…`}
                              onChange={(event) => setReplyDraft(event.target.value)}
                            />
                            <div className="reply-composer-foot">
                              <button
                                type="button"
                                className="is-ghost"
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyAt('');
                                  setReplyDraft('');
                                }}
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                disabled={!replyDraft.trim() || submitting || cooling}
                                onClick={() => submitReply(root.id, root.nickname)}
                              >
                                {cooling ? `冷却 ${cooldown}s` : '回复'}
                              </button>
                            </div>
                          </div>
                        )}

                        {replies.length > 0 && (
                          <ul className="reply-list">
                            {replies.map((reply) => (
                              <li key={reply.id} className="reply-item">
                                <Avatar name={reply.nickname} size={32} />
                                <div className="comment-main">
                                  <div className="comment-head">
                                    <strong className="comment-nick">{reply.nickname}</strong>
                                    <span className="comment-time">{timeAgo(reply.createdAt)}</span>
                                  </div>
                                  <p className="comment-content">{reply.content}</p>
                                  <div className="comment-actions">
                                    {likeButton(reply)}
                                    <button type="button" onClick={() => openReply(root.id, reply.nickname)}>
                                      <Reply size={14} strokeWidth={1.8} />
                                      回复
                                    </button>
                                    {canDelete(reply) && (
                                      <button
                                        type="button"
                                        className={confirmId === reply.id ? 'is-danger is-armed' : 'is-danger'}
                                        onClick={() => removeComment(reply.id)}
                                      >
                                        <Trash2 size={14} strokeWidth={1.8} />
                                        {confirmId === reply.id ? '确认删除？' : '删除'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {status === 'ready' && totalAll > 0 && (
              <nav className="comments-pager" aria-label="评论分页">
                <span className="pager-size">
                  <span className="pager-size-label">每页</span>
                  {[10, 20].map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={size === pageSize ? 'is-current' : ''}
                      onClick={() => changePageSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </span>
                <span className="pager-pages">
                  {pageCount > 1 && (
                    <>
                      <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                        ‹
                      </button>
                {pageItems(page, pageCount).map((item) =>
                  typeof item === 'string' ? (
                    <span className="pager-gap" key={item}>
                      …
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      className={item === page ? 'is-current' : ''}
                      onClick={() => goToPage(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
                      <button type="button" disabled={page >= pageCount} onClick={() => goToPage(page + 1)}>
                        ›
                      </button>
                    </>
                  )}
                </span>
                <span className="pager-spacer" aria-hidden="true" />
              </nav>
            )}

            {notice && (
              <div className="comments-toast" role="status">
                {notice}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}