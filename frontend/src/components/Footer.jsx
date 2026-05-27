import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-cream-warm bg-cream-dark mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-display font-bold text-lg text-ink">
            Inkwell
          </Link>
          <p className="font-sans text-sm text-ink-muted">
            © {new Date().getFullYear()} Inkwell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
