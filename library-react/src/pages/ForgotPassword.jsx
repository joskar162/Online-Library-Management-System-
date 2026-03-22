import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Simulate password reset (in production, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always show success
    setMessage('Password reset link has been sent to your email address.');
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Forgot Password</h2>
            <p>Online Library Management System</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enter Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p><Link to="/">Back to Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
