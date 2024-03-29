// Footer.js

import React from 'react';
import './Footer.css'; // Import the separate CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="copyright">
        &copy; {new Date().getFullYear()} Online Audio Format Converter
      </div>
    </footer>
  );
};

export default Footer;
