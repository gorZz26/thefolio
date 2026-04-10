import React, { useState } from 'react';
import API from '../api/axios';
// Import images - ensure these are in src/assets/
import myAnimeLogo from '../assets/my-anime.png';
import goodreadsLogo from '../assets/good-reads.png';
import imdbLogo from '../assets/imdb.jpg';

function ContactPage() {
  // Step 4.2: State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Step 4.3: State for submission success
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Single handler for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents full page reload
    setError('');

    try {
      await API.post('/contact', formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '20px' }}>
          Contact & Resources
        </h2>

        <div className="contact-layout">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3>Thank you, {formData.name}!</h3>
              <p>Your message has been received. We will get back to you soon.</p>
              <button onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
                setError('');
              }} style={{ marginTop: '10px' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Name:</label>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />

              <label>Email:</label>
              <input 
                type="email" 
                name="email"
                placeholder="example@email.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />

              <label>Message:</label>
              <textarea 
                name="message"
                placeholder="How can we help you?" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              ></textarea>

              <button type="submit">Submit</button>
            </form>
          )}

          {error && (
            <div style={{ color: '#c53030', marginTop: '16px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="table-container">
            <table className="resource-table">
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th>Resource Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: 'center' }}>
                  <td>MyAnimeList</td>
                  <td>Anime and manga database</td>
                </tr>
                <tr style={{ textAlign: 'center' }}>
                  <td>Goodreads</td>
                  <td>Book reviews and recommendations</td>
                </tr>
                <tr style={{ textAlign: 'center' }}>
                  <td>IMDb</td>
                  <td>Film and series information</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="top3-section">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Explore More</h2>
        <div className="top3-grid">
          <ResourceItem 
            img={myAnimeLogo} 
            title="MyAnimeList" 
            desc="Discover anime and manga, track and read reviews from fans worldwide." 
            link="https://myanimelist.net" 
          />
          <ResourceItem 
            img={goodreadsLogo} 
            title="Goodreads" 
            desc="Explore books, track your reading, and connect with readers." 
            link="https://www.goodreads.com" 
          />
          <ResourceItem 
            img={imdbLogo} 
            title="IMDb" 
            desc="Check movie ratings, reviews, and discover information shows." 
            link="https://www.imdb.com" 
          />
        </div>
      </section>

      <section className="section-inner" style={{ textAlign: 'center', paddingBottom: '50px' }}>
        <h3 style={{ marginBottom: '20px', color: '#d63384' }}>Visit Our Office</h3>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.455243176161!2d120.334444!3d15.991667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTVCOTM2JzAwLjAiTiAxMjDCsDIwJzAzLjkiRQ!5e0!3m2!1sen!2sph!4v1615294321234!5m2!1sen!2sph" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </section>
    </main>
  );
}

function ResourceItem({ img, title, desc, link }) {
  return (
    <div className="top3-item">
      <img src={img} className="resource-icon" alt={title} />
      <h3>{title}</h3>
      <p>{desc}</p>
      <a href={link} target="_blank" rel="noreferrer" className="site-link">Visit Site</a>
    </div>
  );
}

export default ContactPage;