import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { issuedBooksAPI } from '../../services/api';

const IssuedBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (user?.studentId) {
        const result = await issuedBooksAPI.getByStudent(user.studentId);
        if (result.success) {
          setBooks(result.data);
        }
      }
      setLoading(false);
    };

    fetchBooks();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>My Issued Books</h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Issued Books List</h3>
        </div>

        {books.length === 0 ? (
          <p className="text-center">No books issued yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book Name</th>
                  <th>ISBN</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Fine (USD)</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td>{book.bookName}</td>
                    <td>{book.isbnNumber}</td>
                    <td>{formatDate(book.issuesDate)}</td>
                    <td>
                      {book.returnDate ? (
                        formatDate(book.returnDate)
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                          Not Returned Yet
                        </span>
                      )}
                    </td>
                    <td>{book.fine !== null ? book.fine : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuedBooks;
