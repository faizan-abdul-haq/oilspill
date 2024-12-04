import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import About from "./components/About";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Profile from "./components/userProfile";
import Detect from "./components/Detect";
import axios from "axios";
import ViewPredictions from "./components/ViewPredictions";
// import PastPredictions from "./components/PastPredictions";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManageUsers from "./components/ManageUsers";

import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // State to hold the user's role

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("in use Affect")
        const authResponse = await axios.get('/api/auth/status');
        console.log("Auth response:", authResponse.data.isAuthenticated)
        setIsAuth(authResponse.data.isAuthenticated);
        
        // If authenticated, fetch the user role
        if (authResponse.data.isAuthenticated) {
          const roleResponse = await axios.get('/api/user-role');
          console.log(roleResponse.data.role)
          setUserRole(roleResponse.data.role);
        }
      } catch (error) {
        console.error('Error checking authentication status or fetching role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout isAuth={isAuth} setIsAuth={setIsAuth} userRole={userRole}  setUserRole ={setUserRole}>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuth={setIsAuth} setUserRole= {setUserRole} />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={isAuth ? <Profile userRole={userRole} /> : <Navigate to="/login" />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/predictions" element={<ViewPredictions />} />

          {/* <Route path="/predictions" element={<PastPredictions />} /> */}


        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
