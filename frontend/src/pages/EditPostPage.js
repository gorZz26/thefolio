import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * EditPostPage Component
 * Updated to use Base64 image strings for permanent storage on Render.
 */
const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [base64Image, setBase64Image] = useState(''); // Stores new converted image
  const [existingImage, setExistingImage] = useState(''); // Stores current image from DB
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Configuration
  const API_URL = 'https://thefolio-ojmc.onrender.com/api';
  const backendUrl = 'https://thefolio-ojmc.onrender.com';

  // 1. Fetch the existing post data to pre-fill the form
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
        setExistingImage(data.image);
      } catch (err) {
        setError('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 2. Handle conversion of new image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        setError('Image is too large. Please use a file under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result); // This becomes the preview and the data to send
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    // We send a JSON object now, not FormData
    const updateData = {
      title,
      body,
      // If a new image was picked, send base64Image; otherwise keep existingImage string
      image: base64Image || existingImage 
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/posts/${id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate(`/posts/${id}`); 
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post';
      setError(typeof msg === 'string' ? msg : 'Error updating post');
    } finally {
      setUpdating(false);
    }
  };

  // Determine which preview to show
  const displayPreview = base64Image 
    ? base64Image 
    : (existingImage?.startsWith('data:') 
        ? existingImage 
        : (existingImage ? `${backendUrl}/uploads/${existingImage}` : null));

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#d63384' }}>Loading Post Data...</div>;

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '30px' }}>Edit Your Post</h2>

        <div className="google-form-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', background: '#fff' }}>
          
          {error && (
            <p style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
              {error}
            </p>
          )}

          <form className="registration-form" onSubmit={handleSubmit} style={{ boxShadow: 'none', border: 'none', padding: '0' }}>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#d63384' }}>Update Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required 
                style={{ width: '100%', fontSize: '1.1rem', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#d63384' }}>Update Content</label>
              <textarea 
                value={body} 
                onChange={e => setBody(e.target.value)}
                rows={12} 
                required 
                style={{ width: '100%', padding: '15px', lineHeight: '1.6', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            {/* Image Update Section */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '20px', 
              background: '#fdf2f8', 
              borderRadius: '10px', 
              border: '1px dashed #d63384' 
            }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                Change Cover Image
              </label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange} 
                style={{ border: 'none', padding: '0' }}
              />
              
              {displayPreview && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Preview:</p>
                  <img 
                    src={displayPreview} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type='submit' 
                  disabled={updating}
                  className="btn-primary" 
                  style={{ flex: 2, fontSize: '1.1rem', padding: '15px', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1 }}
                >
                    {updating ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button 
                    type='button' 
                    onClick={() => navigate(-1)} 
                    style={{ flex: 1, background: '#666', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cancel
                </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EditPostPage;