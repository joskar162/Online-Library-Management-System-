import { useState, useEffect } from 'react';
import { issuedBooksAPI, PASSWORD_REQUIREMENTS } from '../../services/api';

const ManageIssuedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  
  // Search and filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchBooks();
  }, [pagination.page, search, statusFilter]);

  const fetchBooks = async () => {
    setLoading(true);
    const result = await issuedBooksAPI.getAll(search, statusFilter, pagination.page, pagination.limit);
    
    if (result.success) {
      setBooks(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages
      }));
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReturn = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    
    const result = await issuedBooksAPI.return(selectedBook.id);
    
    if (result.success) {
      const fineAmount = result.fineCalculated || 0;
      if (fineAmount > 0) {
        setMessage(`Book returned successfully! Fine calculated: $${fineAmount}`);
      } else {
        setMessage('Book returned successfully! No fine charged.');
      }
      fetchBooks();
      closeModal();
    } else {
      setMessage('Failed to return book');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setMessage('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBooks();
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Manage Issued Books</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="card mb-3">
        <div className="card-header">
          <h3><i className="fa fa-search"></i> Search & Filter</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-row">
              <div className="filter-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book name, student name, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="0">Issued</option>
                  <option value="1">Returned</option>
                </select>
              </div>
              <div className="filter-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-search"></i> Search
                </button>
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  <i className="fa fa-times"></i> Clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Issued Books Listing ({pagination.total} total)</h3>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : books.length === 0 ? (
          <p className="text-center">No issued books found.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Book</th>
                    <th>ISBN</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Fine</th>
                    <th>Status</th>
                    <th>Days Left</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.id} className={book.isOverdue ? 'overdue-row' : ''}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>
                        <div>
                          <strong>{book.studentName}</strong>
                          <br />
                          <small className="text-muted">{book.studentId}</small>
                        </div>
                      </td>
                      <td>{book.bookName}</td>
                      <td>{book.isbnNumber}</td>
                      <td>{formatDate(book.issuesDate)}</td>
                      <td>
                        <span className={book.isOverdue ? 'text-danger' : ''}>
                          {formatDate(book.dueDate)}
                        </span>
                      </td>
                      <td>
                        {book.returnDate ? (
                          formatDate(book.returnDate)
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {book.fine !== null ? (
                          <span className={`fine-amount ${book.fine > 0 ? 'text-danger' : 'text-success'}`}>
                            ${book.fine}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
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
                          <span className={book.daysUntilDue <= 3 ? 'text-danger' : book.daysUntilDue <= 7 ? 'text-warning' : ''}>
                            {book.daysUntilDue > 0 ? `${book.daysUntilDue} days` : 'Overdue!'}
                          </span>
                        )}
                      </td>
                      <td>
                        {book.returnStatus === 0 && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReturn(book)}
                          >
                            <i className="fa fa-check"></i> Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </div>
                <div className="pagination">
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                  >
                    <i className="fa fa-angle-double-left"></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <i className="fa fa-angle-left"></i>
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-sm ${pagination.page === pageNum ? 'btn-primary' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <i className="fa fa-angle-right"></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <i className="fa fa-angle-double-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Return Modal */}
      {showModal && selectedBook && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Return Details</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmitReturn}>
              <div className="modal-body">
                <div className="return-details">
                  <div className="detail-row">
                    <label>Book:</label>
                    <span>{selectedBook.bookName}</span>
                  </div>
                  <div className="detail-row">
                    <label>ISBN:</label>
                    <span>{selectedBook.isbnNumber}</span>
                  </div>
                  <div className="detail-row">
                    <label>Student:</label>
                    <span>{selectedBook.studentName} ({selectedBook.studentId})</span>
                  </div>
                  <div className="detail-row">
                    <label>Issue Date:</label>
                    <span>{formatDateTime(selectedBook.issuesDate)}</span>
                  </div>
                  <div className="detail-row">
                    <label>Due Date:</label>
                    <span className={selectedBook.isOverdue ? 'text-danger' : ''}>
                      {formatDateTime(selectedBook.dueDate)}
                      {selectedBook.isOverdue && ' (OVERDUE)'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Return Date:</label>
                    <span>{formatDateTime(new Date().toISOString())}</span>
                  </div>
                </div>

                <div className="fine-calculation">
                  <h4><i className="fa fa-calculator"></i> Fine Calculation</h4>
                  {(() => {
                    const due = new Date(selectedBook.dueDate);
                    const returned = new Date();
                    const diffTime = returned - due;
                    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                    const fine = diffDays * PASSWORD_REQUIREMENTS.finePerDay;
                    
                    return (
                      <div className="calculation-details">
                        <p>Days overdue: <strong>{diffDays} days</strong></p>
                        <p>Fine rate: <strong>${PASSWORD_REQUIREMENTS.finePerDay}/day</strong></p>
                        <p className="total-fine">Total Fine: <strong>${fine}</strong></p>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-check"></i> Mark as Returned
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .overdue-row {
          background-color: #fff5f5;
        }
        
        .fine-amount {
          font-weight: bold;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }
        
        .text-success {
          color: #28a745 !important;
        }
        
        .text-warning {
          color: #ffc107 !important;
        }
        
        .text-muted {
          color: #6c757d;
        }
        
        .filter-form {
          margin: 0;
        }
        
        .filter-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .filter-group {
          flex: 1;
          min-width: 150px;
        }
        
        .filter-actions {
          display: flex;
          gap: 10px;
        }
        
        .mb-3 {
          margin-bottom: 20px;
        }
        
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-top: 1px solid #eee;
        }
        
        .pagination-info {
          color: #666;
          font-size: 14px;
        }
        
        .pagination {
          display: flex;
          gap: 5px;
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
        
        .return-details {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row label {
          font-weight: 600;
          color: #666;
        }
        
        .fine-calculation {
          background: #e7f3ff;
          border: 1px solid #b6d4fe;
          border-radius: 8px;
          padding: 15px;
        }
        
        .fine-calculation h4 {
          margin: 0 0 15px;
          color: #0c5460;
        }
        
        .calculation-details p {
          margin: 5px 0;
          color: #333;
        }
        
        .total-fine {
          font-size: 18px;
          color: #dc3545;
          padding-top: 10px;
          border-top: 1px solid #b6d4fe;
          margin-top: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default ManageIssuedBooks;
