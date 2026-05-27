export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizes[size]} border-2 border-cream-warm border-t-ink rounded-full animate-spin`} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="font-sans text-sm text-ink-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12">
      {spinner}
    </div>
  );
}
