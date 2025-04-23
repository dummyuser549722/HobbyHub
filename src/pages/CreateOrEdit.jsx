import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getActiveUserId } from '../utils/user';

const flagOptions = ['Landscape', 'Portrait', 'Macro', 'Street', 'Travel'];

const CreateOrEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    authorKey: '',
    flags: [],
    repostOf: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (editing) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          return;
        }

        setFormData({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          authorKey: '',
          flags: data.flags || [],
          repostOf: data.repostOf || ''
        });
      }
    };

    fetchPost();
  }, [id, editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFlagToggle = (flag) => {
    setFormData(prev => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter(f => f !== flag)
        : [...prev.flags, flag]
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.authorKey) {
      alert('Please fill in required fields.');
      return;
    }

    const userId = await getActiveUserId();
    const { data: authData } = await supabase.auth.getUser();
    const userEmail = authData?.user?.email || null;

    if (editing) {
      const { data: existingPost } = await supabase
        .from('posts')
        .select('authorKey')
        .eq('id', id)
        .single();

      if (existingPost.authorKey !== formData.authorKey) {
        alert("Author key doesn't match.");
        return;
      }

      await supabase.from('posts').update({
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        flags: formData.flags,
        repostOf: formData.repostOf || null
      }).eq('id', id);
    } else {
      await supabase.from('posts').insert([{
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        authorKey: formData.authorKey,
        flags: formData.flags,
        repostOf: formData.repostOf || null,
        userId,
        userEmail,
        upvotes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      }]);
    }

    navigate('/');
  };

  return (
    <div className="card shadow p-4">
      <h2>{editing ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Title *</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Image/Video URL *</label>
          <input
            name="imageUrl"
            className="form-control"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Paste external image or YouTube video URL"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Or Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileUpload}
          />
        </div>

        {formData.imageUrl && (
          <div className="mb-3">
            <label className="form-label">Preview:</label>
            {formData.imageUrl.includes('youtube') ? (
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${formData.imageUrl.split('v=')[1]?.split('&')[0] || formData.imageUrl.split('/').pop()}`}
                  title="YouTube Preview"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={formData.imageUrl}
                alt="preview"
                className="img-fluid border rounded"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            )}
          </div>
        )}

        <div className="form-group mb-3">
          <label>Description</label>
          <textarea
            name="content"
            className="form-control"
            rows="3"
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Flags (optional)</label>
          <div className="d-flex flex-wrap">
            {flagOptions.map(flag => (
              <div key={flag} className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={flag}
                  checked={formData.flags.includes(flag)}
                  onChange={() => handleFlagToggle(flag)}
                />
                <label className="form-check-label" htmlFor={flag}>
                  {flag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group mb-3">
          <label>Author Key *</label>
          <input
            name="authorKey"
            className="form-control"
            value={formData.authorKey}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            This key is required to edit or delete your post later.
          </small>
        </div>

        <div className="form-group mb-3">
          <label>Repost of Post ID (optional)</label>
          <input
            name="repostOf"
            className="form-control"
            value={formData.repostOf}
            onChange={handleChange}
            placeholder="Enter another post's ID to repost"
          />
        </div>

        <button className="btn btn-success" type="submit">
          {editing ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrEdit;
