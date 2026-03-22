import { useState, useEffect } from 'react';
import { authorsAPI } from '../../services/api';

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const result = await authorsAPI.getAll();
    if (result.success) {
      setAuthors(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    let result;
    if (editAuthor) {
      result = await authorsAPI.update(editAuthor.id, authorName);
    } else {
      result = await authorsAPI.create(authorName);
    }

    if (result.success) {
      setMessage(editAuthor ? 'Author updated successfully!' : 'Author added successfully!');
      fetchAuthors();
      closeModal();
    } else {
      setMessage('Failed to save author');
    }
  };

  const handleEdit = (author) => {
    setEditAuthor(author);
    setAuthorName(author.authorName);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      const result = await authorsAPI.delete(id);
      if (result.success) {
        setMessage('Author deleted successfully!');
        fetchAuthors();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditAuthor(null);
    setAuthorName('');
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Manage Authors</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-between">
            <h3>Authors Listing</h3>
            <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
              Add New Author
            </button>
          </div>
        </div>

        {authors.length === 0 ? (
          <p className="text-center">No authors found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Author Name</th>
                  <th>Creation Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author, index) => (
                  <tr key={author.id}>
                    <td>{index + 1}</td>
                    <td>{author.authorName}</td>
                    <td>{new Date(author.creationDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(author)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(author.id)}
                        style={{ marginLeft: '5px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editAuthor ? 'Edit Author' : 'Add New Author'}</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Author Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editAuthor ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAuthors;
