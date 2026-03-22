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
  const [formData, setFormData] = useState({
    bookName: '',
    catId: '',
    authorId: '',
    isbnNumber: '',
    bookPrice: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [booksResult, authorsResult, categoriesResult] = await Promise.all([
      booksAPI.getAll(),
      authorsAPI.getAll(),
      categoriesAPI.getAll()
    ]);

    if (booksResult.success) setBooks(booksResult.data);
    if (authorsResult.success) setAuthors(authorsResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data);
    
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
      setMessage('Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setFormData({
      bookName: book.bookName,
      catId: book.catId,
      authorId: book.authorId,
      isbnNumber: book.isbnNumber,
      bookPrice: book.bookPrice
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const result = await booksAPI.delete(id);
      if (result.success) {
        setMessage('Book deleted successfully!');
        fetchData();
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
      bookPrice: ''
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

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

      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-between">
            <h3>Books Listing</h3>
            <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
              Add New Book
            </button>
          </div>
        </div>

        {books.length === 0 ? (
          <p className="text-center">No books found.</p>
        ) : (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td>{book.bookName}</td>
                    <td>{book.categoryName}</td>
                    <td>{book.authorName}</td>
                    <td>{book.isbnNumber}</td>
                    <td>${book.bookPrice}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book.id)}
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
              <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Book Name</label>
                  <input
                    type="text"
                    name="bookName"
                    className="form-control"
                    value={formData.bookName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
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
                  <label>Author</label>
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

                <div className="form-group">
                  <label>ISBN Number</label>
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
                  <label>Price</label>
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
    </div>
  );
};

export default ManageBooks;
