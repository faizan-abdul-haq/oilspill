import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

import '../styles/navbar.css';

function Navbar({ isAuth, setIsAuth, userRole, setUserRole }) {
  const [, , removeCookie] = useCookies(['session']);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      removeCookie('session');
      setIsAuth(false);
      setUserRole('');
      navigate('/login');  // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="NavBar">
      <ul>
        {/* Always show Home link */}
        
        {/* Show 'Detect' and 'About Us' links only if the user is not an admin */}
        {!isAuth || userRole !== "admin" ? (
          <>
            <li><Link className="LinkNav" to="/">Home</Link></li>
            <li><Link className="LinkNav" to="/about">About Us</Link></li>
            <li><Link className="LinkNav" to="/detect">Detect</Link></li>


          </>
        ) : null}

        {/* Show profile link if authenticated */}
        {isAuth && <li><Link className="LinkNav" to="/profile">Profile</Link></li>}
        
        {/* Show admin specific links if user is admin */}
        {userRole === "admin" && isAuth && (
          <>
            <li><Link className="LinkNav" to="/users">Manage Users</Link></li>
          </>
        )}

        {userRole !== "admin" && isAuth && (
          <>
            <li><Link className="LinkNav" to="/predictions">Past Predictions</Link></li>

          </>
        )}


      </ul>
      <div className="buttons">
        {isAuth ? (
          <button onClick={logOut}>Logout</button>
        ) : (
          <>
            <button><Link className="LinkButton LoginBtn" to="/login">LOGIN</Link></button>
            <button className="joinus"><Link className="LinkButton" to="/register">Join us</Link></button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
