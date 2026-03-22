import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const BookRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    bookName: '',
    authorName: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user?.studentId) return;
    
    setLoading(true);
    const result = await studentAPI.getBookRequests(user.studentId);
    if (result.success) {
      setRequests(result.data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.bookName || !formData.authorName) {
      setMessage('Please fill in all fields');
      return;
    }

    const result = await studentAPI.requestBook(user.studentId, formData.bookName, formData.authorName);
    if (result.success) {
      setMessage('Book request submitted successfully! We will review it shortly.');
      setFormData({ bookName: '', authorName: '' });
      setShowModal(false);
      fetchRequests();
    } else {
      setMessage('Failed to submit request. Please try again.');
    }
  };

  const formatDate = (dateString) => {
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

  return (
    <div>
      <div className="page-header">
        <h2>Book Requests</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-between align-items-center">
            <h3>My Book Requests</h3>
            <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
              <i className="fa fa-plus"></i> Request New Book
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <i className="fa fa-book"></i>
            <p>You haven't made any book requests yet.</p>
            <p className="text-muted">Request a book if it's not available in the library.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Admin Remarks</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td>{request.bookName}</td>
                    <td>{request.authorName}</td>
                    <td>{formatDate(request.requestDate)}</td>
                    <td>
                      {request.status === 'pending' && (
                        <span className="badge badge-warning">Pending</span>
                      )}
                      {request.status === 'approved' && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="badge badge-danger">Rejected</span>
                      )}
                    </td>
                    <td>
                      {request.adminRemark || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request a New Book</h3>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p className="text-muted">
                  Request a book that's not currently available in the library. 
                  The admin will review your request.
                </p>
                
                <div className="form-group">
                  <label>Book Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="bookName"
                    className="form-control"
                    value={formData.bookName}
                    onChange={handleChange}
                    placeholder="Enter the book name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Author Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="authorName"
                    className="form-control"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="Enter the author name"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .empty-state i {
          font-size: 48px;
          margin-bottom: 15px;
          color: #ccc;
        }
        
        .empty-state p {
          margin: 5px 0;
        }
        
        .text-muted {
          color: #6c757d;
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
      `}</style>
    </div>
  );
};

export default BookRequests;
