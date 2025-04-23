import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getActiveUserId } from '../utils/user';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching post:', error);
        return;
      }

      setPost(data);
      const uid = await getActiveUserId();
      setCurrentUserId(uid);
    };

    load();
  }, [id]);

  if (!post) return <p>Post not found</p>;

  const handleUpvote = async () => {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: (post.upvotes || 0) + 1 })
      .eq('id', post.id);

    if (!error) navigate(0);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      user: currentUserId
    };

    const updatedComments = [...(post.comments || []), newComment];

    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id);

    if (!error) {
      setCommentText('');
      navigate(0);
    }
  };

  const handleDeletePost = async () => {
    const key = prompt("Enter author key to delete this post:");
    if (key === post.authorKey) {
      const confirmed = window.confirm("Are you sure you want to delete this post?");
      if (confirmed) {
        const { error } = await supabase.from('posts').delete().eq('id', post.id);
        if (!error) navigate('/');
      }
    } else {
      alert("Incorrect key.");
    }
  };

  const handleEditPost = () => {
    const key = prompt("Enter author key to edit this post:");
    if (key === post.authorKey) {
      navigate(`/edit/${post.id}`);
    } else {
      alert("Incorrect key.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const key = prompt("Enter author key to delete this comment:");
    if (key === post.authorKey) {
      const updatedComments = post.comments.filter(c => c.id !== commentId);
      const { error } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', post.id);
      if (!error) navigate(0);
    } else {
      alert("Incorrect key.");
    }
  };

  const handleRepost = async () => {
    const repost = {
      ...post,
      id: undefined,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: [],
      repostOf: post.id,
      title: `[Repost] ${post.title}`,
      userId: currentUserId
    };

    const { error } = await supabase.from('posts').insert(repost);
    if (!error) alert('Post successfully reposted!');
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
      <p className="text-muted small">🆔 Post ID: <code>{post.id}</code></p>
      <p className="text-muted small">
        Posted by <code>{post.userEmail || post.userId}</code>
      </p>
      <p><strong>Tags:</strong> {post.flags?.join(', ') || 'None'}</p>
      {post.repostOf && (
        <p className="text-muted">
          📢 Reposted from{' '}
          <a href={`/post/${post.repostOf}`} className="text-decoration-underline">
            Post #{post.repostOf.slice(0, 6)}...
          </a>
        </p>
      )}

      <button className="btn btn-outline-primary me-2" onClick={handleUpvote}>Upvote</button>

      <div className="mt-4">
        <h5>Comments</h5>
        <ul className="list-group mb-3">
          {(post.comments || []).map(comment => (
            <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{comment.user}:</strong> {comment.text}
              </div>
              {post.userId === currentUserId && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  🗑️
                </button>
              )}
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

      {post.userId === currentUserId && (
        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-info" onClick={handleEditPost}>Edit Post</button>
          <button className="btn btn-danger" onClick={handleDeletePost}>Delete Post</button>
        </div>
      )}

      <div className="mt-4">
        <h6>Repost</h6>
        <button className="btn btn-warning" onClick={handleRepost}>
          Repost This Post
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
