import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI, studentsAPI, issuedBooksAPI } from '../../services/api';

const IssueBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    bookId: ''
  });
  const [studentName, setStudentName] = useState('');
  const [bookDetails, setBookDetails] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [booksResult, studentsResult] = await Promise.all([
      booksAPI.getAll(),
      studentsAPI.getAll()
    ]);

    if (booksResult.success) setBooks(booksResult.data);
    if (studentsResult.success) setStudents(studentsResult.data.filter(s => s.status === 1));
    
    setLoading(false);
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, studentId });
    setStudentName('');

    if (studentId) {
      const student = students.find(s => s.studentId === studentId);
      if (student) {
        setStudentName(student.fullName);
      }
    }
  };

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    setFormData({ ...formData, bookId });
    setBookDetails('');

    if (bookId) {
      const book = books.find(b => b.id === parseInt(bookId));
      if (book) {
        setBookDetails(`${book.bookName} - ISBN: ${book.isbnNumber}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.studentId || !formData.bookId) {
      setMessage('Please select both student and book');
      return;
    }

    const result = await issuedBooksAPI.issue(formData.studentId, formData.bookId);

    if (result.success) {
      setMessage('Book issued successfully!');
      setTimeout(() => {
        navigate('/admin/manage-issued-books');
      }, 1500);
    } else {
      setMessage(result.message || 'Failed to issue book');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Issue a New Book</h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Issue a New Book</h3>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              value={formData.studentId}
              onChange={handleStudentChange}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.studentId}>
                  {student.studentId} - {student.fullName}
                </option>
              ))}
            </select>
            {studentName && (
              <p style={{ marginTop: '10px', color: '#28a745', fontWeight: 'bold' }}>
                Student Name: {studentName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Book <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              value={formData.bookId}
              onChange={handleBookChange}
              required
            >
              <option value="">Select Book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.bookName} - ISBN: {book.isbnNumber}
                </option>
              ))}
            </select>
            {bookDetails && (
              <p style={{ marginTop: '10px', color: '#28a745', fontWeight: 'bold' }}>
                {bookDetails}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-info">
            Issue Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;
