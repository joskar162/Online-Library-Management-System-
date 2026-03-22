// Enhanced API service with all missing features
const API_BASE = '/api';

// Configuration constants
const FINE_PER_DAY = 1; // $1 per day overdue
const DEFAULT_LOAN_DAYS = 14; // 14 days loan period
const MAX_BOOKS_PER_STUDENT = 3; // Maximum books a student can borrow
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REQUIRE_UPPERCASE = true;
const PASSWORD_REQUIRE_NUMBER = true;
const PASSWORD_REQUIRE_SPECIAL = false;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MINUTES = 15;

// Mock database with enhanced data
const mockDB = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'e6e061838856bf47e1de730719fb2609', // admin123 (MD5)
    fullName: 'Kumar Pandule',
    email: 'kumarpandule@gmail.com',
    mobile: '9865472555',
    profileImage: null
  },
  students: [
    {
      id: 1,
      studentId: 'SID002',
      fullName: 'Anuj kumar',
      email: 'anuj.lpu1@gmail.com',
      mobile: '9865472555',
      password: 'f925916e2754e5e03f75dd58a5733251', // password123 (MD5)
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
    { id: 1, bookName: 'PHP And MySql programming', catId: 2, authorId: 1, isbnNumber: 222333, bookPrice: 20, quantity: 5, available: 4, bookImage: null, regDate: '2017-07-08 20:04:55', UpdationDate: '2017-07-15 05:54:41' },
    { id: 2, bookName: 'Physics', catId: 3, authorId: 4, isbnNumber: 1111, bookPrice: 15, quantity: 3, available: 2, bookImage: null, regDate: '2017-07-08 20:17:31', UpdationDate: '2017-07-15 06:13:17' },
    { id: 3, bookName: 'JavaScript Complete Guide', catId: 2, authorId: 2, isbnNumber: 444555, bookPrice: 25, quantity: 4, available: 4, bookImage: null, regDate: '2017-07-10 10:00:00', UpdationDate: null },
    { id: 4, bookName: 'Python for Data Science', catId: 2, authorId: 3, isbnNumber: 666777, bookPrice: 30, quantity: 2, available: 0, bookImage: null, regDate: '2017-07-12 14:30:00', UpdationDate: null }
  ],
  issuedBooks: [
    { id: 1, bookId: 1, studentId: 'SID002', issuesDate: '2017-07-15 06:09:47', dueDate: '2017-07-29 06:09:47', returnDate: '2017-07-15 11:15:20', returnStatus: 1, fine: 0 },
    { id: 2, bookId: 1, studentId: 'SID002', issuesDate: '2017-07-15 06:12:27', dueDate: '2017-07-29 06:12:27', returnDate: '2017-07-15 11:15:23', returnStatus: 1, fine: 5 },
    { id: 3, bookId: 2, studentId: 'SID002', issuesDate: '2017-07-15 06:13:40', dueDate: '2017-07-29 06:13:40', returnDate: null, returnStatus: 0, fine: null },
    { id: 4, bookId: 2, studentId: 'SID002', issuesDate: '2017-07-15 06:23:23', dueDate: '2017-07-29 06:23:23', returnDate: '2017-07-15 11:22:29', returnStatus: 1, fine: 2 },
    { id: 5, bookId: 1, studentId: 'SID009', issuesDate: '2017-07-15 10:59:26', dueDate: '2017-07-29 10:59:26', returnDate: null, returnStatus: 0, fine: null, isRenewed: false },
    { id: 6, bookId: 2, studentId: 'SID011', issuesDate: '2017-07-15 18:02:55', dueDate: '2017-07-29 18:02:55', returnDate: null, returnStatus: 0, fine: null, isRenewed: false }
  ],
  bookRequests: [
    { id: 1, studentId: 'SID002', bookName: 'Advanced Python', authorName: 'John Doe', status: 'pending', requestDate: '2017-07-16 10:00:00', adminRemark: null },
    { id: 2, studentId: 'SID009', bookName: 'Machine Learning Basics', authorName: 'Jane Smith', status: 'approved', requestDate: '2017-07-16 11:00:00', adminRemark: 'Book will be procured', processedDate: '2017-07-16 14:00:00' }
  ],
  fines: [
    { id: 1, studentId: 'SID002', issuedBookId: 2, amount: 5, status: 'paid', paymentDate: '2017-07-15 12:00:00' },
    { id: 2, studentId: 'SID002', issuedBookId: 4, amount: 2, status: 'paid', paymentDate: '2017-07-15 12:30:00' }
  ],
  nextStudentId: 12,
  loginAttempts: {}, // Track failed login attempts
  bookBorrowingHistory: [] // For reports
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions
const calculateFine = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const diffTime = returned - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * FINE_PER_DAY : 0;
};

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

