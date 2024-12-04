import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import countries from '../countries'; // Adjust the path as needed
import "../styles/signup.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const Signup= () => {
    const genders = ["Male","Female","Prefer not to say"];
    const [information, setInformation] = useState ({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmedPassword: '', // Corrected the typo
        country: '',
        city: '',
        phone: '',
        gender: '',
        organization: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/register", {
                firstName: information.firstName,
                lastName: information.lastName,
                email: information.email,
                password: information.password,
                confirmedPassword: information.confirmedPassword, // Corrected the typo
                country: information.country,
                city: information.city,
                phone: information.phone,
                organization: information.organization,
                gender: information.gender,
            });
            console.log("Registration successful:", response.data);
            window.location.href = "/";
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="SignUp-container">
            <form className="SignUp-form" onSubmit={handleSubmit}>
                <label className='signupLabel'>First Name</label>
                <input
                    className="SignUp-input"
                    type="text"
                    value={information.firstName}
                    onChange={(e) => setInformation({...information, firstName: e.target.value})} // Corrected the function call
                    placeholder="Enter your first name"
                    name="firstName"
                    required
                />

                <label className='signupLabel'>Last Name</label>
                <input
                    className="SignUp-input"
                    type="text"
                    value={information.lastName}
                    onChange={(e) => setInformation({...information, lastName: e.target.value})} // Corrected the function call
                    placeholder="Enter your last name"
                    name="lastName"
                    required
                />
                <label className='signupLabel'>Gender</label>
                <select
                    className="SignUp-input"
                    value={information.gender}
                    onChange={(e) => setInformation({...information, gender: e.target.value})} // Corrected the function call
                    name="gender"
                    required
                >
                    <option value="">Select Gender</option>
                    {genders.map((gender, index) => (
                        <option key={index} value={gender}>{gender}</option> // Corrected the value
                    ))}
                </select>


                <label className='signupLabel'>Email</label>
                <input
                    className="SignUp-input"
                    type="email"
                    value={information.email}
                    onChange={(e) => setInformation({...information, email: e.target.value})} // Corrected the function call
                    placeholder="Enter your email"
                    name="email"
                    required
                />

                <label className='signupLabel'>Password</label>
                <input
                    className="SignUp-input"
                    type="password"
                    value={information.password}
                    onChange={(e) => setInformation({...information, password: e.target.value})} // Corrected the function call
                    placeholder="Enter your password"
                    name="password"
                    required
                />

                <label className='signupLabel' >Confirm Password</label>
                <input
                    className="SignUp-input"
                    type="password"
                    value={information.confirmedPassword}
                    onChange={(e) => setInformation({...information, confirmedPassword: e.target.value})} // Corrected the function call
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    required
                />

                <label className='signupLabel'>Country</label>
                <select
                    className="SignUp-input"
                    value={information.country}
                    onChange={(e) => setInformation({...information, country: e.target.value})} // Corrected the function call
                    name="country"
                    required
                >
                    <option value="">Select your country</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option> // Corrected the value
                    ))}
                </select>
                           
             <label className='signupLabel'>City</label>
              <input
              className = "SignUp-input"
              type ="text"
              value ={information.city}
              onChange ={(e)=> setInformation({...information, city: e.target.value})}
              name ="city"
              required
              />
            <label className='signupLabel'>Phone</label>
            <PhoneInput
             country ='us'
             value ={information.phone}
             onChange ={(e)=> setInformation({...information, phone: e})}
             name ="city"
             required
            
            />

            <label className='signupLabel'>Company/Organization</label>
              <input
              className = "SignUp-input"
              type ="text"
              value ={information.organization}
              onChange ={(e)=> setInformation({...information, organization: e.target.value})}
              name ="organization"
              required
              />

      

                <div className="Button-div">
                     <button type="submit">Create Account</button>
                     <button to = "/login">login</button>  
                </div>
            </form>
        </div>
    );
};

export default Signup;
