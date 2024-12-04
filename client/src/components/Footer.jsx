import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer(props) {
    return (
        <footer className="footerContainer">
            <div className="footerSection">
                <h5>Company</h5>
                <ul>
                    <li><Link className="footerLink" to="/about">About Us</Link></li>
                    <li><Link className="footerLink" to="/privacy">Privacy Policy</Link></li>
                    <li><Link className="footerLink" to="/security">Security</Link></li>
                    <li><Link className="footerLink" to="/faq">FAQ</Link></li>
                    <li><Link className="footerLink" to="/cookies">Cookies</Link></li>
                </ul>
            </div>

            <div className="footerSocialMedia">
                <h5>Social Media</h5>
                <a href="#" className="socialIcon">Facebook</a>
                <a href="#" className="socialIcon">Twitter</a>
                <a href="#" className="socialIcon">Instagram</a>
            </div>

            <div className="footerCopyright">
                <p>Copyright @{new Date().getFullYear()} OilSpill. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
