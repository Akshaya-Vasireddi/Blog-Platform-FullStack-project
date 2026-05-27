import { useState } from 'react';

export default function PostForm({ initialValues = {}, onSubmit, loading, submitLabel = 'Publish' }) {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    content: initialValues.content || '',
    excerpt: initialValues.excerpt || '',
    tags: initialValues.tags?.join(', ') || '',
    published: initialValues.published !== undefined ? initialValues.published : true,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.content.trim()) { setError('Content is required'); return; }
    if (form.content.trim().length < 10) { setError('Content must be at least 10 characters'); return; }

    setError('');
    const tags = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);

    try {
      await onSubmit({ ...form, tags });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Give your story a compelling title..."
          className="input font-display text-lg"
          maxLength={200}
          required
        />
        <p className="mt-1 font-sans text-xs text-ink-muted text-right">{form.title.length}/200</p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-1.5">
          Excerpt <span className="text-ink-muted font-normal">(optional — shown in cards)</span>
        </label>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="A brief summary of your story..."
          rows={2}
          maxLength={300}
          className="input resize-none"
        />
        <p className="mt-1 font-sans text-xs text-ink-muted text-right">{form.excerpt.length}/300</p>
      </div>

      {/* Content */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your story here... You can use basic Markdown formatting."
          rows={18}
          className="input resize-y font-body text-sm leading-relaxed"
          required
        />
        <p className="mt-1 font-sans text-xs text-ink-muted">
          {form.content.length} characters · Markdown supported
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-1.5">
          Tags <span className="text-ink-muted font-normal">(comma-separated, up to 10)</span>
        </label>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="technology, writing, ideas"
          className="input text-sm"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          id="published"
          checked={form.published}
          onChange={handleChange}
          className="w-4 h-4 accent-amber"
        />
        <label htmlFor="published" className="font-sans text-sm text-ink cursor-pointer">
          Publish immediately
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
          <p className="font-sans text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading && <div className="spinner w-4 h-4" />}
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => history.back()} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}
