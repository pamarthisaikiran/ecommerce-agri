import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './index.css'; // Import your CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear errors before submission

    try {
      const response = await fetch(`${'https://rdotingdflwbvuuhkprj.supabase.co'}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'your-api-key-here', // Replace with your actual key
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, redirect to homepage or dashboard
        console.log('Logged in:', data);
        navigate('/dashboard'); // Or wherever you want to navigate after login
      } else {
        setError(data.msg || 'Error logging in');
      }
    } catch (error) {
      setError('Something went wrong! ' + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Link to="/signup">
        <button className="link-button">Don't have an account? Sign Up</button>
      </Link>
    </div>
  );
};

export default Login;
