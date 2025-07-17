import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookmarkList = ({ onLogout }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(res.data);
    } catch (err) {
      setError(err.response?.data.error || 'Failed to fetch bookmarks');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      setError(err.response?.data.error || 'Failed to delete bookmark');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="p-4"> {/* Keeping p-4 as a simple padding class; adjust if needed */}
      <button onClick={onLogout} className="btn-red p-2 mb-4">
        Logout
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <h2 className="text-2xl font-bold mb-4">My Bookmarks</h2>
      <div className="grid-container">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="p-4 border rounded shadow">
            <div className="flex items-center mb-2">
              <img
                src={bookmark.favicon}
                alt="favicon"
                className="w-6 h-6 mr-2"
                onError={(e) => (e.target.src = '/favicon.ico')}
              />
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold"
              >
                {bookmark.title}
              </a>
            </div>
            <p className="text-gray-600 text-sm">{bookmark.summary}</p>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="btn-red mt-2 p-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;