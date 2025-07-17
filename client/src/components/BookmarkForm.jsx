
import { useState } from 'react';
import axios from 'axios';

function BookmarkForm() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:3001/api/bookmarks',
        { url },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Bookmark saved!');
      setUrl('');
    } catch (err) {
      setError(err.response?.data.error || 'Failed to save bookmark');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Save a Bookmark</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
      </form>
    </div>
  );
}

export default BookmarkForm;