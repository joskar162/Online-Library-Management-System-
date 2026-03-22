// Mock API service - In production, replace with actual API calls
const API_BASE = '/api';

// Mock database
const mockDB = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'e6e061838856bf47e1de730719fb2609', // admin123
    fullName: 'Kumar Pandule',
    email: 'kumarpandule@gmail.com'
  },
  students: [
    {
      id: 1,
      studentId: 'SID002',
      fullName: 'Anuj kumar',
      email: 'anuj.lpu1@gmail.com',
      mobile: '9865472555',
      password: 'f925916e2754e5e03f75dd58a5733251', // password123
      status: 1,
      regDate: '2017-07-11 15:37:05'
    },
    {
      id: 2,
      studentId: 'SID005',
      fullName: 'sdfsd',
      email: 'csfsd@dfsfks.com',
      mobile: '8569710025',
      password: '92228410fc8b872914e023160cf4ae8f',
      status: 0,
      regDate: '2017-07-11 15:41:27'
    },
    {
      id: 3,
      studentId: 'SID009',
      fullName: 'test',
      email: 'test@gmail.com',
      mobile: '2359874527',
      password: 'f925916e2754e5e03f75dd58a5733251',
      status: 1,
      regDate: '2017-07-11 15:58:28'
    },
    {
      id: 4,
      studentId: 'SID010',
      fullName: 'Amit',
      email: 'amit@gmail.com',
      mobile: '8585856224',
      password: 'f925916e2754e5e03f75dd58a5733251',
      status: 1,
      regDate: '2017-07-15 13:40:30'
    },
    {
      id: 5,
      studentId: 'SID011',
      fullName: 'Sarita Pandey',
      email: 'sarita@gmail.com',
      mobile: '4672423754',
      password: 'f925916e2754e5e03f75dd58a5733251',
      status: 1,
      regDate: '2017-07-15 18:00:59'
    }
  ],
  authors: [
    { id: 1, authorName: 'Kumar Pandule', creationDate: '2017-07-08 12:49:09', UpdationDate: '2021-06-28 16:03:28' },
    { id: 2, authorName: 'Kumar', creationDate: '2017-07-08 14:30:23', UpdationDate: '2021-06-28 16:03:35' },
    { id: 3, authorName: 'Rahul', creationDate: '2017-07-08 14:35:08', UpdationDate: '2021-06-28 16:03:43' },
    { id: 4, authorName: 'HC Verma', creationDate: '2017-07-08 14:35:21', UpdationDate: null },
    { id: 5, authorName: 'R.D. Sharma', creationDate: '2017-07-08 14:35:36', UpdationDate: null }
  ],
  categories: [
    { id: 1, categoryName: 'Romantic', status: 1, creationDate: '2017-07-04 18:35:25', UpdationDate: '2017-07-06 16:00:42' },
    { id: 2, categoryName: 'Technology', status: 1, creationDate: '2017-07-04 18:35:39', UpdationDate: '2017-07-08 17:13:03' },
    { id: 3, categoryName: 'Science', status: 1, creationDate: '2017-07-04 18:35:55', UpdationDate: null },
    { id: 4, categoryName: 'Management', status: 0, creationDate: '2017-07-04 18:36:16', UpdationDate: null }
  ],
  books: [
    { id: 1, bookName: 'PHP And MySql programming', catId: 2, authorId: 1, isbnNumber: 222333, bookPrice: 20, regDate: '2017-07-08 20:04:55', UpdationDate: '2017-07-15 05:54:41' },
    { id: 2, bookName: 'physics', catId: 3, authorId: 4, isbnNumber: 1111, bookPrice: 15, regDate: '2017-07-08 20:17:31', UpdationDate: '2017-07-15 06:13:17' }
  ],
  issuedBooks: [
    { id: 1, bookId: 1, studentId: 'SID002', issuesDate: '2017-07-15 06:09:47', returnDate: '2017-07-15 11:15:20', returnStatus: 1, fine: 0 },
    { id: 2, bookId: 1, studentId: 'SID002', issuesDate: '2017-07-15 06:12:27', returnDate: '2017-07-15 11:15:23', returnStatus: 1, fine: 5 },
    { id: 3, bookId: 2, studentId: 'SID002', issuesDate: '2017-07-15 06:13:40', returnDate: null, returnStatus: 0, fine: null },
    { id: 4, bookId: 2, studentId: 'SID002', issuesDate: '2017-07-15 06:23:23', returnDate: '2017-07-15 11:22:29', returnStatus: 1, fine: 2 },
    { id: 5, bookId: 1, studentId: 'SID009', issuesDate: '2017-07-15 10:59:26', returnDate: null, returnStatus: 0, fine: null },
    { id: 6, bookId: 2, studentId: 'SID011', issuesDate: '2017-07-15 18:02:55', returnDate: null, returnStatus: 0, fine: null }
  ],
  nextStudentId: 12
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Admin API
export const adminAPI = {
  login: async (username, password) => {
    await delay(300);
    if (username === mockDB.admin.username && password === 'admin123') {
      return { success: true, data: mockDB.admin };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  getStats: async () => {
    await delay(200);
    const totalBooks = mockDB.books.length;
    const totalIssued = mockDB.issuedBooks.length;
    const totalReturned = mockDB.issuedBooks.filter(b => b.returnStatus === 1).length;
    const totalStudents = mockDB.students.filter(s => s.status === 1).length;
    const totalAuthors = mockDB.authors.length;
    const totalCategories = mockDB.categories.length;
    
    return {
      success: true,
      data: {
        totalBooks,
        totalIssued,
        totalReturned,
        totalStudents,
        totalAuthors,
        totalCategories
      }
    };
  }
};

// Student API
export const studentAPI = {
  login: async (email, password) => {
    await delay(300);
    const student = mockDB.students.find(s => s.email === email && s.password === password);
    if (student) {
      if (student.status === 0) {
        return { success: false, message: 'Your Account Has been blocked. Please contact admin' };
      }
      return { success: true, data: student };
    }
    return { success: false, message: 'Invalid email or password' };
  },
  
  signup: async (fullName, mobile, email, password) => {
    await delay(300);
    const existingStudent = mockDB.students.find(s => s.email === email);
    if (existingStudent) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newStudent = {
      id: mockDB.students.length + 1,
      studentId: `SID${String(mockDB.nextStudentId).padStart(3, '0')}`,
      fullName,
      email,
      mobile,
      password,
      status: 1,
      regDate: new Date().toISOString()
    };
    
    mockDB.students.push(newStudent);
    mockDB.nextStudentId++;
    
    return { success: true, data: newStudent };
  },
  
  getProfile: async (studentId) => {
    await delay(200);
    const student = mockDB.students.find(s => s.studentId === studentId);
    if (student) {
      return { success: true, data: student };
    }
    return { success: false, message: 'Student not found' };
  },
  
  updateProfile: async (studentId, data) => {
    await delay(300);
    const index = mockDB.students.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
      mockDB.students[index] = { ...mockDB.students[index], ...data };
      return { success: true, data: mockDB.students[index] };
    }
    return { success: false, message: 'Student not found' };
  }
};

// Books API
export const booksAPI = {
  getAll: async () => {
    await delay(200);
    const books = mockDB.books.map(book => {
      const category = mockDB.categories.find(c => c.id === book.catId);
      const author = mockDB.authors.find(a => a.id === book.authorId);
      return {
        ...book,
        categoryName: category?.categoryName || 'Unknown',
        authorName: author?.authorName || 'Unknown'
      };
    });
    return { success: true, data: books };
  },
  
  getById: async (id) => {
    await delay(200);
    const book = mockDB.books.find(b => b.id === parseInt(id));
    if (book) {
      const category = mockDB.categories.find(c => c.id === book.catId);
      const author = mockDB.authors.find(a => a.id === book.authorId);
      return {
        success: true,
        data: {
          ...book,
          categoryName: category?.categoryName,
          authorName: author?.authorName
        }
      };
    }
    return { success: false, message: 'Book not found' };
  },
  
  create: async (bookData) => {
    await delay(300);
    const newBook = {
      id: mockDB.books.length + 1,
      ...bookData,
      regDate: new Date().toISOString(),
      UpdationDate: null
    };
    mockDB.books.push(newBook);
    return { success: true, data: newBook };
  },
  
  update: async (id, bookData) => {
    await delay(300);
    const index = mockDB.books.findIndex(b => b.id === parseInt(id));
    if (index !== -1) {
      mockDB.books[index] = {
        ...mockDB.books[index],
        ...bookData,
        UpdationDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.books[index] };
    }
    return { success: false, message: 'Book not found' };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = mockDB.books.findIndex(b => b.id === parseInt(id));
    if (index !== -1) {
      mockDB.books.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Book not found' };
  }
};

// Authors API
export const authorsAPI = {
  getAll: async () => {
    await delay(200);
    return { success: true, data: mockDB.authors };
  },
  
  create: async (authorName) => {
    await delay(300);
    const newAuthor = {
      id: mockDB.authors.length + 1,
      authorName,
      creationDate: new Date().toISOString(),
      UpdationDate: null
    };
    mockDB.authors.push(newAuthor);
    return { success: true, data: newAuthor };
  },
  
  update: async (id, authorName) => {
    await delay(300);
    const index = mockDB.authors.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockDB.authors[index] = {
        ...mockDB.authors[index],
        authorName,
        UpdationDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.authors[index] };
    }
    return { success: false, message: 'Author not found' };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = mockDB.authors.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockDB.authors.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Author not found' };
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    await delay(200);
    return { success: true, data: mockDB.categories };
  },
  
  create: async (categoryName, status) => {
    await delay(300);
    const newCategory = {
      id: mockDB.categories.length + 1,
      categoryName,
      status,
      creationDate: new Date().toISOString(),
      UpdationDate: null
    };
    mockDB.categories.push(newCategory);
    return { success: true, data: newCategory };
  },
  
  update: async (id, categoryName, status) => {
    await delay(300);
    const index = mockDB.categories.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      mockDB.categories[index] = {
        ...mockDB.categories[index],
        categoryName,
        status,
        UpdationDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.categories[index] };
    }
    return { success: false, message: 'Category not found' };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = mockDB.categories.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      mockDB.categories.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Category not found' };
  }
};

