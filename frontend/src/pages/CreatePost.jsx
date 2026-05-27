import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostForm from '../components/PostForm';
import { useState } from 'react';

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await postsAPI.create(formData);
      navigate(`/post/${data.post._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Write a story</h1>
        <p className="font-body text-ink-muted">Share your ideas with the world</p>
      </div>
      <PostForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish story" />
    </div>
  );
}
