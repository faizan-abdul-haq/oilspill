import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { Link } from "react-router-dom";
import useSignIn from 'react-auth-kit';
import "../styles/login.css"
import { useNavigate } from "react-router-dom";

function Login({setAuth}) {
    // use states fo rthe inputs email, password AND the error
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // State to hold the user's role


    //event handler for login



    async function handleSubmit(event) {
      event.preventDefault(); // prevent default form submission
    
      try {
        // Post request to backend
        const response = await axios.post(
          "/login",
          { username, password },
          { withCredentials: true }
        );
    
        // Check if the response indicates success
        if (response.status === 200) {
          console.log("Login successful:", response.data);
          setAuth(true);
    
          // Assuming the user role is part of the response
          setUserRole(response.data.role); // Set the role received from the backend
    
          // Clear form and error state
          setEmail("");
          setPassword("");
          setError("");
          navigate("/profile"); // Redirect to profile or another page
        }
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          setError("Invalid username or password");
        } else {
          // No response received (e.g., network error)
          setError("Network error, please try again later.");
        }
        console.error("Login error:", error);
      }
    }
    
    

    return (
        <div className="login-container">
            <form action ="/login" method= "POST"className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="loginBtnContainer">
                <button  type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
                <button type="submit"><Link style={{ textDecoration: 'none', color: 'white' }} to ="/register">Sign Up</Link></button>
                </div>
             
                <div className="google-login">
                <p>Or login with</p>
                <a className="login-with-google-btn" href="http://localhost:5000/auth/google">
                    Sign in with Google
                </a>
               </div>
            </form>


      

          
        </div>
    );
}

export default Login;
