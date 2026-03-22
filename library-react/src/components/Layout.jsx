import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">Online Library Management System</Link>
            </div>
            <nav className="nav-menu">
              {user ? (
                <>
                  <span className="welcome-text">
                    Welcome, {user.fullName || user.username || user.UserName}
                  </span>
                  {userType === 'admin' ? (
                    <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                  ) : (
                    <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/" className="nav-link">Student Login</Link>
                  <Link to="/admin" className="nav-link">Admin Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {user && (
        <div className="sub-header">
          <div className="container">
            <nav className="sub-nav">
              {userType === 'admin' ? (
                <>
                  <Link to="/admin/dashboard">Dashboard</Link>
                  <Link to="/admin/profile">My Profile</Link>
                  <Link to="/admin/manage-books">Manage Books</Link>
                  <Link to="/admin/manage-authors">Manage Authors</Link>
                  <Link to="/admin/manage-categories">Manage Categories</Link>
                  <Link to="/admin/issue-book">Issue Book</Link>
                  <Link to="/admin/manage-issued-books">Manage Issued Books</Link>
                  <Link to="/admin/reg-students">Registered Students</Link>
                  <Link to="/admin/reports">Reports</Link>
                  <Link to="/admin/change-password">Change Password</Link>
                </>
              ) : (
                <>
                  <Link to="/student/dashboard">Dashboard</Link>
                  <Link to="/student/my-profile">My Profile</Link>
                  <Link to="/student/issued-books">My Books</Link>
                  <Link to="/student/book-requests">Book Requests</Link>
                  <Link to="/student/change-password">Change Password</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Online Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
