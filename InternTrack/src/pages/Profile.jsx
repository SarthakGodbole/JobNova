import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user?._id || user?.email) {
      const savedImage = localStorage.getItem(`profileImg_${user._id || user.email}`);
      if (savedImage) setProfileImage(savedImage);
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        if (user?._id || user?.email) {
          localStorage.setItem(`profileImg_${user._id || user.email}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="page-container loading">Loading profile...</div>;
  }

  const roleText = user.role === 'admin' ? 'Administrator' : 'Student';
  const joinedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown join date';

  return (
    <div className="page-container flex-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ 
          maxWidth: '500px', width: '100%', textAlign: 'center', 
          background: 'rgba(20, 25, 30, 0.65)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 210, 255, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div className="profile-banner" style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', opacity: 0.85 }}></div>
        
        <div style={{ padding: '0 2rem 2.5rem', position: 'relative', marginTop: '-60px' }}>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            style={{ position: 'relative', display: 'inline-block', marginBottom: '1.2rem' }}
          >
            <div style={{ 
              width: '120px', height: '120px', 
              borderRadius: '50%', 
              background: 'var(--panel-bg)',
              backgroundImage: profileImage ? `url(${profileImage})` : 'none', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '4px solid rgba(20, 25, 30, 0.95)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)'
            }}>
              {!profileImage && (user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U'))}
            </div>

            <label htmlFor="profile-upload" style={{ position: 'absolute', bottom: '4px', right: '4px', cursor: 'pointer' }}>
              <motion.div 
                whileHover={{ scale: 1.15, boxShadow: '0 0 15px rgba(0, 210, 255, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  border: '3px solid rgba(20, 25, 30, 0.95)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  transition: 'background 0.2s'
                }}
              >
                <CameraIcon />
              </motion.div>
              <input type="file" id="profile-upload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </motion.div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.2rem', color: '#ffffff', fontWeight: 700 }}>
            {user.name || 'System User'}
          </h2>
          <p style={{ color: 'var(--primary)', marginBottom: '2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem' }}>
            {roleText}
          </p>

          <div style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '1.5rem', 
            textAlign: 'left', padding: '1.5rem', 
            background: 'rgba(0,0,0,0.25)', 
            borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ flex: '1 1 45%', minWidth: '150px' }}>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Email</span>
               <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500, wordBreak: 'break-all' }}>{user.email}</span>
            </div>
            <div style={{ flex: '1 1 40%', minWidth: '120px' }}>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Joined On</span>
               <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500 }}>{joinedDate}</span>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <motion.button 
              className="btn-primary" 
              onClick={() => alert('Editing profile details is coming soon!')} 
              title="Edit Profile"
              whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0, 210, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600, borderRadius: '12px' }}
            >
              Edit Profile
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
