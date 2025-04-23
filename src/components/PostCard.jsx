import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, showId = false }) => {
  if (!post || !post.title || !post.imageUrl) return null;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : 'Unknown date';

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={post.imageUrl}
        className="card-img-top"
        alt={post.title}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={post.title}>
          {post.title}
        </h5>

        {showId && (
          <small className="text-muted d-block mb-1">
            🆔 ID: <code>{post.id}</code>
          </small>
        )}

        <p className="card-text mb-2">
          ⬆️ {post.upvotes || 0} | 🕓 {formattedDate}
        </p>

        {post.flags?.length > 0 && (
          <div className="mb-2">
            {post.flags.map(flag => (
              <span key={flag} className="badge bg-secondary me-1">{flag}</span>
            ))}
          </div>
        )}

        <Link to={`/post/${post.id}`} className="btn btn-sm btn-primary mt-auto">
          View Post
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
