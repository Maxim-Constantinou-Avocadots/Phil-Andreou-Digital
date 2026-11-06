import React, { Component, Suspense, lazy, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { tr, isGreek, localPath, dateLabel, metaLine } from "./i18n.js";
import { createBlogFeedStore } from "/js/wix/blog-feed-store.js";
import { createPostStore } from "/js/wix/post-store.js";
import { createCommentsStore } from "/js/wix/comments-store.js";
import { fetchTagBySlug } from "/js/wix/taxonomy.js";
import { formatCount, postMetaLine } from "/js/wix/posts.js";
import { imgAttrs } from "/js/wix/media.js";
import { localizePost } from "./blog-localization.js";

const RichContent = lazy(() => import("./RichContent"));
const postHref = (slug) => `${localPath("/blog/post.html")}?slug=${encodeURIComponent(slug)}`;
const tagHref = (slug) => `${localPath("/blog.html")}?tag=${encodeURIComponent(slug)}`;

function Arrow() {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

function useStore(store) {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  useEffect(() => { store.start(); return () => store.stop(); }, [store]);
  return state;
}

function ErrorState({ children = tr("The articles couldn’t be loaded.") }) {
  return <div className="blog-state blog-error" role="alert"><h2>{tr("A little interruption")}</h2><p>{children} {tr("Please try again.")}</p><button className="button secondary" onClick={() => window.location.reload()}>{tr("Try again")} <Arrow /></button></div>;
}

function Loading({ article = false }) {
  return <div className={`blog-loading ${article ? "article-loading" : ""}`} aria-busy="true" role="status"><span className="visually-hidden">{tr(article ? "Loading article…" : "Loading articles…")}</span>{Array.from({ length: article ? 1 : 3 }, (_, index) => <div key={index} className="post-skeleton"><div /><span /><span /></div>)}</div>;
}

function PostCard({ post }) {
  post = localizePost(post);
  return <article className="post-card"><a href={postHref(post.slug)} className="post-card-link" aria-label={`${tr("Read article:")} ${post.title}`}>
    {post.coverUrl && <div className="post-card-image"><img {...imgAttrs(post.coverUrl, "(min-width: 1000px) 30vw, (min-width: 650px) 45vw, 100vw", 1 / 2)} alt={post.coverAlt} /></div>}
    <div className="post-card-copy"><div className="post-card-details"><time dateTime={post.dateISO}>{metaLine(post)}</time><h2>{post.title}</h2>{post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}{post.authorName && <p className="post-author">{tr("By")} {post.authorName}</p>}</div><span className="post-read" aria-hidden="true">{tr("Read article")} <Arrow /></span></div>
  </a></article>;
}

function Feed({ initialTagId, tagLabel }) {
  const store = useMemo(() => createBlogFeedStore({ initialTagId, pageSize: 6 }), [initialTagId]);
  const state = useStore(store);
  const categories = state.categories.filter((category) => category.postCount > 0);
  return <>
    {tagLabel && <p className="tag-filter">{tr("Tagged:")} {tr(tagLabel)} <a href={localPath("/blog.html")}>{tr("View all articles")} <Arrow /></a></p>}
    {categories.length > 1 && <div className="blog-filters" role="group" aria-label={tr("Filter articles by category")}><button className="button secondary" aria-pressed={!state.activeCategoryId && !state.activeTagId} onClick={() => store.setActiveCategoryId(null)}>{tr("All articles")}</button>{categories.map((category) => <button className="button secondary" key={category.id} aria-pressed={state.activeCategoryId === category.id} onClick={() => store.setActiveCategoryId(category.id)}>{tr(category.label)}</button>)}</div>}
    {state.error && <ErrorState />}
    {state.posts === null ? <Loading /> : state.posts.length ? <div className="blog-grid">{state.posts.map((post) => <PostCard key={post.id} post={post} />)}</div> : !state.error && <div className="blog-state"><h2>{tr("More to come")}</h2><p>{tr("There are no published articles here yet. Check back for the latest from our team.")}</p><a className="button secondary" href={localPath("/")}>{tr("Explore our website")} <Arrow /></a></div>}
    {state.hasMore && <div className="blog-more"><button className="button secondary" disabled={state.loadingMore} onClick={store.loadMore}>{state.loadingMore ? tr("Loading articles…") : tr("More articles")}<Arrow /></button></div>}
  </>;
}

function BlogIndex() {
  const slug = new URLSearchParams(window.location.search).get("tag");
  const [tag, setTag] = useState(slug ? undefined : null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!slug) return;
    let active = true;
    fetchTagBySlug(slug).then((value) => { if (active) setTag(value); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [slug]);
  if (error) return <ErrorState />;
  if (tag === undefined) return <Loading />;
  if (slug && !tag) return <NotFound />;
  return <Feed initialTagId={tag?.id} tagLabel={tag?.label} />;
}

function NotFound() {
  useEffect(() => { document.title = tr("Article not found | Phil Andreou Digital"); }, []);
  return <div className="blog-state"><p className="quote-eyebrow">{tr("Article not found")}</p><h1>{tr("A little")}<br />{tr("off course")}</h1><p>{tr("This article may have moved or been unpublished.")}</p><a className="button primary" href={localPath("/blog.html")}>{tr("Back to the blog")} <Arrow /></a></div>;
}

class BodyBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <div className="article-fallback">{this.props.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>;
    return this.props.children;
  }
}

function CommentForm({ onSubmit, disabled, replying = false, onCancel }) {
  const [text, setText] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (text.trim() && await onSubmit(text.trim())) setText("");
  };
  return <form className="comment-form" onSubmit={submit}><label>{replying ? tr("Your reply") : tr("Join the conversation")}<textarea rows="3" maxLength="5000" value={text} disabled={disabled} onChange={(event) => setText(event.target.value)} placeholder={replying ? tr("Write your reply") : tr("Share a thought or ask a question")} /></label><div className="review-actions"><button className="button secondary" type="submit" disabled={disabled || !text.trim()}>{disabled ? tr("Posting…") : replying ? tr("Post reply") : tr("Post comment")}<Arrow /></button>{onCancel && <button className="button tertiary" type="button" onClick={onCancel}>{tr("Cancel")}</button>}</div></form>;
}

function Comment({ comment, saving, onReply, onRemove }) {
  return <><div className="comment-byline">{comment.authorName && <strong>{comment.authorName}</strong>}{comment.parentAuthorName && <span>{tr("replying to")} {comment.parentAuthorName}</span>}{comment.dateLabel && <time dateTime={comment.dateISO}>{dateLabel(comment.dateISO)}</time>}{comment.status === "PENDING" && <span>{tr("Awaiting approval")}</span>}</div><div className="comment-text">{comment.status === "DELETED" ? <p>{tr("This comment was deleted.")}</p> : comment.text.split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}</div><div className="comment-actions">{comment.status !== "DELETED" && <button type="button" onClick={onReply}>{tr("Reply")}</button>}{comment.isOwn && <button type="button" disabled={saving} onClick={() => onRemove(comment.id)}>{tr("Delete")}</button>}</div></>;
}

function Comments({ referenceId }) {
  const store = useMemo(() => createCommentsStore({ referenceId, pageSize: 10 }), [referenceId]);
  const state = useStore(store);
  const [replyTo, setReplyTo] = useState(null);
  return <section className="article-comments" aria-labelledby="comments-title"><div className="comments-heading"><h2 id="comments-title">{tr("The conversation")}</h2><label>{tr("Sort comments")}<select value={state.sort} onChange={(event) => store.setSort(event.target.value)}><option value="NEWEST_FIRST">{tr("Newest first")}</option><option value="OLDEST_FIRST">{tr("Oldest first")}</option></select></label></div>
    {state.needsSignIn ? <p className="comment-status" role="status">{tr("Sign in to your site member account to comment on this post.")}</p> : <CommentForm disabled={state.saving} onSubmit={(text) => store.create(text)} />}
    {state.error && !state.needsSignIn && <p className="field-error" role="alert">{tr("The conversation couldn’t be updated. Please try again.")}</p>}
    {state.comments === null ? <p role="status">{tr("Loading comments…")}</p> : state.comments.length ? <ul className="comment-list">{state.comments.map((comment) => {
      const thread = state.replies[comment.id];
      const replies = thread?.comments || [];
      const remaining = Math.max(0, comment.replyCount - replies.length);
      return <li key={comment.id}><Comment comment={comment} saving={state.saving} onReply={() => setReplyTo({ parentId: comment.id, topLevelId: comment.id })} onRemove={store.remove} />{replies.length > 0 && <ul className="comment-replies">{replies.map((reply) => <li key={reply.id}><Comment comment={reply} saving={state.saving} onReply={() => setReplyTo({ parentId: reply.id, topLevelId: comment.id })} onRemove={store.remove} /></li>)}</ul>}{replyTo?.topLevelId === comment.id && !state.needsSignIn && <CommentForm replying disabled={state.saving} onCancel={() => setReplyTo(null)} onSubmit={async (text) => { const result = await store.create(text, replyTo); if (result) setReplyTo(null); return result; }} />}{(remaining > 0 || thread?.nextCursor) && <button className="button tertiary" disabled={thread?.loading} onClick={() => store.loadReplies(comment.id)}>{thread?.loading ? tr("Loading replies…") : remaining > 0 ? isGreek ? `Εμφάνιση ${remaining} ${remaining === 1 ? "απάντησης" : "απαντήσεων"}` : `Show ${remaining} ${remaining === 1 ? "reply" : "replies"}` : tr("More replies")}</button>}</li>;
    })}</ul> : !state.error && <p className="comment-status">{tr("No comments yet.")}</p>}
    {state.hasMore && <button className="button secondary" disabled={state.loadingMore} onClick={store.loadMore}>{state.loadingMore ? tr("Loading comments…") : tr("More comments")}<Arrow /></button>}
  </section>;
}

function Article({ slug }) {
  const store = useMemo(() => createPostStore({ slug }), [slug]);
  const state = useStore(store);
  const post = localizePost(state.post);
  useEffect(() => {
    if (!post) return;
    document.title = post.seoTitle || post.title;
    document.querySelector('meta[name="description"]').content = post.seoDescription;
    document.querySelector('meta[property="og:title"]').content = post.seoTitle || post.title;
    document.querySelector('meta[property="og:description"]').content = post.seoDescription;
    document.querySelector('meta[property="og:type"]').content = "article";
  }, [post]);
  if (state.notFound) return <NotFound />;
  if (state.error) return <ErrorState>{tr("The article couldn’t be loaded.")}</ErrorState>;
  if (!post) return <Loading article />;
  return <>
    <article className="blog-article"><header className="article-heading"><a className="button tertiary back-blog" href={localPath("/blog.html")}>{tr("All articles")} <Arrow /></a>{state.categories.length > 0 && <p className="article-categories">{state.categories.map((category) => tr(category.label)).join(" · ")}</p>}<h1>{post.title}</h1><div className="article-meta">{post.authorName && <span>{tr("By")} {post.authorName}</span>}<time dateTime={post.dateISO}>{metaLine(post)}</time>{post.updatedLabel && post.updatedISO !== post.dateISO && <span>{tr("Updated")} <time dateTime={post.updatedISO}>{dateLabel(post.updatedISO)}</time></span>}</div></header>
      {post.coverUrl && <figure className="article-cover"><img {...imgAttrs(post.coverUrl, "(min-width: 1024px) 90vw, 100vw", 9 / 16)} loading="eager" alt={post.coverAlt} /></figure>}
      <div className="article-reading">{isGreek && !post.translated && <p className="article-language-note">{tr("This article is currently available in English.")}</p>}<BodyBoundary paragraphs={post.paragraphs}><Suspense fallback={<p className="article-body-loading" role="status">{tr("Loading article content…")}</p>}><RichContent content={post.richContent} fallbackParagraphs={post.paragraphs} /></Suspense></BodyBoundary>
        <div className="article-engagement">{state.viewCount !== undefined && <span>{formatCount(state.viewCount)} {isGreek ? state.viewCount === 1 ? "προβολή" : "προβολές" : "views"}</span>}{state.commentCount !== undefined && <span>{formatCount(state.commentCount)} {isGreek ? state.commentCount === 1 ? "σχόλιο" : "σχόλια" : "comments"}</span>}<button className="button secondary like-button" aria-pressed={state.isLiked} disabled={state.liking} onClick={store.toggleLike}><svg className="icon" viewBox="0 0 24 24" fill={state.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>{state.isLiked ? tr("Liked") : tr("Like article")}{state.likeCount !== undefined && <span>{formatCount(state.likeCount)}</span>}</button></div>
        {state.tags.length > 0 && <div className="article-tags">{state.tags.map((tag) => <a className="button tertiary" href={tagHref(tag.slug)} key={tag.id}>{tr(tag.label)}</a>)}</div>}
        {post.commentingEnabled && post.referenceId && <Comments referenceId={post.referenceId} />}
      </div>
    </article>
    {state.related?.length > 0 && <aside className="related-posts"><div className="related-posts-heading"><h2>{tr("Keep reading")}</h2><a className="button secondary" href={localPath("/blog.html")}>{tr("All articles")} <Arrow /></a></div><div className="blog-grid">{state.related.map((related) => <PostCard key={related.id} post={related} />)}</div></aside>}
  </>;
}

const container = document.querySelector("#blog-app");
if (container) {
  const slug = new URLSearchParams(window.location.search).get("slug");
  createRoot(container).render(container.dataset.view === "post" ? slug ? <Article slug={slug} /> : <NotFound /> : <BlogIndex />);
}
