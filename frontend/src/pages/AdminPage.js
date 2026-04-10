import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [userRes, postRes, contactRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/posts'),
          API.get('/admin/contacts')
        ]);
        setUsers(userRes.data);
        setPosts(postRes.data);
        setContacts(contactRes.data);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      // Update the user in the list with the returned user object
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const removePost = async (id) => {
    if (!window.confirm("Are you sure you want to hide this post from the feed?")) return;
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      alert("Failed to remove post");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading Dashboard...</div>;

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '30px' }}>Admin Dashboard</h2>

        {/* TAB NAVIGATION */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setTab('users')} 
            className="btn-primary"
            style={{ 
              width: 'auto', 
              padding: '10px 25px', 
              background: tab === 'users' ? '#d63384' : '#fff', 
              color: tab === 'users' ? '#fff' : '#d63384',
              border: '2px solid #d63384'
            }}
          >
            Members ({users.length})
          </button>
          <button 
            onClick={() => setTab('posts')} 
            className="btn-primary"
            style={{ 
              width: 'auto', 
              padding: '10px 25px', 
              background: tab === 'posts' ? '#d63384' : '#fff', 
              color: tab === 'posts' ? '#fff' : '#d63384',
              border: '2px solid #d63384'
            }}
          >
            All Posts ({posts.length})
          </button>
          <button 
            onClick={() => setTab('contacts')} 
            className="btn-primary"
            style={{ 
              width: 'auto', 
              padding: '10px 25px', 
              background: tab === 'contacts' ? '#d63384' : '#fff', 
              color: tab === 'contacts' ? '#fff' : '#d63384',
              border: '2px solid #d63384'
            }}
          >
            Messages ({contacts.length})
          </button>
        </div>

        {/* DATA CARD */}
        <div className="google-form-wrapper" style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px' }}>
          
          {tab === 'users' && (
            <div className="table-container">
              <table className="resource-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.8rem',
                          background: u.status === 'active' ? '#e6fffa' : '#fff5f5',
                          color: u.status === 'active' ? '#2c7a7b' : '#c53030',
                          border: `1px solid ${u.status === 'active' ? '#2c7a7b' : '#c53030'}`
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          style={{ 
                            background: u.status === 'active' ? '#ff4d4d' : '#28a745', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '6px 15px', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'posts' && (
            <div className="table-container">
              <table className="resource-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 'bold' }}>{p.title}</td>
                      <td>{p.author?.name || 'Unknown'}</td>
                      <td>
                        <span style={{ 
                           padding: '4px 10px', 
                           borderRadius: '20px', 
                           fontSize: '0.8rem',
                           background: p.status === 'published' ? '#ebf8ff' : '#edf2f7',
                           color: p.status === 'published' ? '#2b6cb0' : '#4a5568'
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {p.status === 'published' ? (
                          <button 
                            className="btn-danger" 
                            onClick={() => removePost(p._id)}
                            style={{ padding: '6px 15px', fontSize: '0.9rem' }}
                          >
                            Remove
                          </button>
                        ) : (
                          <span style={{ color: '#888', fontStyle: 'italic' }}>Hidden</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'contacts' && (
            <div className="table-container">
              <table className="resource-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <tr key={contact._id}>
                      <td style={{ fontWeight: 'bold' }}>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td style={{ maxWidth: '480px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{contact.message}</td>
                      <td>{new Date(contact.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminPage;