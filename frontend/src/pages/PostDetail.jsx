import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOwner } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await postsAPI.getById(id);
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await postsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="font-display text-2xl text-ink mb-3">Something went wrong</h1>
      <p className="font-body text-ink-muted mb-6">{error}</p>
      <Link to="/" className="btn-secondary">← Back to stories</Link>
    </div>
  );

  if (!post) return null;

  const authorId = post.author?._id || post.author;
  const authorName = post.author?.name || 'Anonymous';
  const authorInitial = authorName[0].toUpperCase();
  const publishedDate = format(new Date(post.createdAt), 'MMMM d, yyyy');
  const owner = isOwner(authorId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 page-enter">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All stories
      </Link>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight mb-6">
        {post.title}
      </h1>

      {/* Author + meta bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-cream-warm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center font-sans font-medium">
            {authorInitial}
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-ink">{authorName}</p>
            <p className="font-sans text-xs text-ink-muted">
              {publishedDate} · {Math.ceil(post.content.split(/\s+/).length / 200)} min read
            </p>
          </div>
        </div>

        {owner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${post._id}`}
              className="btn-ghost text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger text-sm"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Excerpt (if present) */}
      {post.excerpt && (
        <p className="font-display text-lg text-ink-muted italic leading-relaxed mb-8 pl-4 border-l-2 border-amber">
          {post.excerpt}
        </p>
      )}

      {/* Content */}
      <div className="prose-content">
        {post.content.split('\n').map((para, i) => {
          if (!para.trim()) return <br key={i} />;
          // Basic markdown-ish rendering
          if (para.startsWith('# ')) return <h1 key={i}>{para.slice(2)}</h1>;
          if (para.startsWith('## ')) return <h2 key={i}>{para.slice(3)}</h2>;
          if (para.startsWith('### ')) return <h3 key={i}>{para.slice(4)}</h3>;
          if (para.startsWith('> ')) return <blockquote key={i}>{para.slice(2)}</blockquote>;
          return <p key={i}>{para}</p>;
        })}
      </div>

      {/* Views */}
      <div className="flex items-center gap-2 mt-10 pt-6 border-t border-cream-warm">
        <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-sans text-xs text-ink-muted">{post.views} views</span>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </div>
  );
}
