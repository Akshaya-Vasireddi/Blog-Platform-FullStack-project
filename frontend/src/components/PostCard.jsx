import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, index = 0 }) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const authorName = post.author?.name || 'Anonymous';
  const authorInitial = authorName[0].toUpperCase();

  return (
    <article
      className="card p-6 page-enter"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      )}

      {/* Title */}
      <Link to={`/post/${post._id}`} className="group">
        <h2 className="font-display text-xl font-semibold text-ink group-hover:text-amber-ink transition-colors leading-snug mb-2">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="font-body text-sm text-ink-muted leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-cream-warm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ink text-cream flex items-center justify-center text-xs font-sans font-medium">
            {authorInitial}
          </div>
          <div>
            <p className="font-sans text-xs font-medium text-ink">{authorName}</p>
            <p className="font-sans text-xs text-ink-muted">{timeAgo}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-ink-muted">
          {post.commentCount !== undefined && (
            <span className="flex items-center gap-1 text-xs font-sans">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.commentCount}
            </span>
          )}
          <Link
            to={`/post/${post._id}`}
            className="text-xs font-sans font-medium text-amber-ink hover:underline"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
