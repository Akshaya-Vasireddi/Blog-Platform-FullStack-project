import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await postsAPI.getAll({ page, limit: 9, search: search || undefined });
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-14 page-enter">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
          Stories Worth <em className="text-amber-ink not-italic">Reading</em>
        </h1>
        <p className="font-body text-ink-muted text-lg max-w-xl mx-auto mb-8">
          A space for thoughtful writing, ideas, and perspectives from writers who care about their craft.
        </p>

        {isAuthenticated ? (
          <Link to="/create-post" className="btn-primary">
            Write a story
          </Link>
        ) : (
          <div className="flex justify-center gap-3">
            <Link to="/register" className="btn-primary">Start writing</Link>
            <Link to="/login" className="btn-secondary">Sign in</Link>
          </div>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-10 max-w-md mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search stories..."
          className="input flex-1 text-sm"
        />
        <button type="submit" className="btn-primary text-sm px-4">Search</button>
        {search && (
          <button type="button" onClick={clearSearch} className="btn-secondary text-sm px-4">
            Clear
          </button>
        )}
      </form>

      {search && (
        <p className="font-sans text-sm text-ink-muted mb-6 text-center">
          Results for "<span className="text-ink font-medium">{search}</span>"
          {pagination && ` — ${pagination.total} found`}
        </p>
      )}

      {/* Posts grid */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="font-sans text-red-600 mb-4">{error}</p>
          <button onClick={loadPosts} className="btn-secondary text-sm">Try again</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-ink-muted mb-3">No stories yet</p>
          <p className="font-body text-ink-muted mb-6">
            {search ? 'Try a different search term.' : 'Be the first to share your story.'}
          </p>
          {isAuthenticated && !search && (
            <Link to="/create-post" className="btn-primary">Write the first story</Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="font-sans text-sm text-ink-muted">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
