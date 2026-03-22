import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { issuedBooksAPI } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalIssued: 0, notReturned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.studentId) {
        const result = await issuedBooksAPI.getByStudent(user.studentId);
        if (result.success) {
          const issued = result.data;
          const notReturned = issued.filter(b => b.returnStatus === 0).length;
          setStats({
            totalIssued: issued.length,
            notReturned
          });
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Student Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card info">
          <i className="fa fa-book"></i>
          <h3>{stats.totalIssued}</h3>
          <p>Books Issued</p>
        </div>

        <div className="stat-card warning">
          <i className="fa fa-recycle"></i>
          <h3>{stats.notReturned}</h3>
          <p>Books Not Returned Yet</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Welcome, {user?.fullName}!</h3>
        </div>
        <div>
          <p><strong>Student ID:</strong> {user?.studentId}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Mobile:</strong> {user?.mobile}</p>
          <p><strong>Status:</strong> {user?.status === 1 ? 'Active' : 'Blocked'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
