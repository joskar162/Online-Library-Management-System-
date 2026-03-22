import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, authorsAPI, categoriesAPI } from '../../services/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [message, setMessage] = useState('');
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [formData, setFormData] = useState({
    bookName: '',
    catId: '',
    authorId: '',
    isbnNumber: '',
    bookPrice: '',
    quantity: 1
  });

  useEffect(() => {
    fetchData();
  }, [pagination.page, search, categoryFilter, authorFilter]);

  const fetchData = async () => {
    setLoading(true);
    const [booksResult, authorsResult, categoriesResult] = await Promise.all([
      booksAPI.getAll(search, categoryFilter, authorFilter, pagination.page, pagination.limit),
      authorsAPI.getAll(),
      categoriesAPI.getAll()
    ]);

    if (booksResult.success) {
      setBooks(booksResult.data);
      setPagination(prev => ({
        ...prev,
        total: booksResult.pagination.total,
        totalPages: booksResult.pagination.totalPages
      }));
    }
    if (authorsResult.success) setAuthors(authorsResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data.filter(c => c.status === 1));
    
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

    let result;
    if (editBook) {
      result = await booksAPI.update(editBook.id, formData);
    } else {
      result = await booksAPI.create(formData);
    }

    if (result.success) {
      setMessage(editBook ? 'Book updated successfully!' : 'Book added successfully!');
      fetchData();
      closeModal();
    } else {
      setMessage(result.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setFormData({
      bookName: book.bookName,
      catId: book.catId,
      authorId: book.authorId,
      isbnNumber: book.isbnNumber,
      bookPrice: book.bookPrice,
      quantity: book.quantity
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const result = await booksAPI.delete(id);
      if (result.success) {
        setMessage('Book deleted successfully!');
        fetchData();
      } else {
        setMessage(result.message || 'Failed to delete book');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditBook(null);
    setFormData({
      bookName: '',
      catId: '',
      authorId: '',
      isbnNumber: '',
      bookPrice: '',
      quantity: 1
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchData();
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setAuthorFilter('');
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
        <h2>Manage Books</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="card mb-3">
        <div className="card-header">
          <h3><i className="fa fa-search"></i> Search & Filter Books</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-row">
              <div className="filter-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book name or ISBN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select
                  className="form-control"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <select
                  className="form-control"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                >
                  <option value="">All Authors</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>{author.authorName}</option>
                  ))}
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
          <div className="d-flex justify-between align-items-center">
            <h3>Books Listing ({pagination.total} total)</h3>
            <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
              <i className="fa fa-plus"></i> Add New Book
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : books.length === 0 ? (
          <p className="text-center">No books found.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Book Name</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>{book.bookName}</td>
                      <td>{book.categoryName}</td>
                      <td>{book.authorName}</td>
                      <td>{book.isbnNumber}</td>
                      <td>${book.bookPrice}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <span className={`badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {book.available}
                        </span>
                      </td>
                      <td>
                        {book.isAvailable ? (
                          <span className="badge badge-success">Available</span>
                        ) : (
                          <span className="badge badge-warning">Issued</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(book)}
                          title="Edit"
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(book.id)}
                          style={{ marginLeft: '5px' }}
                          title="Delete"
                          disabled={!book.isAvailable}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Book Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="bookName"
                    className="form-control"
                    value={formData.bookName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="catId"
                      className="form-control"
                      value={formData.catId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Author <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="authorId"
                      className="form-control"
                      value={formData.authorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Author</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>{author.authorName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN Number <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="number"
                      name="isbnNumber"
                      className="form-control"
                      value={formData.isbnNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="number"
                      name="bookPrice"
                      className="form-control"
                      value={formData.bookPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Quantity <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  <small className="text-muted">Number of copies available in the library</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editBook ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
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
        
        .badge-danger {
          background-color: #dc3545;
          color: white;
        }
        
        .badge-warning {
          background-color: #ffc107;
          color: #333;
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
        
        .pagination .btn {
          padding: 5px 10px;
        }
        
        .mb-3 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ManageBooks;
