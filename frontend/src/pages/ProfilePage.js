import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added Link for Edit actions
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import decorativeImg from '../assets/decorative.jpg'; 

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // NEW: State for user's posts
  const [myPosts, setMyPosts] = useState([]);

  // Fetch only this user's posts on load
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        // Assuming your backend has a route like /posts/user/me or similar
        // If not, you can filter all posts by user._id
        const { data } = await API.get('/posts'); 
        const filtered = data.filter(p => p.author?._id === user?._id || p.author === user?._id);
        setMyPosts(filtered);
      } catch (err) {
        console.error("Error fetching your posts:", err);
      }
    };
    if (user) fetchMyPosts();
  }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault(); setMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsg('Password changed successfully!');
      setCurPw(''); setNewPw('');
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  // NEW: Delete Handler
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${postId}`);
        setMyPosts(myPosts.filter(p => p._id !== postId));
        setMsg('Post deleted successfully!');
      } catch (err) {
        setMsg('Failed to delete post.');
      }
    }
  };

  const picSrc = user?.profilePic
    ? `${backendUrl}/uploads/${user.profilePic}`
    : '/default-avatar.png';

  return (
    <main>
      <section className="section-inner">
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '20px' }}>Account Settings</h2>
        
        {msg && <p style={{ textAlign: 'center', color: '#d63384', fontWeight: 'bold' }}>{msg}</p>}

        <div className="profile-container" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* EDIT PROFILE CARD */}
          <div className="google-form-wrapper" style={{ 
            flex: '1', 
            minWidth: '400px', 
            padding: '40px', 
            display: 'flex',
            justifyContent: 'center'
          }}>
            <form className="registration-form" onSubmit={handleProfile} style={{ 
                width: '100%', 
                maxWidth: '400px', 
                boxShadow: 'none', 
                border: 'none',
                padding: '0' 
            }}>
              <h3 style={{ color: '#d63384', borderBottom: '1px solid #eee' }}>Edit Profile</h3>
              
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '5px solid #d63384',
                margin: '10px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#fff'
              }}>
                <img src={picSrc} alt='Profile' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div>
                <label>Display Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder='Display name' />
              </div>

              <div>
                <label>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder='Short bio...' rows={3} />
              </div>

              <div>
                <label>Profile Picture</label>
                <input type='file' accept='image/*' onChange={e => setPic(e.target.files[0])} style={{border:'none'}} />
              </div>

              <button type='submit' className="btn-primary">Save Profile</button>
            </form>
          </div>

          {/* SECURITY CARD */}
          <div className="google-form-wrapper" style={{ 
            flex: '1', 
            minWidth: '400px', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="form-banner" style={{ height: '200px', width: '100%' }}>
               <img src={decorativeImg} alt="Security Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                <form className="registration-form" onSubmit={handlePassword} style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    boxShadow: 'none', 
                    border: 'none',
                    padding: '0' 
                }}>
                <h3 style={{ color: '#d63384', borderBottom: '1px solid #eee' }}>Security</h3>
                
                <div>
                    <label>Current Password</label>
                    <input type='password' placeholder='Enter current password' value={curPw} onChange={e => setCurPw(e.target.value)} required />
                </div>

                <div>
                    <label>New Password</label>
                    <input type='password' placeholder='New password (min 6 chars)' value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} />
                </div>

                <button type='submit' className="btn-primary" style={{ marginTop: '20px' }}>Update Password</button>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: MANAGE MY CONTENT SECTION --- */}
      <section className="section-inner" style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <h3 style={{ textAlign: 'center', color: '#d63384', marginBottom: '20px' }}>Manage My Content</h3>
        <div className="google-form-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
          <div className="table-container">
            <table className="resource-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Post Title</th>
                  <th>Date Published</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <tr key={post._id}>
                      <td>{post.title}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Link to={`/edit-post/${post._id}`} style={{ color: '#d63384', marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>Edit</Link>
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      You haven't published any posts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;