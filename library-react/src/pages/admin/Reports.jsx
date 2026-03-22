import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    const result = await adminAPI.getReports(
      activeTab,
      dateRange.startDate || null,
      dateRange.endDate || null
    );
    if (result.success) {
      setReports(result.data);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'issued', label: 'Issued Books', icon: 'fa-book' },
    { id: 'most-borrowed', label: 'Most Borrowed', icon: 'fa-star' },
    { id: 'most-active', label: 'Most Active Students', icon: 'fa-users' },
    { id: 'fines', label: 'Fine Revenue', icon: 'fa-dollar' },
    { id: 'late-returns', label: 'Late Returns', icon: 'fa-exclamation-triangle' }
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p>Library statistics and insights</p>
      </div>

      {/* Date Range Filter */}
      <div className="card mb-3">
        <div className="card-header">
          <h3><i className="fa fa-calendar"></i> Filter by Date</h3>
        </div>
        <div className="card-body">
          <div className="date-filters">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button 
                className="btn btn-secondary"
                onClick={() => setDateRange({ startDate: '', endDate: '' })}
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fa ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="card">
          {/* Overview Tab */}
          {activeTab === 'overview' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-chart-pie"></i> Overview</h3>
              </div>
              <div className="card-body">
                <div className="overview-grid">
                  <div className="overview-card">
                    <div className="overview-icon blue">
                      <i className="fa fa-book"></i>
                    </div>
                    <div className="overview-content">
                      <h4>{reports.issuedBooks.length}</h4>
                      <p>Total Transactions</p>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon green">
                      <i className="fa fa-star"></i>
                    </div>
                    <div className="overview-content">
                      <h4>{reports.mostBorrowedBooks.length > 0 ? reports.mostBorrowedBooks[0].bookName : 'N/A'}</h4>
                      <p>Most Popular Book</p>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon orange">
                      <i className="fa fa-users"></i>
                    </div>
                    <div className="overview-content">
                      <h4>{reports.mostActiveStudents.length > 0 ? reports.mostActiveStudents[0].studentName : 'N/A'}</h4>
                      <p>Most Active Student</p>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon red">
                      <i className="fa fa-dollar"></i>
                    </div>
                    <div className="overview-content">
                      <h4>${reports.totalFineRevenue}</h4>
                      <p>Total Fine Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Issued Books Tab */}
          {activeTab === 'issued' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-book"></i> Issued Books Report</h3>
              </div>
              <div className="card-body">
                {reports.issuedBooks.length === 0 ? (
                  <p className="text-center">No issued books found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student</th>
                          <th>Book</th>
                          <th>Issue Date</th>
                          <th>Due Date</th>
                          <th>Return Date</th>
                          <th>Status</th>
                          <th>Fine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.issuedBooks.slice(0, 50).map((book, index) => (
                          <tr key={book.id}>
                            <td>{index + 1}</td>
                            <td>{book.studentName}</td>
                            <td>{book.bookName}</td>
                            <td>{formatDate(book.issuesDate)}</td>
                            <td>{formatDate(book.dueDate)}</td>
                            <td>{formatDate(book.returnDate)}</td>
                            <td>
                              <span className={`badge ${book.returnStatus === 1 ? 'badge-success' : 'badge-warning'}`}>
                                {book.returnStatus === 1 ? 'Returned' : 'Issued'}
                              </span>
                            </td>
                            <td>${book.fine || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Most Borrowed Tab */}
          {activeTab === 'most-borrowed' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-star"></i> Most Borrowed Books</h3>
              </div>
              <div className="card-body">
                {reports.mostBorrowedBooks.length === 0 ? (
                  <p className="text-center">No data available.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Book Name</th>
                          <th>Times Borrowed</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.mostBorrowedBooks.map((book, index) => (
                          <tr key={book.bookId}>
                            <td>{index + 1}</td>
                            <td>{book.bookName}</td>
                            <td><strong>{book.count}</strong></td>
                            <td>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${(book.count / Math.max(...reports.mostBorrowedBooks.map(b => b.count))) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Most Active Students Tab */}
          {activeTab === 'most-active' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-users"></i> Most Active Students</h3>
              </div>
              <div className="card-body">
                {reports.mostActiveStudents.length === 0 ? (
                  <p className="text-center">No data available.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Student ID</th>
                          <th>Books Borrowed</th>
                          <th>Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.mostActiveStudents.map((student, index) => (
                          <tr key={student.studentId}>
                            <td>{index + 1}</td>
                            <td>{student.studentName}</td>
                            <td>{student.studentId}</td>
                            <td><strong>{student.count}</strong></td>
                            <td>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill green" 
                                  style={{ width: `${(student.count / Math.max(...reports.mostActiveStudents.map(s => s.count))) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Fine Revenue Tab */}
          {activeTab === 'fines' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-dollar"></i> Fine Revenue Report</h3>
              </div>
              <div className="card-body">
                <div className="summary-cards">
                  <div className="summary-card">
                    <h4>${reports.totalFineRevenue}</h4>
                    <p>Total Revenue</p>
                  </div>
                </div>
                
                {reports.fines.length === 0 ? (
                  <p className="text-center">No fines recorded.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Payment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.fines.map((fine, index) => (
                          <tr key={fine.id}>
                            <td>{index + 1}</td>
                            <td>{fine.studentName}</td>
                            <td className="fine-amount">${fine.amount}</td>
                            <td>
                              <span className={`badge ${fine.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                {fine.status}
                              </span>
                            </td>
                            <td>{formatDate(fine.paymentDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Late Returns Tab */}
          {activeTab === 'late-returns' && reports && (
            <>
              <div className="card-header">
                <h3><i className="fa fa-exclamation-triangle"></i> Late Returns Report</h3>
              </div>
              <div className="card-body">
                {reports.lateReturns.length === 0 ? (
                  <p className="text-center">No late returns found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student</th>
                          <th>Book</th>
                          <th>Issue Date</th>
                          <th>Return Date</th>
                          <th>Days Late</th>
                          <th>Fine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.lateReturns.map((record, index) => (
                          <tr key={record.id}>
                            <td>{index + 1}</td>
                            <td>{record.studentName}</td>
                            <td>{record.bookName}</td>
                            <td>{formatDate(record.issuesDate)}</td>
                            <td>{formatDate(record.returnDate)}</td>
                            <td className="text-danger">{record.fine}</td>
                            <td className="fine-amount">${record.fine * 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .tab-btn {
          padding: 12px 20px;
          border: none;
          background: #f0f0f0;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tab-btn:hover {
          background: #e0e0e0;
        }
        
        .tab-btn.active {
          background: #007bff;
          color: white;
        }
        
        .date-filters {
          display: flex;
          gap: 15px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        
        .date-filters .form-group {
          min-width: 150px;
        }
        
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .overview-card {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .overview-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 15px;
        }
        
        .overview-icon.blue { background: #cce5ff; color: #007bff; }
        .overview-icon.green { background: #d4edda; color: #28a745; }
        .overview-icon.orange { background: #fff3cd; color: #ffc107; }
        .overview-icon.red { background: #f8d7da; color: #dc3545; }
        
        .overview-content h4 {
          margin: 0;
          font-size: 24px;
        }
        
        .overview-content p {
          margin: 5px 0 0;
          color: #666;
        }
        
        .summary-cards {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .summary-card {
          flex: 1;
          padding: 20px;
          background: #d4edda;
          border-radius: 8px;
          text-align: center;
        }
        
        .summary-card h4 {
          font-size: 32px;
          margin: 0;
          color: #28a745;
        }
        
        .summary-card p {
          margin: 5px 0 0;
          color: #666;
        }
        
        .progress-bar-container {
          width: 100%;
          height: 20px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: #007bff;
          border-radius: 10px;
          transition: width 0.3s;
        }
        
        .progress-bar-fill.green {
          background: #28a745;
        }
        
        .fine-amount {
          font-weight: bold;
          color: #dc3545;
        }
        
        .badge {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .badge-success {
          background-color: #28a745;
          color: white;
        }
        
        .badge-warning {
          background-color: #ffc107;
          color: #333;
        }
        
        .mb-3 {
          margin-bottom: 20px;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
};

export default Reports;
