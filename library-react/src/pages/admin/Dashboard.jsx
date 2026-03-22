import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalIssued: 0,
    totalReturned: 0,
    totalStudents: 0,
    totalAuthors: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await adminAPI.getStats();
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card success">
          <i className="fa fa-book"></i>
          <h3>{stats.totalBooks}</h3>
          <p>Books Listed</p>
        </div>

        <div className="stat-card info">
          <i className="fa fa-bars"></i>
          <h3>{stats.totalIssued}</h3>
          <p>Times Book Issued</p>
        </div>

        <div className="stat-card warning">
          <i className="fa fa-recycle"></i>
          <h3>{stats.totalReturned}</h3>
          <p>Times Books Returned</p>
        </div>

        <div className="stat-card danger">
          <i className="fa fa-users"></i>
          <h3>{stats.totalStudents}</h3>
          <p>Registered Users</p>
        </div>

        <div className="stat-card success">
          <i className="fa fa-user"></i>
          <h3>{stats.totalAuthors}</h3>
          <p>Authors Listed</p>
        </div>

        <div className="stat-card info">
          <i className="fa fa-file-archive-o"></i>
          <h3>{stats.totalCategories}</h3>
          <p>Listed Categories</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