// Issued Books API
export const issuedBooksAPI = {
  getAll: async () => {
    await delay(200);
    const issuedBooks = mockDB.issuedBooks.map(issued => {
      const book = mockDB.books.find(b => b.id === issued.bookId);
      const student = mockDB.students.find(s => s.studentId === issued.studentId);
      return {
        ...issued,
        bookName: book?.bookName || 'Unknown',
        isbnNumber: book?.isbnNumber || 'N/A',
        studentName: student?.fullName || 'Unknown'
      };
    });
    return { success: true, data: issuedBooks };
  },
  
  getByStudent: async (studentId) => {
    await delay(200);
    const issuedBooks = mockDB.issuedBooks
      .filter(i => i.studentId === studentId)
      .map(issued => {
        const book = mockDB.books.find(b => b.id === issued.bookId);
        return {
          ...issued,
          bookName: book?.bookName || 'Unknown',
          isbnNumber: book?.isbnNumber || 'N/A'
        };
      });
    return { success: true, data: issuedBooks };
  },
  
  issue: async (studentId, bookId) => {
    await delay(300);
    const book = mockDB.books.find(b => b.id === parseInt(bookId));
    const student = mockDB.students.find(s => s.studentId === studentId);
    
    if (!book) return { success: false, message: 'Book not found' };
    if (!student) return { success: false, message: 'Student not found' };
    
    const newIssue = {
      id: mockDB.issuedBooks.length + 1,
      bookId: parseInt(bookId),
      studentId,
      issuesDate: new Date().toISOString(),
      returnDate: null,
      returnStatus: 0,
      fine: null
    };
    
    mockDB.issuedBooks.push(newIssue);
    return { success: true, data: newIssue };
  },
  
  return: async (id, fine) => {
    await delay(300);
    const index = mockDB.issuedBooks.findIndex(i => i.id === parseInt(id));
    if (index !== -1) {
      mockDB.issuedBooks[index] = {
        ...mockDB.issuedBooks[index],
        returnDate: new Date().toISOString(),
        returnStatus: 1,
        fine: fine || 0
      };
      return { success: true, data: mockDB.issuedBooks[index] };
    }
    return { success: false, message: 'Issue record not found' };
  }
};

// Students API (Admin)
export const studentsAPI = {
  getAll: async () => {
    await delay(200);
    return { success: true, data: mockDB.students };
  },
  
  getById: async (studentId) => {
    await delay(200);
    const student = mockDB.students.find(s => s.studentId === studentId);
    if (student) {
      return { success: true, data: student };
    }
    return { success: false, message: 'Student not found' };
  },
  
  updateStatus: async (studentId, status) => {
    await delay(300);
    const index = mockDB.students.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
      mockDB.students[index].status = status;
      return { success: true, data: mockDB.students[index] };
    }
    return { success: false, message: 'Student not found' };
  }
};
