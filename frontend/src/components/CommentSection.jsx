import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CommentItem({ comment, onDelete, isOwner }) {
  const [deleting, setDeleting] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    setDeleting(true);
    try {
      await onDelete(comment._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b border-cream-warm last:border-0">
      <div className="w-8 h-8 rounded-full bg-cream-warm flex items-center justify-center text-sm font-sans font-medium text-ink flex-shrink-0">
        {comment.user?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-ink">{comment.user?.name}</span>
            <span className="font-sans text-xs text-ink-muted">{timeAgo}</span>
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-sans text-red-500 hover:text-red-700 disabled:opacity-50 flex-shrink-0"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
        <p className="font-body text-sm text-ink leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { isAuthenticated, isOwner } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await commentsAPI.getByPost(postId);
      setComments(data.comments);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await commentsAPI.add(postId, { text: text.trim() });
      setComments((prev) => [data.comment, ...prev]);
      setTotal((prev) => prev + 1);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    await commentsAPI.delete(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setTotal((prev) => prev - 1);
  };

  return (
    <section className="mt-12 pt-8 border-t border-cream-warm">
      <h2 className="font-display text-xl font-semibold text-ink mb-6">
        {total > 0 ? `${total} Comment${total !== 1 ? 's' : ''}` : 'Comments'}
      </h2>

      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            maxLength={1000}
            className="input resize-none mb-3 font-body text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-ink-muted">{text.length}/1000</span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="btn-primary text-sm"
            >
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 font-sans">{error}</p>}
        </form>
      ) : (
        <div className="bg-cream-dark border border-cream-warm rounded-sm p-4 mb-8 text-center">
          <p className="font-sans text-sm text-ink-muted">
            <Link to="/login" className="text-amber-ink font-medium hover:underline">Sign in</Link>
            {' '}to join the conversation
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-cream-warm border-t-ink rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="font-body text-sm text-ink-muted text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              isOwner={isOwner(comment.user?._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