const getDaysUntilDue = (dueDate) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getAvailableBooks = (books, issuedBooks) => {
  return books.map(book => {
    const issuedCount = issuedBooks.filter(ib => ib.bookId === book.id && ib.returnStatus === 0).length;
    return {
      ...book,
      available: book.quantity - issuedCount,
      isAvailable: (book.quantity - issuedCount) > 0
    };
  });
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (PASSWORD_REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

const checkLoginAttempts = (identifier) => {
  const attempts = mockDB.loginAttempts[identifier];
  if (!attempts) return { locked: false, attempts: 0 };
  
  const lockoutEnd = attempts.lockoutEnd ? new Date(attempts.lockoutEnd) : null;
  if (lockoutEnd && lockoutEnd > new Date()) {
    const remainingMinutes = Math.ceil((lockoutEnd - new Date()) / (1000 * 60));
    return { locked: true, attempts: attempts.count, remainingMinutes };
  }
  
  // Reset if lockout expired
  if (lockoutEnd && lockoutEnd <= new Date()) {
    delete mockDB.loginAttempts[identifier];
    return { locked: false, attempts: 0 };
  }
  
  return { locked: false, attempts: attempts.count || 0 };
};

const recordFailedLogin = (identifier) => {
  if (!mockDB.loginAttempts[identifier]) {
    mockDB.loginAttempts[identifier] = { count: 0, lockoutEnd: null };
  }
  mockDB.loginAttempts[identifier].count += 1;
  
  if (mockDB.loginAttempts[identifier].count >= MAX_LOGIN_ATTEMPTS) {
    const lockoutEnd = new Date();
    lockoutEnd.setMinutes(lockoutEnd.getMinutes() + LOGIN_LOCKOUT_MINUTES);
    mockDB.loginAttempts[identifier].lockoutEnd = lockoutEnd.toISOString();
  }
};

const resetLoginAttempts = (identifier) => {
  delete mockDB.loginAttempts[identifier];
};

// ==================== ADMIN API ====================
export const adminAPI = {
  login: async (username, password) => {
    await delay(300);
    
    const loginCheck = checkLoginAttempts(username);
    if (loginCheck.locked) {
      return { 
        success: false, 
        message: `Account locked. Try again in ${loginCheck.remainingMinutes} minutes` 
      };
    }
    
    if (username === mockDB.admin.username && password === 'admin123') {
      resetLoginAttempts(username);
      return { success: true, data: mockDB.admin };
    }
    
    recordFailedLogin(username);
    const attemptsLeft = MAX_LOGIN_ATTEMPTS - mockDB.loginAttempts[username].count;
    
    return { 
      success: false, 
      message: attemptsLeft > 0 
        ? `Invalid credentials. ${attemptsLeft} attempts remaining`
        : 'Account locked. Try again later'
    };
  },
  
  getStats: async () => {
    await delay(200);
    
    const totalBooks = mockDB.books.length;
    const totalQuantity = mockDB.books.reduce((sum, b) => sum + b.quantity, 0);
    const availableBooks = mockDB.books.reduce((sum, b) => sum + b.available, 0);
    const totalIssued = mockDB.issuedBooks.filter(b => b.returnStatus === 0).length;
    const totalReturned = mockDB.issuedBooks.filter(b => b.returnStatus === 1).length;
    const totalStudents = mockDB.students.filter(s => s.status === 1).length;
    const totalAuthors = mockDB.authors.length;
    const totalCategories = mockDB.categories.length;
    const pendingRequests = mockDB.bookRequests.filter(r => r.status === 'pending').length;
    const totalFines = mockDB.fines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const overdueBooks = mockDB.issuedBooks.filter(b => b.returnStatus === 0 && isOverdue(b.dueDate)).length;
    
    return {
      success: true,
      data: {
        totalBooks,
        totalQuantity,
        availableBooks,
        totalIssued,
        totalReturned,
        totalStudents,
        totalAuthors,
        totalCategories,
        pendingRequests,
        totalFines,
        overdueBooks
      }
    };
  },
  
  getProfile: async () => {
    await delay(200);
    return { success: true, data: mockDB.admin };
  },
  
  updateProfile: async (data) => {
    await delay(300);
    mockDB.admin = { ...mockDB.admin, ...data };
    return { success: true, data: mockDB.admin };
  },
  
  changePassword: async (oldPassword, newPassword) => {
    await delay(300);
    
    if (oldPassword !== 'admin123') {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.errors.join(', ') };
    }
    
    // In production, hash the new password
    mockDB.admin.password = newPassword; // Would be hashed in real app
    return { success: true, message: 'Password changed successfully' };
  },
  
  getReports: async (reportType = 'all', startDate = null, endDate = null) => {
    await delay(300);
    
    const reports = {};
    
    // Books issued report
    reports.issuedBooks = mockDB.issuedBooks.map(issued => {
      const book = mockDB.books.find(b => b.id === issued.bookId);
      const student = mockDB.students.find(s => s.studentId === issued.studentId);
      return {
        ...issued,
        bookName: book?.bookName || 'Unknown',
        studentName: student?.fullName || 'Unknown'
      };
    });
    
    // Most borrowed books
    const bookBorrowCount = {};
    mockDB.issuedBooks.forEach(issued => {
      bookBorrowCount[issued.bookId] = (bookBorrowCount[issued.bookId] || 0) + 1;
    });
    reports.mostBorrowedBooks = Object.entries(bookBorrowCount)
      .map(([bookId, count]) => {
        const book = mockDB.books.find(b => b.id === parseInt(bookId));
        return { bookId, bookName: book?.bookName || 'Unknown', count };
      })
      .sort((a, b) => b.count - a.count);
    
    // Most active students
    const studentBorrowCount = {};
    mockDB.issuedBooks.forEach(issued => {
      studentBorrowCount[issued.studentId] = (studentBorrowCount[issued.studentId] || 0) + 1;
    });
    reports.mostActiveStudents = Object.entries(studentBorrowCount)
      .map(([studentId, count]) => {
        const student = mockDB.students.find(s => s.studentId === studentId);
        return { studentId, studentName: student?.fullName || 'Unknown', count };
      })
      .sort((a, b) => b.count - a.count);
    
    // Revenue report (fines)
    reports.fines = mockDB.fines.map(fine => {
      const student = mockDB.students.find(s => s.studentId === fine.studentId);
      return {
        ...fine,
        studentName: student?.fullName || 'Unknown'
      };
    });
    reports.totalFineRevenue = mockDB.fines
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);
    
    // Late returns report
    reports.lateReturns = mockDB.issuedBooks
      .filter(issued => issued.returnStatus === 1 && issued.fine > 0)
      .map(issued => {
        const book = mockDB.books.find(b => b.id === issued.bookId);
        const student = mockDB.students.find(s => s.studentId === issued.studentId);
        return {
          ...issued,
          bookName: book?.bookName || 'Unknown',
          studentName: student?.fullName || 'Unknown'
        };
      });
    
    return { success: true, data: reports };
  }
};

