import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentAPI } from '../services/api';
import './Auth.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Simple hash for demo (in production, use proper hashing)
    const hashedPassword = password;

    const result = await studentAPI.signup(fullName, mobile, email, hashedPassword);
    
    if (result.success) {
      setSuccess(`Registration successful! Your Student ID is: ${result.data.studentId}`);
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
            <h2>User Registration</h2>
            <p>Online Library Management System</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                maxLength="10"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            
            <button type="submit" className="btn btn-danger btn-block" disabled={loading}>
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/">Login Here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
