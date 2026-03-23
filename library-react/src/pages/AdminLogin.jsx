import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { twoFactorAPI } from '../services/twoFactorApi';
import './Auth.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password, 'admin');
    
    if (result.success) {
      // Check if 2FA is enabled
      const twoFactorResult = await twoFactorAPI.getSettings('admin');
      
      if (twoFactorResult.success && twoFactorResult.data.isConfigured) {
        // 2FA is enabled, redirect to verification page
        navigate('/two-factor-verify', {
          state: { userId: 'admin', userType: 'admin' }
        });
      } else {
        // No 2FA, go to dashboard
        navigate('/admin/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Admin Login</h2>
            <p>Online Library Management System</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Default credentials: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
