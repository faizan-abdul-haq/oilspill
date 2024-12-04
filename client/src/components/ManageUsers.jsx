import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/manage.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch users data
    axios.get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (userId) => {
    axios.delete(`/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    axios.put(`/api/users/${editingUser.id}`, editingUser)
      .then(() => {
        setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
        setIsEditing(false);
        setEditingUser(null);
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter(user =>
    `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchTerm} 
        onChange={handleSearch} 
        className="search-input"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              {isEditing && editingUser?.id === user.id ? (
                <>
                  <td><input type="text" name="fname" value={editingUser.fname} onChange={handleChange} /></td>
                  <td><input type="text" name="lname" value={editingUser.lname} onChange={handleChange} /></td>
                  <td><input type="email" name="email" value={editingUser.email} onChange={handleChange} /></td>
                  <td><input type="text" name="city" value={editingUser.city} onChange={handleChange} /></td>
                  <td><input type="text" name="country" value={editingUser.country} onChange={handleChange} /></td>
                  <td>
                    <button onClick={handleSave} className="save-btn">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.fname}</td>
                  <td>{user.lname}</td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{user.country}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
