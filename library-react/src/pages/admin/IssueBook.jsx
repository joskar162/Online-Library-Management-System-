import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI, studentsAPI, issuedBooksAPI, PASSWORD_REQUIREMENTS } from '../../services/api';

const IssueBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    bookId: '',
    loanDays: PASSWORD_REQUIREMENTS.loanDays
  });
  const [studentName, setStudentName] = useState('');
  const [bookDetails, setBookDetails] = useState('');
  const [studentIssuedCount, setStudentIssuedCount] = useState(0);
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [booksResult, studentsResult] = await Promise.all([
      booksAPI.getAvailable(),
      studentsAPI.getAll('', '1')
    ]);

    if (booksResult.success) setBooks(booksResult.data);
    if (studentsResult.success) setStudents(studentsResult.data);
    
    setLoading(false);
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, studentId });
    setStudentName('');
    setStudentIssuedCount(0);

    if (studentId) {
      const student = students.find(s => s.studentId === studentId);
      if (student) {
        setStudentName(student.fullName);
        
        // Get current issued books count
        const issuedResult = await issuedBooksAPI.getByStudent(studentId);
        if (issuedResult.success) {
          const currentIssued = issuedResult.data.filter(b => b.returnStatus === 0);
          setStudentIssuedCount(currentIssued.length);
        }
      }
    }
  };

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    setFormData({ ...formData, bookId });
    setBookDetails('');
    setDueDate(null);

    if (bookId) {
      const book = books.find(b => b.id === parseInt(bookId));
      if (book) {
        setBookDetails(`${book.bookName} - ISBN: ${book.isbnNumber} (Available: ${book.available})`);
        
        // Calculate due date
        const due = new Date();
        due.setDate(due.getDate() + parseInt(formData.loanDays));
        setDueDate(due);
      }
    }
  };

  const handleLoanDaysChange = (e) => {
    const days = e.target.value;
    setFormData({ ...formData, loanDays: days });
    
    if (formData.bookId) {
      const due = new Date();
      due.setDate(due.getDate() + parseInt(days));
      setDueDate(due);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.studentId || !formData.bookId) {
      setMessage('Please select both student and book');
      return;
    }

    if (studentIssuedCount >= PASSWORD_REQUIREMENTS.maxBooksPerStudent) {
      setMessage(`Student has already issued ${PASSWORD_REQUIREMENTS.maxBooksPerStudent} books. Cannot issue more.`);
      return;
    }

    const result = await issuedBooksAPI.issue(formData.studentId, formData.bookId, parseInt(formData.loanDays));

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
            <label>Student <span style={{ color: 'red' }}>*</span></label>
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
              <div className="student-info">
                <p><strong>Student Name:</strong> {studentName}</p>
                <p>
                  <strong>Currently Issued:</strong> {studentIssuedCount} / {PASSWORD_REQUIREMENTS.maxBooksPerStudent}
                  {studentIssuedCount >= PASSWORD_REQUIREMENTS.maxBooksPerStudent && 
                    <span className="text-danger"> (Maximum limit reached)</span>
                  }
                </p>
              </div>
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
                  {book.bookName} - ISBN: {book.isbnNumber} (Available: {book.available})
                </option>
              ))}
            </select>
            {bookDetails && (
              <p className="book-info">{bookDetails}</p>
            )}
          </div>

          <div className="form-group">
            <label>Loan Period (Days)</label>
            <select
              className="form-control"
              value={formData.loanDays}
              onChange={handleLoanDaysChange}
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="21">21 Days</option>
              <option value="30">30 Days</option>
            </select>
            <small className="text-muted">Select the loan period for this book</small>
          </div>

          {dueDate && (
            <div className="due-date-preview">
              <h4><i className="fa fa-calendar"></i> Due Date Preview</h4>
              <p className="due-date">{dueDate.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p className="days-info">{formData.loanDays} days from today</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-info"
            disabled={studentIssuedCount >= PASSWORD_REQUIREMENTS.maxBooksPerStudent}
          >
            <i className="fa fa-book"></i> Issue Book
          </button>
        </form>
      </div>

      {/* Guidelines Card */}
      <div className="card mt-3">
        <div className="card-header">
          <h3><i className="fa fa-info-circle"></i> Issue Guidelines</h3>
        </div>
        <div className="card-body">
          <ul className="guidelines-list">
            <li>Maximum books per student: <strong>{PASSWORD_REQUIREMENTS.maxBooksPerStudent}</strong></li>
            <li>Default loan period: <strong>{PASSWORD_REQUIREMENTS.loanDays} days</strong></li>
            <li>Fine for overdue: <strong>${PASSWORD_REQUIREMENTS.finePerDay} per day</strong></li>
            <li>Students can renew once for additional <strong>{PASSWORD_REQUIREMENTS.loanDays} days</strong></li>
          </ul>
        </div>
      </div>

      <style>{`
        .student-info, .book-info {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .student-info p, .book-info {
          margin: 5px 0;
          color: #28a745;
          font-weight: bold;
        }
        
        .text-danger {
          color: #dc3545;
        }
        
        .due-date-preview {
          background: #e7f3ff;
          border: 1px solid #b6d4fe;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        
        .due-date-preview h4 {
          margin: 0 0 10px;
          color: #0c5460;
        }
        
        .due-date {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
          margin: 10px 0;
        }
        
        .days-info {
          color: #666;
          font-size: 14px;
          margin: 0;
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

export default IssueBook;
