import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import PostForm from './PostForm';
import Navbar from '../components/Navbar';

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {status === 'published' ? '✔ Published' : '○ Draft'}
    </span>
  );
}

function ConfirmDialog({ post, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal confirm-dialog">
        <div className="modal-body" style={{ textAlign: 'center', paddingTop: 32 }}>
          <div className="confirm-icon">🗑</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Delete Post?</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>&ldquo;{post?.title}&rdquo;</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel} id="btn-cancel-delete">
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            id="btn-confirm-delete"
          >
            {loading ? '⏳ Deleting...' : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Posts() {
  const [posts, setPosts]               = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editingPost, setEditingPost]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
    showSuccess(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
  };

  const handleDeleteClick = (post) => setDeleteTarget(post);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPosts();
      showSuccess('Post deleted successfully.');
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toISOString().slice(0, 10);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1>Post Management System</h1>
          <p>Manage your posts efficiently</p>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: 20, animation: 'slideUp .3s ease' }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Posts Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Posts</h2>
            <button
              id="btn-create-post"
              className="btn btn-primary"
              onClick={handleCreate}
            >
              + Create New
            </button>
          </div>

          {loadingPosts ? (
            <div className="loading-container">
              <div className="spinner" />
              <span>Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3>No posts yet</h3>
              <p>Get started by creating your first post.</p>
              <button className="btn btn-primary" onClick={handleCreate}>
                + Create First Post
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <tr key={post.id}>
                      <td className="table-num">{index + 1}</td>
                      <td>
                        <span className="table-link" style={{ cursor: 'default' }}>
                          {post.title}
                        </span>
                      </td>
                      <td className="table-muted">{post.author}</td>
                      <td className="table-muted">{post.category}</td>
                      <td><StatusBadge status={post.status} /></td>
                      <td className="table-muted">{formatDate(post.created_at)}</td>
                      <td>
                        <div className="btn-actions">
                          <button
                            id={`btn-edit-${post.id}`}
                            className="btn-icon btn-icon-edit"
                            onClick={() => handleEdit(post)}
                            title="Edit post"
                            aria-label={`Edit ${post.title}`}
                          >
                            ✏
                          </button>
                          <button
                            id={`btn-delete-${post.id}`}
                            className="btn-icon btn-icon-delete"
                            onClick={() => handleDeleteClick(post)}
                            title="Delete post"
                            aria-label={`Delete ${post.title}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Modal */}
      {showForm && (
        <PostForm
          post={editingPost}
          onSaved={handleFormSaved}
          onClose={() => { setShowForm(false); setEditingPost(null); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmDialog
          post={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
