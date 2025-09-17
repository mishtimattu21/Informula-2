import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;


