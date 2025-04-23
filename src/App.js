import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

import Home from './pages/Home';
import CreateOrEdit from './pages/CreateOrEdit';
import PostDetail from './components/PostDetail';
import CustomizeUI from './components/CustomizeUI';
import Login from './pages/Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [layout, setLayout] = useState(localStorage.getItem('layout') || 'grid');
  const navigate = useNavigate();

  useEffect(() => {
    // 🧠 Ensure guestId is set once
    if (!localStorage.getItem('guestId')) {
      const guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
      localStorage.setItem('userId', guestId);
      console.log("👤 New guest ID assigned:", guestId);
    }

    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        console.log("👤 Logged in as:", user.email);
        setUser(user);
        localStorage.setItem('userId', user.id);
      } else {
        console.log("👤 Continuing as guest:", localStorage.getItem('userId'));
      }
    };

    initUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user;

        if (user) {
          console.log("📥 Auth state changed: Logged in as", user.email);
          setUser(user);
          localStorage.setItem('userId', user.id);
          navigate('/');
        } else {
          console.log("📤 Auth state changed: Logged out");
          setUser(null);
          const guestId = localStorage.getItem('guestId') || uuidv4();
          localStorage.setItem('userId', guestId);
          localStorage.setItem('guestId', guestId);
          console.log("🔁 Reverted to guest:", guestId);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    const guestId = localStorage.getItem('guestId') || uuidv4();
    localStorage.setItem('userId', guestId);
    localStorage.setItem('guestId', guestId);
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="text-primary mb-0">📸 HobbyHub – Photography</h1>
        <CustomizeUI layout={layout} setLayout={setLayout} />
      </div>

      <nav className="my-3 text-center">
        <Link className="btn btn-outline-primary mx-2" to="/">Home</Link>
        <Link className="btn btn-outline-success mx-2" to="/create">Create New Post</Link>

        {user ? (
          <button className="btn btn-outline-danger mx-2" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="btn btn-outline-info mx-2" to="/login">
            Login / Register
          </Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home layout={layout} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/create" element={<CreateOrEdit />} />
        <Route path="/edit/:id" element={<CreateOrEdit />} />
      </Routes>
    </div>
  );
};

export default App;
