import React from 'react';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="w-full min-h-screen bg-[#040906] text-white selection:bg-[#00FF66] selection:text-[#040906]">
        <Home />
      </div>
    </AuthProvider>
  );
}
