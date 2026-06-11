import { useState, useEffect } from 'react';
import api from '../api/axios';

const EMPTY_FORM = {
  title: '', body: '', author: '', category: '', status: 'draft',
};

export default function PostForm({ post, onSaved, onClose }) {
  const isEditing = Boolean(post);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (post) {
      setForm({
        title:    post.title    || '',
        body:     post.body     || '',
        author:   post.author   || '',
        category: post.category || '',
        status:   post.status   || 'draft',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [post]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEditing) {
        await api.put(`/posts/${post.id}`, form);
      } else {
        await api.post('/posts', form);
      }
      onSaved();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Failed to save post.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? '✏️ Edit Post' : '✨ Create New Post'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} id="post-form">
          <div className="modal-body">
            {errors.general && (
              <div className="alert alert-error">⚠️ {errors.general}</div>
            )}

            <div className="form-group">
              <label htmlFor="post-title" className="form-label">Title *</label>
              <input
                id="post-title"
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter post title"
                value={form.title}
                onChange={handleChange}
                required
              />
              {errors.title && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.title[0]}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="post-body" className="form-label">Content *</label>
              <textarea
                id="post-body"
                name="body"
                className="form-control form-textarea"
                placeholder="Write your post content here..."
                value={form.body}
                onChange={handleChange}
                required
              />
              {errors.body && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.body[0]}</small>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="post-author" className="form-label">Author *</label>
                <input
                  id="post-author"
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="Author name"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
                {errors.author && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.author[0]}</small>}
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="post-category" className="form-label">Category *</label>
                <input
                  id="post-category"
                  type="text"
                  name="category"
                  className="form-control"
                  placeholder="e.g. Technology"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
                {errors.category && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.category[0]}</small>}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
              <label htmlFor="post-status" className="form-label">Status *</label>
              <select
                id="post-status"
                name="status"
                className="form-control form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              id="btn-cancel-post"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="btn-save-post"
            >
              {loading
                ? '⏳ Saving...'
                : isEditing ? '✔ Update Post' : '+ Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
