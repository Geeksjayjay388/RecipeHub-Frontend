import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipePage from './pages/RecipePage';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import CreateRecipePage from './pages/CreateRecipePage';
function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/create-recipe" element={<CreateRecipePage />} />
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;