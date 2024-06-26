import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: 'black' , }}>
      <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="footer-text" style={{ color: 'white', width: '20%', fontSize: '15px', paddingTop: '10px' }}>
         <span style={{fontWeight:'bold'}}>EstateXchange</span>  is an innovative blockchain project redefining the real estate landscape. Our platform revolutionizes property transactions, enabling users to seamlessly buy, sell, and trade digital property tokens.
        </div>
        <div className="footer-links" style={{ left: '4%' }}>
        <ul style={{ textAlign: 'left' }}>
  <ul style={{ color: 'white', fontWeight:'bold'  }}>ESTATEXCHANGE</ul>
  <ul style={{ color: 'white' }}>ABOUT US</ul>
  <ul style={{ color: 'white' }}>ROADMAP</ul>
  <ul style={{ color: 'white' }}>CAREERS</ul>
</ul>
        </div>
        <div className="footer-links" style={{ left: '4%' , marginRight: '3%'}}>
          <ul style={{ textAlign: 'left' }}>
            <ul style={{ color: 'white',fontWeight:'bold'  }}>SUPPORT</ul>
            <ul style={{ color: 'white' }}>FAQ</ul>
            <ul style={{ color: 'white' }}>CONTACT</ul>
          </ul>
        </div>
        <div className="footer-links" style={{ left: '4%', marginRight: '4%' }}>
             <ul style={{ textAlign: 'left', listStyleType: 'none' }}>
        <li style={{ color: 'white' ,fontWeight:'bold' }}>FOLLOW US</li>
        <li style={{ color: 'white' }}>
          <FaInstagram /> INSTAGRAM
        </li>
        <li style={{ color: 'white' }}>
          <FaFacebook /> FACEBOOK
        </li>
        <li style={{ color: 'white' }}>
          <FaYoutube /> YOUTUBE
        </li>
      </ul>
        </div>
      </div>

      <div className="container">
        <p style={{color:'white', textAlign:'center'}}>&copy; 2023 ESTATEXCHANGE MARKETPLACE</p>
      </div>
    </footer>
  );
}

export default Footer;
