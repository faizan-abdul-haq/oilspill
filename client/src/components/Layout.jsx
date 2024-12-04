import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Layout.css';

function Layout({ isAuth, setIsAuth, userRole, setUserRole, children }) {
  return (
    <div className="layout">
      <video autoPlay muted loop className="background-video">
        <source src="/videos/4911815-uhd_4096_2160_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Navbar
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
