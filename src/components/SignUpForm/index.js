import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import your CSS file

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear errors before submission

    try {
      const response = await fetch(`${'https://rdotingdflwbvuuhkprj.supabase.co'}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'your-api-key-here', // Replace with your actual key
        },
        body: JSON.stringify({ email, password, mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful signup, redirect to login page
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        setError(data.msg || 'Error creating account');
      }
    } catch (error) {
      setError('Something went wrong! ' + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => navigate('/login')} className="link-button">Already have an account? Log In</button>
    </div>
  );
};

export default SignUp;
