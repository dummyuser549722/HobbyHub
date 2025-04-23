import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getPosts } from '../utils/storage';

const flagOptions = ['Landscape', 'Portrait', 'Macro', 'Street', 'Travel'];
const sortOptions = ['Newest', 'Most Upvoted'];

const Home = ({ layout = 'grid' }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFlag, setActiveFlag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("📦 Fetching posts...");
        setLoading(true);
        const posts = await getPosts();
        console.log("✅ Received posts:", posts);
        setAllPosts(posts);
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        alert("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = allPosts
    .filter(post => activeFlag === 'All' || post.flags?.includes(activeFlag))
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'Most Upvoted') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!loading && allPosts.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>😕 No posts yet.</h4>
        <p>Be the first to share your photography!</p>
        <Link to="/create" className="btn btn-success mt-2">Create a Post</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <label className="me-2 fw-bold">Sort by:</label>
        <select
          className="form-select w-auto d-inline"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Flag Filters */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        <button
          className={`btn ${activeFlag === 'All' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFlag('All')}
        >
          All
        </button>
        {flagOptions.map(flag => (
          <button
            key={flag}
            className={`btn ${activeFlag === flag ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFlag(flag)}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className={layout === 'list' ? '' : 'row'}>
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className={layout === 'list' ? 'mb-4' : 'col-md-6 col-lg-4 mb-4'}
          >
            <PostCard post={post} showId={true} layout={layout} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