// ==================== STUDENT API ====================
export const studentAPI = {
  login: async (email, password) => {
    await delay(300);
    
    const loginCheck = checkLoginAttempts(email);
    if (loginCheck.locked) {
      return { 
        success: false, 
        message: `Account locked. Try again in ${loginCheck.remainingMinutes} minutes` 
      };
    }
    
    const student = mockDB.students.find(s => s.email === email && s.password === password);
    
    if (student) {
      if (student.status === 0) {
        return { success: false, message: 'Your Account Has been blocked. Please contact admin' };
      }
      resetLoginAttempts(email);
      return { success: true, data: student };
    }
    
    recordFailedLogin(email);
    const attemptsLeft = MAX_LOGIN_ATTEMPTS - (mockDB.loginAttempts[email]?.count || 0);
    
    return { 
      success: false, 
      message: attemptsLeft > 0 
        ? `Invalid email or password. ${attemptsLeft} attempts remaining`
        : 'Account locked. Try again later'
    };
  },
  
  signup: async (fullName, mobile, email, password) => {
    await delay(300);
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.errors.join(', ') };
    }
    
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
      // Get borrowing history count
      const borrowCount = mockDB.issuedBooks.filter(i => i.studentId === studentId).length;
      const returnedCount = mockDB.issuedBooks.filter(i => i.studentId === studentId && i.returnStatus === 1).length;
      const currentIssued = mockDB.issuedBooks.filter(i => i.studentId === studentId && i.returnStatus === 0).length;
      const totalFines = mockDB.fines
        .filter(f => f.studentId === studentId && f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);
      
      return { 
        success: true, 
        data: { ...student, borrowCount, returnedCount, currentIssued, totalFines } 
      };
    }
    return { success: false, message: 'Student not found' };
  },
  
  updateProfile: async (studentId, data) => {
    await delay(300);
    const index = mockDB.students.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
      // Don't allow status change through this method
      const { status, ...updateData } = data;
      mockDB.students[index] = { ...mockDB.students[index], ...updateData };
      return { success: true, data: mockDB.students[index] };
    }
    return { success: false, message: 'Student not found' };
  },
  
  changePassword: async (studentId, oldPassword, newPassword) => {
    await delay(300);
    
    const student = mockDB.students.find(s => s.studentId === studentId);
    if (!student) {
      return { success: false, message: 'Student not found' };
    }
    
    if (student.password !== oldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.errors.join(', ') };
    }
    
    student.password = newPassword;
    return { success: true, message: 'Password changed successfully' };
  },
  
  getBorrowingHistory: async (studentId) => {
    await delay(200);
    const history = mockDB.issuedBooks
      .filter(i => i.studentId === studentId)
      .map(issued => {
        const book = mockDB.books.find(b => b.id === issued.bookId);
        return {
          ...issued,
          bookName: book?.bookName || 'Unknown',
          isbnNumber: book?.isbnNumber || 'N/A'
        };
      });
    return { success: true, data: history };
  },
  
  requestBook: async (studentId, bookName, authorName) => {
    await delay(300);
    const newRequest = {
      id: mockDB.bookRequests.length + 1,
      studentId,
      bookName,
      authorName,
      status: 'pending',
      requestDate: new Date().toISOString(),
      adminRemark: null
    };
    mockDB.bookRequests.push(newRequest);
    return { success: true, data: newRequest };
  },
  
  getBookRequests: async (studentId) => {
    await delay(200);
    const requests = mockDB.bookRequests.filter(r => r.studentId === studentId);
    return { success: true, data: requests };
  },
  
  payFine: async (studentId, fineId) => {
    await delay(300);
    const fineIndex = mockDB.fines.findIndex(f => f.id === parseInt(fineId) && f.studentId === studentId);
    if (fineIndex !== -1) {
      mockDB.fines[fineIndex].status = 'paid';
      mockDB.fines[fineIndex].paymentDate = new Date().toISOString();
      return { success: true, data: mockDB.fines[fineIndex] };
    }
    return { success: false, message: 'Fine not found' };
  },
  
  getFines: async (studentId) => {
    await delay(200);
    const fines = mockDB.fines.filter(f => f.studentId === studentId);
    return { success: true, data: fines };
  }
};

