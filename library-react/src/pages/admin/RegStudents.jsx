import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';

const RegStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const result = await studentsAPI.getAll();
    if (result.success) {
      setStudents(result.data);
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

  const handleStatusChange = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const result = await studentsAPI.updateStatus(studentId, newStatus);
    
    if (result.success) {
      setMessage(`Student status updated successfully!`);
      fetchStudents();
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Registered Students</h2>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Registered Students Listing</h3>
        </div>

        {students.length === 0 ? (
          <p className="text-center">No students registered.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.studentId}</td>
                    <td>{student.fullName}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile}</td>
                    <td>{formatDate(student.regDate)}</td>
                    <td>
                      <span className={`badge ${student.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {student.status === 1 ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${student.status === 1 ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleStatusChange(student.studentId, student.status)}
                      >
                        {student.status === 1 ? 'Block' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
        .badge-danger {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default RegStudents;
