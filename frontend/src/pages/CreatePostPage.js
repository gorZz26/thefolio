import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(''); // Stores the Base64 text string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // The Magic Part: Converts the file to a Base64 string
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit check
        setError('File is too large. Please select an image under 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result); // This is the Base64 string
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // We send a regular JSON object, not FormData
      const postData = { title, body, image };

      const { data } = await axios.post('https://thefolio-ojmc.onrender.com/api/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(`/posts/${data._id}`); // Go to the post detail page
    } catch (err) {
      if (err.response?.status === 413) {
        setError('Image data is too large for the server. Try a smaller file.');
      } else {
        setError(err.response?.data?.message || 'Failed to publish post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto 15px auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px'
        }}>
          <h2 style={{ color: '#d63384', margin: 0 }}>Write a New Post</h2>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/home" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
              👁 View All Posts
            </Link>
            <Link to="/profile" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
              ⚙️ Manage My Content
            </Link>
          </div>
        </div>

        <div className="google-form-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', background: '#fff' }}>
          
          {error && (
            <p style={{ color: 'red', textAlign: 'center', background: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
              {error}
            </p>
          )}

          <form className="registration-form" onSubmit={handleSubmit} style={{ boxShadow: 'none', border: 'none', padding: '0' }}>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', color: '#d63384' }}>Post Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder='Enter a catchy title...' 
                required 
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', color: '#d63384' }}>Content</label>
              <textarea 
                value={body} 
                onChange={e => setBody(e.target.value)}
                placeholder='Share your thoughts...' 
                rows={12} 
                required 
              />
            </div>

            <div style={{ 
              marginBottom: '25px', 
              padding: '20px', 
              background: '#fdf2f8', 
              borderRadius: '10px', 
              border: '1px dashed #d63384' 
            }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                Add Cover Image (Saved Permanently)
              </label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange} 
                style={{ border: 'none', padding: '0', width: '100%' }}
              />
              
              {image && (
                <div style={{ marginTop: '15px' }}>
                  <img 
                    src={image} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                </div>
              )}
            </div>

            <button 
              type='submit' 
              className="btn-primary" 
              disabled={loading}
              style={{ fontSize: '1.1rem', padding: '15px', width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreatePost;