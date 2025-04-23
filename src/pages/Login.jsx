import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setLoggingIn(true);
        setTimeout(() => navigate('/'), 500); // short delay to show transition if needed
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-3 text-center">Login or Register</h2>

      {loggingIn && (
        <div className="alert alert-info text-center" role="alert">
          Logging in... Redirecting
        </div>
      )}

      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="default"
        providers={[]} 
      />
    </div>
  );
};

export default Login;