// ==================== BOOKS API ====================
export const booksAPI = {
  getAll: async (search = '', category = '', author = '', page = 1, limit = 10) => {
    await delay(200);
    
    let books = mockDB.books.map(book => {
      const categoryData = mockDB.categories.find(c => c.id === book.catId);
      const authorData = mockDB.authors.find(a => a.id === book.authorId);
      const issuedCount = mockDB.issuedBooks.filter(ib => ib.bookId === book.id && ib.returnStatus === 0).length;
      return {
        ...book,
        categoryName: categoryData?.categoryName || 'Unknown',
        authorName: authorData?.authorName || 'Unknown',
        available: book.quantity - issuedCount,
        isAvailable: (book.quantity - issuedCount) > 0
      };
    });
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(b => 
        b.bookName.toLowerCase().includes(searchLower) ||
        b.isbnNumber.toString().includes(searchLower)
      );
    }
    
    if (category) {
      books = books.filter(b => b.catId === parseInt(category));
    }
    
    if (author) {
      books = books.filter(b => b.authorId === parseInt(author));
    }
    
    // Pagination
    const total = books.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    return { 
      success: true, 
      data: paginatedBooks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
  
  getAvailable: async () => {
    await delay(200);
    const books = mockDB.books.map(book => {
      const categoryData = mockDB.categories.find(c => c.id === book.catId);
      const authorData = mockDB.authors.find(a => a.id === book.authorId);
      const issuedCount = mockDB.issuedBooks.filter(ib => ib.bookId === book.id && ib.returnStatus === 0).length;
      return {
        ...book,
        categoryName: categoryData?.categoryName || 'Unknown',
        authorName: authorData?.authorName || 'Unknown',
        available: book.quantity - issuedCount,
        isAvailable: (book.quantity - issuedCount) > 0
      };
    }).filter(b => b.available > 0);
    
    return { success: true, data: books };
  },
  
  getById: async (id) => {
    await delay(200);
    const book = mockDB.books.find(b => b.id === parseInt(id));
    if (book) {
      const categoryData = mockDB.categories.find(c => c.id === book.catId);
      const authorData = mockDB.authors.find(a => a.id === book.authorId);
      const issuedCount = mockDB.issuedBooks.filter(ib => ib.bookId === book.id && ib.returnStatus === 0).length;
      return {
        success: true,
        data: {
          ...book,
          categoryName: categoryData?.categoryName,
          authorName: authorData?.authorName,
          available: book.quantity - issuedCount,
          isAvailable: (book.quantity - issuedCount) > 0
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
      quantity: bookData.quantity || 1,
      available: bookData.quantity || 1,
      bookImage: bookData.bookImage || null,
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
      const issuedCount = mockDB.issuedBooks.filter(ib => ib.bookId === parseInt(id) && ib.returnStatus === 0).length;
      mockDB.books[index] = {
        ...mockDB.books[index],
        ...bookData,
        quantity: bookData.quantity || mockDB.books[index].quantity,
        available: (bookData.quantity || mockDB.books[index].quantity) - issuedCount,
        UpdationDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.books[index] };
    }
    return { success: false, message: 'Book not found' };
  },
  
  delete: async (id) => {
    await delay(300);
    // Check if book is currently issued
    const isIssued = mockDB.issuedBooks.some(ib => ib.bookId === parseInt(id) && ib.returnStatus === 0);
    if (isIssued) {
      return { success: false, message: 'Cannot delete book that is currently issued' };
    }
    
    const index = mockDB.books.findIndex(b => b.id === parseInt(id));
    if (index !== -1) {
      mockDB.books.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Book not found' };
  }
};

// ==================== AUTHORS API ====================
export const authorsAPI = {
  getAll: async (search = '', page = 1, limit = 10) => {
    await delay(200);
    
    let authors = [...mockDB.authors];
    
    if (search) {
      const searchLower = search.toLowerCase();
      authors = authors.filter(a => a.authorName.toLowerCase().includes(searchLower));
    }
    
    const total = authors.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAuthors = authors.slice(startIndex, endIndex);
    
    return { 
      success: true, 
      data: paginatedAuthors,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
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
    // Check if author has books
    const hasBooks = mockDB.books.some(b => b.authorId === parseInt(id));
    if (hasBooks) {
      return { success: false, message: 'Cannot delete author with associated books' };
    }
    
    const index = mockDB.authors.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockDB.authors.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Author not found' };
  }
};

// ==================== CATEGORIES API ====================
export const categoriesAPI = {
  getAll: async (search = '', page = 1, limit = 10) => {
    await delay(200);
    
    let categories = [...mockDB.categories];
    
    if (search) {
      const searchLower = search.toLowerCase();
      categories = categories.filter(c => c.categoryName.toLowerCase().includes(searchLower));
    }
    
    const total = categories.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = categories.slice(startIndex, endIndex);
    
    return { 
      success: true, 
      data: paginatedCategories,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
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
    // Check if category has books
    const hasBooks = mockDB.books.some(b => b.catId === parseInt(id));
    if (hasBooks) {
      return { success: false, message: 'Cannot delete category with associated books' };
    }
    
    const index = mockDB.categories.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      mockDB.categories.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Category not found' };
  }
};

// ==================== ISSUED BOOKS API ====================
export const issuedBooksAPI = {
  getAll: async (search = '', status = '', page = 1, limit = 10) => {
    await delay(200);
    
    let issuedBooks = mockDB.issuedBooks.map(issued => {
      const book = mockDB.books.find(b => b.id === issued.bookId);
      const student = mockDB.students.find(s => s.studentId === issued.studentId);
      const daysUntilDue = issued.returnStatus === 0 ? getDaysUntilDue(issued.dueDate) : null;
      const isCurrentlyOverdue = issued.returnStatus === 0 && isOverdue(issued.dueDate);
      
      return {
        ...issued,
        bookName: book?.bookName || 'Unknown',
        isbnNumber: book?.isbnNumber || 'N/A',
        studentName: student?.fullName || 'Unknown',
        daysUntilDue,
        isOverdue: isCurrentlyOverdue
      };
    });
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      issuedBooks = issuedBooks.filter(ib => 
        ib.bookName.toLowerCase().includes(searchLower) ||
        ib.studentName.toLowerCase().includes(searchLower) ||
        ib.studentId.toLowerCase().includes(searchLower)
      );
    }
    
    if (status !== '') {
      issuedBooks = issuedBooks.filter(ib => ib.returnStatus === parseInt(status));
    }
    
    // Sort by issue date (newest first)
    issuedBooks.sort((a, b) => new Date(b.issuesDate) - new Date(a.issuesDate));
    
    const total = issuedBooks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = issuedBooks.slice(startIndex, endIndex);
    
    return { 
      success: true, 
      data: paginatedBooks,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  },
  
  getByStudent: async (studentId) => {
    await delay(200);
    const issuedBooks = mockDB.issuedBooks
      .filter(i => i.studentId === studentId)
      .map(issued => {
        const book = mockDB.books.find(b => b.id === issued.bookId);
        const daysUntilDue = issued.returnStatus === 0 ? getDaysUntilDue(issued.dueDate) : null;
        const isCurrentlyOverdue = issued.returnStatus === 0 && isOverdue(issued.dueDate);
        
        return {
          ...issued,
          bookName: book?.bookName || 'Unknown',
          isbnNumber: book?.isbnNumber || 'N/A',
          daysUntilDue,
          isOverdue: isCurrentlyOverdue
        };
      });
    return { success: true, data: issuedBooks };
  },
  
  issue: async (studentId, bookId, days = DEFAULT_LOAN_DAYS) => {
    await delay(300);
    
    const book = mockDB.books.find(b => b.id === parseInt(bookId));
    const student = mockDB.students.find(s => s.studentId === studentId);
    
    if (!book) return { success: false, message: 'Book not found' };
    if (!student) return { success: false, message: 'Student not found' };
    
    // Check if student is active
    if (student.status !== 1) {
      return { success: false, message: 'Student account is blocked' };
    }
    
    // Check book availability
    const issuedCount = mockDB.issuedBooks.filter(ib => ib.bookId === parseInt(bookId) && ib.returnStatus === 0).length;
    if (issuedCount >= book.quantity) {
      return { success: false, message: 'Book is not available' };
    }
    
    // Check how many books student has already issued
    const studentIssuedCount = mockDB.issuedBooks.filter(
      ib => ib.studentId === studentId && ib.returnStatus === 0
    ).length;
    
    if (studentIssuedCount >= MAX_BOOKS_PER_STUDENT) {
      return { success: false, message: `Student has already issued ${MAX_BOOKS_PER_STUDENT} books. Cannot issue more.` };
    }
    
    const issuesDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    
    const newIssue = {
      id: mockDB.issuedBooks.length + 1,
      bookId: parseInt(bookId),
      studentId,
      issuesDate: issuesDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      returnStatus: 0,
      fine: null,
      isRenewed: false
    };
    
    mockDB.issuedBooks.push(newIssue);
    
    // Update book availability
    book.available = book.quantity - (issuedCount + 1);
    
    return { success: true, data: newIssue };
  },
  
  return: async (id) => {
    await delay(300);
    const index = mockDB.issuedBooks.findIndex(i => i.id === parseInt(id));
    if (index !== -1) {
      const issued = mockDB.issuedBooks[index];
      const returnDate = new Date();
      const dueDate = new Date(issued.dueDate);
      
      // Calculate fine automatically
      const fine = calculateFine(dueDate, returnDate);
      
      mockDB.issuedBooks[index] = {
        ...issued,
        returnDate: returnDate.toISOString(),
        returnStatus: 1,
        fine: fine
      };
      
      // Update book availability
      const book = mockDB.books.find(b => b.id === issued.bookId);
      if (book) {
        const issuedCount = mockDB.issuedBooks.filter(
          ib => ib.bookId === issued.bookId && ib.returnStatus === 0
        ).length;
        book.available = book.quantity - issuedCount;
      }
      
      // Create fine record if there's a fine
      if (fine > 0) {
        const newFine = {
          id: mockDB.fines.length + 1,
          studentId: issued.studentId,
          issuedBookId: issued.id,
          amount: fine,
          status: 'unpaid',
          paymentDate: null
        };
        mockDB.fines.push(newFine);
      }
      
      return { 
        success: true, 
        data: mockDB.issuedBooks[index],
        fineCalculated: fine
      };
    }
    return { success: false, message: 'Issue record not found' };
  },
  
  renew: async (id, additionalDays = DEFAULT_LOAN_DAYS) => {
    await delay(300);
    const index = mockDB.issuedBooks.findIndex(i => i.id === parseInt(id));
    
    if (index !== -1) {
      const issued = mockDB.issuedBooks[index];
      
      if (issued.returnStatus === 1) {
        return { success: false, message: 'Book has already been returned' };
      }
      
      if (issued.isRenewed) {
        return { success: false, message: 'Book has already been renewed' };
      }
      
      // Extend due date
      const newDueDate = new Date(issued.dueDate);
      newDueDate.setDate(newDueDate.getDate() + additionalDays);
      
      mockDB.issuedBooks[index] = {
        ...issued,
        dueDate: newDueDate.toISOString(),
        isRenewed: true
      };
      
      return { success: true, data: mockDB.issuedBooks[index] };
    }
    return { success: false, message: 'Issue record not found' };
  }
};

// ==================== STUDENTS API (Admin) ====================
export const studentsAPI = {
  getAll: async (search = '', status = '', page = 1, limit = 10) => {
    await delay(200);
    
    let students = [...mockDB.students];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(s => 
        s.fullName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.studentId.toLowerCase().includes(searchLower) ||
        s.mobile.includes(search)
      );
    }
    
    if (status !== '') {
      students = students.filter(s => s.status === parseInt(status));
    }
    
    // Sort by registration date (newest first)
    students.sort((a, b) => new Date(b.regDate) - new Date(a.regDate));
    
    const total = students.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = students.slice(startIndex, endIndex);
    
    // Add additional info
    const studentsWithInfo = paginatedStudents.map(student => {
      const borrowCount = mockDB.issuedBooks.filter(i => i.studentId === student.studentId).length;
      const currentIssued = mockDB.issuedBooks.filter(i => i.studentId === student.studentId && i.returnStatus === 0).length;
      const totalFines = mockDB.fines
        .filter(f => f.studentId === student.studentId && f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);
      
      return {
        ...student,
        borrowCount,
        currentIssued,
        totalFines
      };
    });
    
    return { 
      success: true, 
      data: studentsWithInfo,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  },
  
  getById: async (studentId) => {
    await delay(200);
    const student = mockDB.students.find(s => s.studentId === studentId);
    if (student) {
      const borrowHistory = mockDB.issuedBooks.filter(i => i.studentId === studentId);
      const currentIssued = borrowHistory.filter(i => i.returnStatus === 0);
      const totalFines = mockDB.fines
        .filter(f => f.studentId === studentId && f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);
      
      return { 
        success: true, 
        data: {
          ...student,
          totalBorrowed: borrowHistory.length,
          currentIssued: currentIssued.length,
          totalFines
        }
      };
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
  },
  
  getBorrowingHistory: async (studentId) => {
    await delay(200);
    const history = mockDB.issuedBooks
      .filter(i => i.studentId === studentId)
      .map(issued => {
        const book = mockDB.books.find(b => b.id === issued.bookId);
        return {
          ...issued,
          bookName: book?.bookName || 'Unknown',
          isbnNumber: book?.isbnNumber || 'N/A'
        };
      });
    return { success: true, data: history };
  }
};

// ==================== BOOK REQUESTS API ====================
export const bookRequestsAPI = {
  getAll: async (status = '', page = 1, limit = 10) => {
    await delay(200);
    
    let requests = mockDB.bookRequests.map(request => {
      const student = mockDB.students.find(s => s.studentId === request.studentId);
      return {
        ...request,
        studentName: student?.fullName || 'Unknown',
        studentEmail: student?.email || 'Unknown'
      };
    });
    
    if (status) {
      requests = requests.filter(r => r.status === status);
    }
    
    // Sort by request date (newest first)
    requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    
    const total = requests.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = requests.slice(startIndex, endIndex);
    
    return { 
      success: true, 
      data: paginatedRequests,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  },
  
  updateStatus: async (id, status, remark) => {
    await delay(300);
    const index = mockDB.bookRequests.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      mockDB.bookRequests[index] = {
        ...mockDB.bookRequests[index],
        status,
        adminRemark: remark,
        processedDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.bookRequests[index] };
    }
    return { success: false, message: 'Request not found' };
  }
};

// ==================== FINES API ====================
export const finesAPI = {
  getAll: async (status = '', page = 1, limit = 10) => {
    await delay(200);
    
    let fines = mockDB.fines.map(fine => {
      const student = mockDB.students.find(s => s.studentId === fine.studentId);
      const issuedBook = mockDB.issuedBooks.find(i => i.id === fine.issuedBookId);
      const book = issuedBook ? mockDB.books.find(b => b.id === issuedBook.bookId) : null;
      
      return {
        ...fine,
        studentName: student?.fullName || 'Unknown',
        studentEmail: student?.email || 'Unknown',
        bookName: book?.bookName || 'Unknown'
      };
    });
    
    if (status) {
      fines = fines.filter(f => f.status === status);
    }
    
    const total = fines.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFines = fines.slice(startIndex, endIndex);
    
    const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = fines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const unpaidAmount = fines.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
    
    return { 
      success: true, 
      data: paginatedFines,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: { totalAmount, paidAmount, unpaidAmount }
    };
  },
  
  markAsPaid: async (id) => {
    await delay(300);
    const index = mockDB.fines.findIndex(f => f.id === parseInt(id));
    if (index !== -1) {
      mockDB.fines[index] = {
        ...mockDB.fines[index],
        status: 'paid',
        paymentDate: new Date().toISOString()
      };
      return { success: true, data: mockDB.fines[index] };
    }
    return { success: false, message: 'Fine not found' };
  }
};

// ==================== UTILITY EXPORTS ====================
export const validatePasswordStrength = validatePassword;
export const getLoginAttempts = checkLoginAttempts;
export const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  requireUppercase: PASSWORD_REQUIRE_UPPERCASE,
  requireNumber: PASSWORD_REQUIRE_NUMBER,
  requireSpecial: PASSWORD_REQUIRE_SPECIAL,
  maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
  lockoutMinutes: LOGIN_LOCKOUT_MINUTES,
  maxBooksPerStudent: MAX_BOOKS_PER_STUDENT,
  loanDays: DEFAULT_LOAN_DAYS,
  finePerDay: FINE_PER_DAY
};
