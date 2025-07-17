
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Link Saver</h1>
      {token && <button onClick={handleLogout} className="mb-4 p-2 bg-red-500 text-white rounded">Logout</button>}
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={token ? <><BookmarkForm /><BookmarkList /></> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
