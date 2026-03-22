import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await adminAPI.getProfile();
    if (result.success) {
      setFormData({
        fullName: result.data.fullName || '',
        email: result.data.email || '',
        mobile: result.data.mobile || ''
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const result = await adminAPI.updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully!');
      updateUser({ ...user, ...formData });
      setEditing(false);
    } else {
      setMessage('Failed to update profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile();
  };

  if (loading && !editing) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Admin Profile</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="profile-container">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-between align-items-center">
              <h3><i className="fa fa-user"></i> Profile Information</h3>
              {!editing && (
                <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
                  <i className="fa fa-edit"></i> Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  className="form-control"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <label><i className="fa fa-user"></i> Username</label>
                <span>{user?.username || 'admin'}</span>
              </div>
              <div className="detail-row">
                <label><i className="fa fa-id-card"></i> Full Name</label>
                <span>{formData.fullName}</span>
              </div>
              <div className="detail-row">
                <label><i className="fa fa-envelope"></i> Email</label>
                <span>{formData.email}</span>
              </div>
              <div className="detail-row">
                <label><i className="fa fa-phone"></i> Mobile</label>
                <span>{formData.mobile || 'Not set'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card mt-3">
          <div className="card-header">
            <h3><i className="fa fa-link"></i> Quick Links</h3>
          </div>
          <div className="card-body">
            <div className="quick-links">
              <a href="/admin/change-password" className="quick-link">
                <i className="fa fa-key"></i>
                <span>Change Password</span>
              </a>
              <a href="/admin/dashboard" className="quick-link">
                <i className="fa fa-tachometer"></i>
                <span>Dashboard</span>
              </a>
              <a href="/admin/manage-books" className="quick-link">
                <i className="fa fa-book"></i>
                <span>Manage Books</span>
              </a>
              <a href="/admin/reg-students" className="quick-link">
                <i className="fa fa-users"></i>
                <span>Manage Students</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-details {
          padding: 10px 0;
        }
        
        .detail-row {
          display: flex;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row label {
          width: 150px;
          font-weight: 600;
          color: #666;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .detail-row span {
          flex: 1;
          color: #333;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .quick-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          transition: all 0.2s;
        }
        
        .quick-link:hover {
          background: #007bff;
          color: white;
        }
        
        .quick-link i {
          font-size: 20px;
        }
        
        .mt-3 {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
