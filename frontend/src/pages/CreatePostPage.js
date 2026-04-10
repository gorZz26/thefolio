import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Image Preview Logic
  useEffect(() => {
    if (!image) { setPreview(null); return; }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
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
            <p style={{ color: 'red', textAlign: 'center', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
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
                placeholder='Share your thoughts with the community...' 
                rows={12} 
                required 
              />
            </div>

            {/* IMAGE UPLOAD SECTION - Now visible to everyone */}
            <div style={{ 
              marginBottom: '25px', 
              padding: '20px', 
              background: '#fdf2f8', 
              borderRadius: '10px', 
              border: '1px dashed #d63384' 
            }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                Add Cover Image
              </label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={e => setImage(e.target.files[0])} 
                style={{ border: 'none', padding: '0' }}
              />
              
              {preview && (
                <div style={{ marginTop: '15px' }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                </div>
              )}
            </div>

            <button type='submit' className="btn-primary" style={{ fontSize: '1.1rem', padding: '15px', width: '100%' }}>
              Publish Post
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreatePostPage;