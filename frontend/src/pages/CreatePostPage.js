import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * CreatePostPage Component
 * Handles the logic for converting images to Base64 and sending JSON data to the backend.
 */
const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [base64Image, setBase64Image] = useState(''); // Stores the converted string
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // The Base URL for your Render backend
  const API_URL = 'https://thefolio-ojmc.onrender.com/api';

  // Converts the file into a Base64 string for persistent storage in MongoDB
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit check
        setError('Image is too large. Please select a file under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result); // This results in 'data:image/png;base64,...'
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Send a regular JSON object, avoiding Render's ephemeral storage issues
    const postData = {
      title,
      body,
      image: base64Image
    };

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      // Navigate to the newly created post
      navigate(`/posts/${data._id}`);
    } catch (err) {
      // Ensure error is a string to avoid "Objects are not valid as React child" error
      const msg = err.response?.data?.message || err.message || 'Failed to publish post';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-12 bg-gray-50">
      <section className="max-w-4xl mx-auto pt-10 px-4">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-600 m-0">Write a New Post</h2>
          
          <div className="flex gap-4">
            <Link to="/" className="text-gray-600 no-underline text-sm font-bold hover:text-pink-600">
              👁 View All Posts
            </Link>
            <Link to="/profile" className="text-gray-600 no-underline text-sm font-bold hover:text-pink-600">
              ⚙️ Manage My Content
            </Link>
          </div>
        </div>

        <div className="bg-white p-10 rounded shadow-sm border border-gray-100">
          
          {error && (
            <p className="text-red-500 text-center bg-red-50 p-3 rounded mb-6 border border-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block font-bold text-pink-600 mb-2">Post Title</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder='Enter a catchy title...' 
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-pink-600 mb-2">Content</label>
              <textarea 
                className="w-full border border-gray-300 p-2 rounded h-64 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={body} 
                onChange={e => setBody(e.target.value)}
                placeholder='Share your thoughts with the community...' 
                required 
              />
            </div>

            <div className="p-5 bg-pink-50 rounded-lg border border-dashed border-pink-400">
              <label className="block font-bold mb-3 text-gray-700">
                Add Cover Image
              </label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
              />
              
              {base64Image && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Image Preview:</p>
                  <img 
                    src={base64Image} 
                    alt="Preview" 
                    className="w-full max-h-80 object-cover rounded shadow-md" 
                  />
                </div>
              )}
            </div>

            <button 
              type='submit' 
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded text-lg transition-all ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

/**
 * Entry point for the preview environment.
 * Wraps the CreatePostPage in a HashRouter to prevent context errors.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<CreatePostPage />} />
      </Routes>
    </Router>
  );
}