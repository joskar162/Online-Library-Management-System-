import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    status: 1
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await categoriesAPI.getAll();
    if (result.success) {
      setCategories(result.data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'status' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    let result;
    if (editCategory) {
      result = await categoriesAPI.update(editCategory.id, formData.categoryName, formData.status);
    } else {
      result = await categoriesAPI.create(formData.categoryName, formData.status);
    }

    if (result.success) {
      setMessage(editCategory ? 'Category updated successfully!' : 'Category added successfully!');
      fetchCategories();
      closeModal();
    } else {
      setMessage('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setFormData({
      categoryName: category.categoryName,
      status: category.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await categoriesAPI.delete(id);
      if (result.success) {
        setMessage('Category deleted successfully!');
        fetchCategories();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setFormData({
      categoryName: '',
      status: 1
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Manage Categories</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-between">
            <h3>Categories Listing</h3>
            <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
              Add New Category
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-center">No categories found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Status</th>
                  <th>Creation Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.categoryName}</td>
                    <td>
                      <span className={`badge ${category.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {category.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(category.creationDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category.id)}
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
              <h3>{editCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="categoryName"
                    className="form-control"
                    value={formData.categoryName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editCategory ? 'Update' : 'Add'}
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
        .badge-danger {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ManageCategories;
