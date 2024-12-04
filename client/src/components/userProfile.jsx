import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userProfile.css';

function UserProfile() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    organization: '',
    location: '',
    profilePic: '', // default picture
  });

  useEffect(() => {
    // Fetch user profile data from the server
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/profile', { withCredentials: true });
        const defaultPic = response.data.gender === 'Male'
          ? 'https://static.vecteezy.com/system/resources/previews/032/176/197/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg'
          : 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/woman-user-circle-icon.png'
        setUser((prevUser) => ({
          ...prevUser,
          ...response.data,
          profilePic: response.data.profilePic || defaultPic,
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-info">
          <h1>Welcome {`${user.fname} ${user.lname}`}!</h1>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="file-input"
          />
        </div>
      </div>
      <div className="user-info">
        <h2>User Info</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Organization:</strong> {user.organization}</p>
        <p><strong>Location:</strong> {user.city} {user.country}</p>
      </div>
    </div>
  );
}

export default UserProfile;
