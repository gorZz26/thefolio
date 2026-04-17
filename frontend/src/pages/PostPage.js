import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * PostPage Component
 * Fully complete version: Handles likes, comments, author controls, and dual-source images.
 */
const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuration
  const API_URL = 'https://thefolio-ojmc.onrender.com/api';
  const backendUrl = 'https://thefolio-ojmc.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch User Info
        if (token) {
          try {
            const userRes = await axios.get(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userRes.data);
          } catch (e) {
            console.log("Session expired or invalid");
          }
        }

        // Fetch Post and Comments together
        const [postRes, commentRes] = await Promise.all([
          axios.get(`${API_URL}/posts/${id}`),
          axios.get(`${API_URL}/comments/${id}`)
        ]);
        
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error("Error loading post data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like!");
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API_URL}/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(data);
    } catch (err) {
      console.error("Like failed");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/comments/${id}`, 
        { body: commentBody },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setComments((prev) => [...prev, data]);
      setCommentBody('');
    } catch (err) {
      console.error("Comment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this entire post? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  if (loading) return <div className="text-center pt-20 text-pink-600 font-bold">Loading Post...</div>;
  if (!post) return <div className="text-center pt-20">Post not found.</div>;

  // Permissions
  const isAuthor = user && (user._id === post.author?._id || user._id === post.author);
  const isAdmin = user && user.role === 'admin';
  const canManage = isAuthor || isAdmin;

  // Image Source Logic
  const postImageSrc = post.image?.startsWith('data:') 
    ? post.image 
    : (post.image ? `${backendUrl}/uploads/${post.image}` : null);

  const authorPicSrc = post.author?.profilePic?.startsWith('data:')
    ? post.author.profilePic
    : (post.author?.profilePic ? `${backendUrl}/uploads/${post.author.profilePic}` : null);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="max-w-4xl mx-auto pt-10 px-4">
        <Link to="/" className="text-pink-600 no-underline font-bold hover:underline mb-6 inline-block">
          ← Back to Feed
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Post Hero Image */}
          {postImageSrc && (
            <div className="w-full h-[450px] overflow-hidden bg-gray-100">
              <img 
                src={postImageSrc} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-10">
            <div className="flex justify-between items-start mb-4">
               <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>
               {canManage && (
                 <div className="flex gap-2">
                   <Link 
                     to={`/edit-post/${id}`} 
                     className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-100 hover:text-pink-600 transition-colors no-underline"
                   >
                     Edit
                   </Link>
                   <button 
                     onClick={handleDeletePost}
                     className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                   >
                     Delete
                   </button>
                 </div>
               )}
            </div>
            
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-8 p-3 bg-pink-50 rounded-2xl w-fit pr-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-pink-200">
                {authorPicSrc ? (
                  <img src={authorPicSrc} alt={post.author?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-pink-700">
                    {post.author?.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-none">{post.author?.name || 'Anonymous'}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">
                  {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Post Body */}
            <div className="prose prose-pink max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-10 text-lg">
              {post.body}
            </div>

            {/* Like Button */}
            <div className="border-t border-gray-100 pt-8">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all border-2 transform active:scale-95 ${
                  post.likes?.includes(user?._id) 
                  ? 'bg-pink-600 border-pink-600 text-white shadow-lg' 
                  : 'bg-white border-pink-600 text-pink-600 hover:bg-pink-50'
                }`}
              >
                <span className="text-xl">{post.likes?.includes(user?._id) ? '❤️' : '🤍'}</span>
                {post.likes?.includes(user?._id) ? 'Liked' : 'Like'} ({post.likes?.length || 0})
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 border-b-4 border-pink-100 pb-2 mb-8 inline-block">
                Discussion ({comments.length})
              </h3>
              
              {user ? (
                <form onSubmit={handleComment} className="mb-12 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <textarea 
                    value={commentBody} 
                    onChange={(e) => setCommentBody(e.target.value)} 
                    placeholder="What are your thoughts?" 
                    className="w-full p-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none text-gray-700 h-32 transition-all"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`mt-4 px-10 py-3 bg-pink-600 text-white font-bold rounded-xl shadow-md transition-all hover:bg-pink-700 hover:shadow-lg ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 bg-gray-50 rounded-3xl text-center mb-12 text-gray-600 border border-dashed border-gray-300">
                  Please <Link to="/login" className="text-pink-600 font-bold hover:underline">Login</Link> to join the conversation.
                </div>
              )}

              {/* Comment Feed */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map(c => {
                    const cPic = c.author?.profilePic?.startsWith('data:')
                      ? c.author.profilePic
                      : (c.author?.profilePic ? `${backendUrl}/uploads/${c.author.profilePic}` : null);
                    
                    return (
                      <div key={c._id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 overflow-hidden">
                          {cPic ? (
                            <img src={cPic} alt="pic" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-pink-600 text-xs">
                              {c.author?.name?.charAt(0) || 'M'}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group-hover:border-pink-200 transition-all">
                          <div className="flex justify-between items-center mb-2">
                            <strong className="text-gray-800">{c.author?.name || 'Member'}</strong>
                            {(user?._id === c.author?._id || user?.role === 'admin') && (
                              <button 
                                onClick={() => handleDeleteComment(c._id)} 
                                className="text-gray-300 hover:text-red-500 text-[10px] font-bold uppercase transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">{c.body}</p>
                          <div className="mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-gray-400 italic bg-gray-50 rounded-3xl border border-gray-100">
                    No comments yet. Start the conversation!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PostPage;