// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import DashboardPage from './pages/DashboardPage';

const PostEditor = () => {
    const { id } = useParams();
    return <CreatePostPage key={id || 'new'} />;
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/post/:id" element={<PostDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/create" 
                        element={
                            <ProtectedRoute>
                                <PostEditor />
                            </ProtectedRoute>
                        } 
                    />
                    {/* Add other protected routes here (e.g., /edit/:id, /dashboard) */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/edit/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />

                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
