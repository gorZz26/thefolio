import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * ProfilePage Component
 * Updated to use Base64 for permanent image storage on Render's free tier.
 */
const ProfilePage = () => {
  // Local state to replace missing context in preview
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [base64Pic, setBase64Pic] = useState(''); 
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);

  const navigate = useNavigate();
  const API_URL = 'https://thefolio-ojmc.onrender.com/api';
  const backendUrl = 'https://thefolio-ojmc.onrender.com';

  // Fetch profile and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch User
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = userRes.data;
        setUser(userData);
        setName(userData.name || '');
        setBio(userData.bio || '');

        // Fetch Posts
        const postsRes = await axios.get(`${API_URL}/posts`);
        const filtered = postsRes.data.filter(p => 
          p.author?._id === userData._id || p.author === userData._id
        );
        setMyPosts(filtered);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setMsg('Image too large. Please use an image under 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Pic(reader.result);
        setMsg('');
      };
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault(); 
    setMsg('');
    setLoading(true);

    const updateData = {
      name,
      bio,
      profilePic: base64Pic || user?.profilePic
    };

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
      setUser(data);
      setMsg('Profile updated successfully!');
      setBase64Pic('');
    } catch (err) { 
      setMsg(err.response?.data?.message || 'Error updating profile'); 
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/auth/change-password`, 
        { currentPassword: curPw, newPassword: newPw },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setMsg('Password changed successfully!');
      setCurPw(''); setNewPw('');
    } catch (err) { 
      setMsg(err.response?.data?.message || 'Error changing password'); 
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyPosts(myPosts.filter(p => p._id !== postId));
        setMsg('Post deleted successfully!');
      } catch (err) {
        setMsg('Failed to delete post.');
      }
    }
  };

  const picSrc = base64Pic 
    ? base64Pic 
    : (user?.profilePic?.startsWith('data:') 
        ? user.profilePic 
        : (user?.profilePic ? `${backendUrl}/uploads/${user.profilePic}` : 'https://via.placeholder.com/150'));

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <h2 className="text-center text-pink-600 text-3xl font-bold mb-8">Account Settings</h2>
        
        {msg && (
          <p className="text-center text-pink-700 font-bold bg-pink-50 p-3 rounded-lg mb-6 border border-pink-100 shadow-sm">
            {msg}
          </p>
        )}

        <div className="flex flex-wrap gap-8 justify-center">
          {/* EDIT PROFILE CARD */}
          <div className="flex-1 min-w-[350px] max-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <form onSubmit={handleProfile} className="space-y-6">
              <h3 className="text-pink-600 text-xl font-bold border-b border-gray-100 pb-2">Edit Profile</h3>
              
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full border-4 border-pink-500 overflow-hidden bg-white shadow-inner">
                  <img src={picSrc} alt='Profile' className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-pink-500 outline-none"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder='Display name' 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                <textarea 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-pink-500 outline-none"
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder='Short bio...' 
                  rows={3} 
                />
              </div>

              <div className="bg-pink-50 p-4 rounded-lg border border-dashed border-pink-300">
                <label className="block font-bold text-xs text-pink-800 mb-2 uppercase tracking-wider">Change Profile Picture</label>
                <input 
                  type='file' 
                  accept='image/*' 
                  onChange={handleImageChange} 
                  className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                />
              </div>

              <button 
                type='submit' 
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-bold transition-all ${loading ? 'bg-pink-300' : 'bg-pink-600 hover:bg-pink-700 shadow-md'}`}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* SECURITY CARD */}
          <div className="flex-1 min-w-[350px] max-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-48 w-full bg-pink-100">
               <img src="https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=1000&auto=format&fit=crop" alt="Security Banner" className="w-full h-full object-cover opacity-80" />
            </div>

            <div className="p-10 flex-grow">
                <form onSubmit={handlePassword} className="space-y-6">
                <h3 className="text-pink-600 text-xl font-bold border-b border-gray-100 pb-2">Security</h3>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                    <input 
                      type='password' 
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-pink-500 outline-none"
                      placeholder='Enter current password' 
                      value={curPw} 
                      onChange={e => setCurPw(e.target.value)} 
                      required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <input 
                      type='password' 
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-pink-500 outline-none"
                      placeholder='New password (min 6 chars)' 
                      value={newPw} 
                      onChange={e => setNewPw(e.target.value)} 
                      required 
                      minLength={6} 
                    />
                </div>

                <button type='submit' className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-md transition-all mt-4">
                  Update Password
                </button>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGE CONTENT SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h3 className="text-center text-pink-600 text-2xl font-bold mb-6">Manage My Content</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-700">Post Title</th>
                <th className="pb-4 font-bold text-gray-700">Date Published</th>
                <th className="pb-4 font-bold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <tr key={post._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-800">{post.title}</td>
                    <td className="py-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-center">
                      <Link to={`/edit-post/${post._id}`} className="text-pink-600 mr-4 font-bold hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400 italic">
                    You haven't published any posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;