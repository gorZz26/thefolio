import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // 1. Fetch the existing post data to pre-fill the form
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
        if (data.image) setPreview(`${backendUrl}/uploads/${data.image}`);
      } catch (err) {
        setError('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 2. Handle new image preview
  useEffect(() => {
    if (!image) return;
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
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`); // Send user back to the updated post
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading Post...</div>;

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '30px' }}>Edit Your Post</h2>

        <div className="google-form-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
          
          {error && (
            <p style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
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
                style={{ width: '100%', fontSize: '1.1rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#d63384' }}>Update Content</label>
              <textarea 
                value={body} 
                onChange={e => setBody(e.target.value)}
                rows={12} 
                required 
                style={{ width: '100%', padding: '15px', lineHeight: '1.6' }}
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
                onChange={e => setImage(e.target.files[0])} 
                style={{ border: 'none', padding: '0' }}
              />
              
              {preview && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>Current/New Preview:</p>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button type='submit' className="btn-primary" style={{ flex: 2, fontSize: '1.1rem', padding: '15px' }}>
                    Save Changes
                </button>
                <button 
                    type='button' 
                    onClick={() => navigate(-1)} 
                    style={{ flex: 1, background: '#666', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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