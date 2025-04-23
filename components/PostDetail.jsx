import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../../../utils/storage';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [authorKey, setAuthorKey] = useState('');
  const post = getPostById(id);

  if (!post) return <p>Post not found</p>;

  const handleUpvote = () => {
    updatePost({ ...post, upvotes: post.upvotes + 1 });
    navigate(0); // reload current route to see change
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      text: commentText,
      user: 'Anonymous'
    };
    updatePost({ ...post, comments: [...post.comments, newComment] });
    setCommentText('');
    navigate(0);
  };

  const handleDelete = () => {
    if (authorKey !== post.authorKey) {
      alert("Incorrect author key.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { deletePost } = require('../../../utils/storage');
      deletePost(post.id);
      navigate('/');
    }
  };

  const renderMedia = () => {
    if (post.imageUrl.includes('youtube') || post.imageUrl.includes('youtu.be')) {
      const videoId = post.imageUrl.split('v=')[1]?.split('&')[0] ||
                      post.imageUrl.split('/').pop();
      return (
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    return <img src={post.imageUrl} alt={post.title} className="img-fluid mb-3" />;
  };

  return (
    <div className="card p-4 shadow">
      <h2>{post.title}</h2>
      {renderMedia()}
      <p>{post.content}</p>
      <p><strong>⬆️ {post.upvotes}</strong> | 🕓 {new Date(post.createdAt).toLocaleString()}</p>
      <p><strong>Tags:</strong> {post.flags?.join(', ') || 'None'}</p>

      <button className="btn btn-outline-primary me-2" onClick={handleUpvote}>Upvote</button>

      <div className="mt-4">
        <h5>Comments</h5>
        <ul className="list-group mb-3">
          {post.comments.map(comment => (
            <li key={comment.id} className="list-group-item">
              {comment.text}
            </li>
          ))}
        </ul>

        <div className="input-group">
          <input
            className="form-control"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleAddComment}>Post</button>
        </div>
      </div>

      <div className="mt-4">
        <h6>Delete Post</h6>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Enter author key to delete"
          value={authorKey}
          onChange={(e) => setAuthorKey(e.target.value)}
        />
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default PostDetail;
