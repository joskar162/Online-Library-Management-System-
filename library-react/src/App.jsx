import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Auth Pages
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentIssuedBooks from './pages/student/IssuedBooks';
import StudentChangePassword from './pages/student/ChangePassword';
import BookRequests from './pages/student/BookRequests';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageAuthors from './pages/admin/ManageAuthors';
import ManageCategories from './pages/admin/ManageCategories';
import IssueBook from './pages/admin/IssueBook';
import ManageIssuedBooks from './pages/admin/ManageIssuedBooks';
import RegStudents from './pages/admin/RegStudents';
import AdminChangePassword from './pages/admin/ChangePassword';
import AdminProfile from './pages/admin/Profile';
import Reports from './pages/admin/Reports';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (userType === 'admin' && !user?.isAdmin) {
    return <Navigate to="/student/dashboard" />;
  }

  if (userType === 'student' && user?.isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<StudentLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Protected Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute userType="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/my-profile" element={
              <ProtectedRoute userType="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/issued-books" element={
              <ProtectedRoute userType="student">
                <StudentIssuedBooks />
              </ProtectedRoute>
            } />
            <Route path="/student/change-password" element={
              <ProtectedRoute userType="student">
                <StudentChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/student/book-requests" element={
              <ProtectedRoute userType="student">
                <BookRequests />
              </ProtectedRoute>
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-books" element={
              <ProtectedRoute userType="admin">
                <ManageBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-authors" element={
              <ProtectedRoute userType="admin">
                <ManageAuthors />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-categories" element={
              <ProtectedRoute userType="admin">
                <ManageCategories />
              </ProtectedRoute>
            } />
            <Route path="/admin/issue-book" element={
              <ProtectedRoute userType="admin">
                <IssueBook />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-issued-books" element={
              <ProtectedRoute userType="admin">
                <ManageIssuedBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/reg-students" element={
              <ProtectedRoute userType="admin">
                <RegStudents />
              </ProtectedRoute>
            } />
            <Route path="/admin/change-password" element={
              <ProtectedRoute userType="admin">
                <AdminChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute userType="admin">
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute userType="admin">
                <Reports />
              </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
