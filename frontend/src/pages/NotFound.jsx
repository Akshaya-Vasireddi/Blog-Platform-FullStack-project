import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        <p className="font-mono text-6xl font-medium text-cream-warm mb-4 select-none">404</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-3">Page not found</h1>
        <p className="font-body text-ink-muted mb-8">
          The story you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary">Back to stories</Link>
      </div>
    </div>
  );
}
