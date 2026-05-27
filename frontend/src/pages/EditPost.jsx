import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditPost() {
  const { id } = useParams();
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await postsAPI.getById(id);
        if (!isOwner(data.post.author?._id || data.post.author)) {
          navigate(`/post/${id}`);
          return;
        }
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isOwner, navigate]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await postsAPI.update(id, formData);
      navigate(`/post/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
      <p className="font-sans text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Edit story</h1>
        <p className="font-body text-ink-muted">Make your changes below</p>
      </div>
      {post && (
        <PostForm
          initialValues={post}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save changes"
        />
      )}
    </div>
  );
}
