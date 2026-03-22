import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalQuantity: 0,
    availableBooks: 0,
    totalIssued: 0,
    totalReturned: 0,
    totalStudents: 0,
    totalAuthors: 0,
    totalCategories: 0,
    pendingRequests: 0,
    totalFines: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await adminAPI.getStats();
      if (result.success) {
        setStats(result.data);
        
        // Get recent issued books for activity
        const reportsResult = await adminAPI.getReports();
        if (reportsResult.success) {
          setRecentActivity(reportsResult.data.issuedBooks.slice(0, 5));
        }
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
        <p>Welcome to the Library Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fa fa-book"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
            <span className="stat-sub">{stats.totalQuantity} total copies</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fa fa-bookmark"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.availableBooks}</h3>
            <p>Available Books</p>
            <span className="stat-sub">Ready to issue</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fa fa-bars"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalIssued}</h3>
            <p>Currently Issued</p>
            <span className="stat-sub">Books out</span>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <i className="fa fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.overdueBooks}</h3>
            <p>Overdue Books</p>
            <span className="stat-sub">Need attention</span>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fa fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Active Students</p>
            <span className="stat-sub">Registered users</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fa fa-user"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalAuthors}</h3>
            <p>Authors</p>
            <span className="stat-sub">In database</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fa fa-folder"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
            <span className="stat-sub">Book types</span>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">
            <i className="fa fa-envelope"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
            <span className="stat-sub">Book requests</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fa fa-dollar"></i>
          </div>
          <div className="stat-content">
            <h3>${stats.totalFines}</h3>
            <p>Fine Revenue</p>
            <span className="stat-sub">Collected</span>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fa fa-recycle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalReturned}</h3>
            <p>Returned Books</p>
            <span className="stat-sub">All time</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3><i className="fa fa-bolt"></i> Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <Link to="/admin/issue-book" className="quick-action-btn">
                <i className="fa fa-book"></i>
                <span>Issue Book</span>
              </Link>
              <Link to="/admin/manage-books" className="quick-action-btn">
                <i className="fa fa-plus"></i>
                <span>Add Book</span>
              </Link>
              <Link to="/admin/reg-students" className="quick-action-btn">
                <i className="fa fa-user-plus"></i>
                <span>View Students</span>
              </Link>
              <Link to="/admin/manage-issued-books" className="quick-action-btn">
                <i className="fa fa-list"></i>
                <span>Issued Books</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><i className="fa fa-clock-o"></i> Recent Activity</h3>
          </div>
          <div className="card-body">
            {recentActivity.length === 0 ? (
              <p className="text-center text-muted">No recent activity</p>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fa ${activity.returnStatus === 1 ? 'fa-check-circle' : 'fa-book'}`}></i>
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.studentName}</strong> 
                        {activity.returnStatus === 1 ? ' returned ' : ' issued '}
                        <strong>{activity.bookName}</strong>
                      </p>
                      <span className="activity-date">
                        {new Date(activity.issuesDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`activity-status ${activity.returnStatus === 1 ? 'returned' : 'issued'}`}>
                      {activity.returnStatus === 1 ? 'Returned' : 'Active'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Distribution Chart (Simple CSS-based) */}
      <div className="card">
        <div className="card-header">
          <h3><i className="fa fa-pie-chart"></i> Book Distribution</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <div className="simple-chart">
              <div className="chart-bar" style={{ width: `${(stats.availableBooks / Math.max(stats.totalQuantity, 1)) * 100}%` }}>
                <span className="chart-label">Available ({stats.availableBooks})</span>
              </div>
              <div className="chart-bar issued" style={{ width: `${(stats.totalIssued / Math.max(stats.totalQuantity, 1)) * 100}%` }}>
                <span className="chart-label">Issued ({stats.totalIssued})</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
                <span>Available: {stats.availableBooks}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
                <span>Issued: {stats.totalIssued}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#dc3545' }}></span>
                <span>Overdue: {stats.overdueBooks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        }
        
        .stat-card.success .stat-icon { background: #d4edda; color: #28a745; }
        .stat-card.info .stat-icon { background: #d1ecf1; color: #17a2b8; }
        .stat-card.warning .stat-icon { background: #fff3cd; color: #ffc107; }
        .stat-card.danger .stat-icon { background: #f8d7da; color: #dc3545; }
        .stat-card.primary .stat-icon { background: #cce5ff; color: #007bff; }
        .stat-card.secondary .stat-icon { background: #e2e3e5; color: #6c757d; }
        
        .stat-content h3 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        
        .stat-content p {
          margin: 5px 0 0;
          font-size: 14px;
          color: #666;
        }
        
        .stat-sub {
          font-size: 12px;
          color: #999;
        }
        
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          transition: all 0.2s;
        }
        
        .quick-action-btn:hover {
          background: #007bff;
          color: white;
          transform: translateY(-2px);
        }
        
        .quick-action-btn i {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .activity-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: #666;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-content p {
          margin: 0;
          font-size: 14px;
        }
        
        .activity-date {
          font-size: 12px;
          color: #999;
        }
        
        .activity-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .activity-status.returned {
          background: #d4edda;
          color: #28a745;
        }
        
        .activity-status.issued {
          background: #fff3cd;
          color: #856404;
        }
        
        .chart-container {
          padding: 20px 0;
        }
        
        .simple-chart {
          margin-bottom: 20px;
        }
        
        .chart-bar {
          height: 30px;
          background: #28a745;
          border-radius: 4px;
          margin-bottom: 10px;
          min-width: 50px;
          transition: width 0.5s ease;
        }
        
        .chart-bar.issued {
          background: #ffc107;
        }
        
        .chart-label {
          padding: 5px 10px;
          color: #333;
          font-size: 12px;
          font-weight: 600;
        }
        
        .chart-legend {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
