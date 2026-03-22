import { useState, useEffect } from 'react';
import { issuedBooksAPI } from '../../services/api';

const ManageIssuedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fine, setFine] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const result = await issuedBooksAPI.getAll();
    if (result.success) {
      setBooks(result.data);
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

  const handleReturn = (book) => {
    setSelectedBook(book);
    setFine(book.fine || 0);
    setShowModal(true);
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    
    const result = await issuedBooksAPI.return(selectedBook.id, parseInt(fine));
    
    if (result.success) {
      setMessage('Book returned successfully!');
      fetchBooks();
      closeModal();
    } else {
      setMessage('Failed to return book');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFine(0);
    setMessage('');
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

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

      <div className="card">
        <div className="card-header">
          <h3>Issued Books Listing</h3>
        </div>

        {books.length === 0 ? (
          <p className="text-center">No issued books found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Book Name</th>
                  <th>ISBN</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td>{book.studentName} ({book.studentId})</td>
                    <td>{book.bookName}</td>
                    <td>{book.isbnNumber}</td>
                    <td>{formatDate(book.issuesDate)}</td>
                    <td>
                      {book.returnDate ? (
                        formatDate(book.returnDate)
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                          Not Returned
                        </span>
                      )}
                    </td>
                    <td>{book.fine !== null ? `$${book.fine}` : '-'}</td>
                    <td>
                      <span className={`badge ${book.returnStatus === 1 ? 'badge-success' : 'badge-warning'}`}>
                        {book.returnStatus === 1 ? 'Returned' : 'Issued'}
                      </span>
                    </td>
                    <td>
                      {book.returnStatus === 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleReturn(book)}
                        >
                          Update Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Return Details</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmitReturn}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Book</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBook?.bookName}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Student</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${selectedBook?.studentName} (${selectedBook?.studentId})`}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Fine (USD)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fine}
                    onChange={(e) => setFine(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Mark as Returned
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
};

export default ManageIssuedBooks;
