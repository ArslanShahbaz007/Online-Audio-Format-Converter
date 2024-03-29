import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { SiConvertio } from "react-icons/si";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import './NavbarStyles.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 769px)");
    
    function handleScreenWidthChange(mq) {
      if (mq.matches) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }

    handleScreenWidthChange(mq);

    const handleMediaQueryChange = event => {
      handleScreenWidthChange(event.target);
    };

    mq.addEventListener('change', handleMediaQueryChange);

    return () => {
      mq.removeEventListener('change', handleMediaQueryChange);
    };
  }, []); 

  const toggleIcon = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav>
        <NavLink to='/' style={{display:'flex', alignItems:'center',margin:'4px'}}><SiConvertio color='white' size={38}  /><p style={{marginLeft:'10px', fontSize:'1.1rem', fontWeight:'600'}}>Audio Format Converter</p></NavLink>
        
        <div>
          {isOpen ?
          <ul id='navitems'>
            <li><NavLink to='/' className='items'>Home</NavLink></li>
            <li><NavLink to='/about' className='items'>About Us</NavLink></li>
          </ul> : ''}
        </div>
        <div id="mobile">
          {isOpen ? <IoClose className='icon' size={24} onClick={toggleIcon} /> : <FaBars className='icon' size={24} onClick={toggleIcon} />}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
