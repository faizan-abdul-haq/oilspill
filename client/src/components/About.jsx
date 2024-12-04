import React from 'react';
// import teamMemberImage from '../images/img1.jpg'; // Replace with actual image path
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-us">
      <header className="about-header">
        <h1>About Us</h1>
        <p className="intro-text">We are a group of passionate individuals from the American University of Sharjah, dedicated to building a deep learning model for oil spill detection and mitigation.</p>
      </header>
      
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to leverage advanced AI and deep learning techniques to improve the detection and mitigation of oil spills, helping protect the environment and marine life.
        </p>
      </section>

      <section className="team">
        <h2>Meet the Team</h2>
        <div className="team-member-wrapper">
          <div className="team-member professor">
            { <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxhZOmw_MtUuvAH8QlwuH-ZCt7z2JSphilg&s" alt="Dr. Mohamad Daoud" /> }
            <h3>Dr. Mohamad Daoud</h3>
            <p>Professor of Computer Science and Engineering</p>
            <p>Expert in deep learning and AI, guiding the team with his vast experience in the field of computer science and engineering.</p>
          </div>
        </div>

        <div className="other-team-members">
          <div className="team-member">
            {/* <img src={teamMemberImage} alt="Mohamad Abousahyoun" /> */}
            <h3>Mohamad Abousahyoun</h3>
            <p>B.S. in Computer Science, Minor in Data Science</p>
            <p>Specializing in data science and machine learning, Mohamad plays a key role in developing the models used for spill detection.</p>
          </div>
          <div className="team-member">
            {/* <img src={teamMemberImage} alt="Aljawhara Alanazi" /> */}
            <h3>Aljawhara Alanazi</h3>
            <p>B.S. in Computer Science, Minor in Data Science</p>
            <p>With a keen eye for detail, Aljawhara focuses on model optimization and ensuring the system's efficiency.</p>
          </div>
          <div className="team-member">
            {/* <img src={teamMemberImage} alt="Khalid Alsaadat" /> */}
            <h3>Khalid Alsaadat</h3>
            <p>B.S. in Computer Science</p>
            <p>Khalid is responsible for implementing and integrating various deep learning algorithms to enhance the system's accuracy.</p>
          </div>
          <div className="team-member">
            {/* <img src={teamMemberImage} alt="Abdallah Lootah" /> */}
            <h3>Abdallah Lootah</h3>
            <p>B.S. in Computer Science</p>
            <p>Abdallah is involved in data preprocessing and feature extraction, ensuring the quality of input data for the models.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
