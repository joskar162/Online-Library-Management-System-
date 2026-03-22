import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { issuedBooksAPI, studentAPI, PASSWORD_REQUIREMENTS } from '../../services/api';

const IssuedBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('issued'); // issued, history, fines

  useEffect(() => {
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!user?.studentId) return;
    
    setLoading(true);
    
    if (activeTab === 'issued') {
      const result = await issuedBooksAPI.getByStudent(user.studentId);
      if (result.success) {
        setBooks(result.data);
      }
    } else if (activeTab === 'history') {
      const result = await studentAPI.getBorrowingHistory(user.studentId);
      if (result.success) {
        setBooks(result.data);
      }
    } else if (activeTab === 'fines') {
      const result = await studentAPI.getFines(user.studentId);
      if (result.success) {
        setFines(result.data);
      }
    }
    
    setLoading(false);
  };

  const handleRenew = async (bookId) => {
    const result = await issuedBooksAPI.renew(bookId);
    if (result.success) {
      setMessage('Book renewed successfully! Due date extended by ' + PASSWORD_REQUIREMENTS.loanDays + ' days.');
      fetchData();
    } else {
      setMessage(result.message || 'Failed to renew book');
    }
  };

  const handlePayFine = async (fineId) => {
    if (window.confirm('Confirm payment of this fine?')) {
      const result = await studentAPI.payFine(user.studentId, fineId);
      if (result.success) {
        setMessage('Fine paid successfully!');
        fetchData();
      } else {
        setMessage('Failed to process payment');
      }
    }
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

  return (
    <div>
      <div className="page-header">
        <h2>My Books</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="close-alert">&times;</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'issued' ? 'active' : ''}`}
          onClick={() => setActiveTab('issued')}
        >
          <i className="fa fa-book"></i> Currently Issued
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fa fa-history"></i> Borrowing History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fines' ? 'active' : ''}`}
          onClick={() => setActiveTab('fines')}
        >
          <i className="fa fa-dollar"></i> My Fines
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner"></div>
        ) : activeTab === 'fines' ? (
          // Fines Tab
          fines.length === 0 ? (
            <p className="text-center">No fines found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine, index) => (
                    <tr key={fine.id}>
                      <td>{index + 1}</td>
                      <td className="fine-amount">${fine.amount}</td>
                      <td>
                        <span className={`badge ${fine.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {fine.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td>{fine.paymentDate ? formatDate(fine.paymentDate) : '-'}</td>
                      <td>
                        {fine.status === 'unpaid' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handlePayFine(fine.id)}
                          >
                            <i className="fa fa-credit-card"></i> Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // Issued/History Tab
          <>
            <div className="card-header">
              <h3>{activeTab === 'issued' ? 'Currently Issued Books' : 'Borrowing History'}</h3>
            </div>

            {books.length === 0 ? (
              <p className="text-center">No books found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Book Name</th>
                      <th>ISBN</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Fine</th>
                      <th>Status</th>
                      <th>Days Left</th>
                      {activeTab === 'issued' && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={book.id} className={book.isOverdue ? 'overdue-row' : ''}>
                        <td>{index + 1}</td>
                        <td>{book.bookName}</td>
                        <td>{book.isbnNumber}</td>
                        <td>{formatDate(book.issuesDate)}</td>
                        <td className={book.isOverdue ? 'text-danger' : ''}>
                          {formatDate(book.dueDate)}
                        </td>
                        <td>
                          {book.returnDate ? (
                            formatDate(book.returnDate)
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className={book.fine > 0 ? 'text-danger' : ''}>
                          {book.fine !== null ? `$${book.fine}` : '-'}
                        </td>
                        <td>
                          {book.returnStatus === 1 ? (
                            <span className="badge badge-success">Returned</span>
                          ) : book.isOverdue ? (
                            <span className="badge badge-danger">Overdue</span>
                          ) : (
                            <span className="badge badge-warning">Issued</span>
                          )}
                        </td>
                        <td>
                          {book.returnStatus === 0 && (
                            <span className={book.daysUntilDue <= 3 ? 'text-danger font-bold' : ''}>
                              {book.daysUntilDue > 0 ? `${book.daysUntilDue} days` : 'Overdue!'}
                            </span>
                          )}
                        </td>
                        {activeTab === 'issued' && (
                          <td>
                            {book.returnStatus === 0 && !book.isRenewed && (
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleRenew(book.id)}
                                title={`Renew for ${PASSWORD_REQUIREMENTS.loanDays} more days`}
                              >
                                <i className="fa fa-refresh"></i> Renew
                              </button>
                            )}
                            {book.isRenewed && (
                              <span className="text-muted">Renewed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Guidelines */}
      {activeTab === 'issued' && books.some(b => b.returnStatus === 0) && (
        <div className="card mt-3">
          <div className="card-header">
            <h3><i className="fa fa-info-circle"></i> Book Renewal Guidelines</h3>
          </div>
          <div className="card-body">
            <ul className="guidelines-list">
              <li>You can renew a book <strong>once</strong> for an additional {PASSWORD_REQUIREMENTS.loanDays} days</li>
              <li>Overdue books cannot be renewed until fines are paid</li>
              <li>Fine of <strong>${PASSWORD_REQUIREMENTS.finePerDay}</strong> per day will be charged for overdue returns</li>
              <li>Maximum books allowed: <strong>{PASSWORD_REQUIREMENTS.maxBooksPerStudent}</strong></li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: #f0f0f0;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .tab-btn:hover {
          background: #e0e0e0;
        }
        
        .tab-btn.active {
          background: #007bff;
          color: white;
        }
        
        .tab-btn i {
          margin-right: 8px;
        }
        
        .overdue-row {
          background-color: #fff5f5;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }
        
        .text-muted {
          color: #6c757d;
        }
        
        .font-bold {
          font-weight: bold;
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
        
        .badge-danger {
          background-color: #dc3545;
          color: white;
        }
        
        .close-alert {
          float: right;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        
        .guidelines-list {
          margin: 0;
          padding-left: 20px;
        }
        
        .guidelines-list li {
          margin-bottom: 8px;
          color: #555;
        }
        
        .mt-3 {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default IssuedBooks;
