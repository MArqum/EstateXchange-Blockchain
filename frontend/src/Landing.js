import React,{useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import the Link component
import background from './background';
import side from './side';

const Landing = () => {
  const navigate = useNavigate()
  useEffect(() => {
    // Check if the token is present in local storage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
let userInfo;

try {
  userInfo = JSON.parse(user);
} catch (error) {
  console.error('Error parsing user data:', error);
}

// Now you can safely check userInfo and its properties
if (userInfo && userInfo.role === 'admin') {
  navigate('/AdminDashboard');
} else if (userInfo && userInfo.role !== 'admin') {
  navigate('/UserDashboard');
} else {
  navigate('/');
}

   


  }, []);
  return (
    <div style={{ position: 'relative' }}>
      {/* Adjusted height for the background image */}
      <img src={background} alt="image" className="bg-overlay-black-90" style={{ width: '80%', height: '550px' }} />
      
      <img src={side} alt="side image" style={{ width: '17%', height: '65%', position: 'absolute', top: '2%', left: '81.5%', right: '2%' }} />
      <div style={{ background: '#00172D', height: '70%', width: '17%', position: 'absolute', top: '28%', left: '81.5%', right: '2%' }}>
        <div style={{ fontSize: '22px', color: 'white', marginTop: '12%', marginRight: '3%', marginLeft: '3%' }}>For the first time,
          investors around the globe can buy into Pakistan's real estate market through fully-compliant, fractional, tokenized ownership. Powered by blockchain
        </div>
      </div>
      {/* Use the Link component to navigate to the Marketplace page */}
      <Link to="/marketplace">
        <button
          style={{
            fontSize: '18px',
            position: 'absolute',
            top: '45%',
            left: '44%',
            transform: 'translate(-50%, -50%)',
            padding: '10px 20px',
            backgroundColor: '#00172D',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Go to Marketplace
        </button>
      </Link>
      {/* Add your home page content here */}
    </div>
  );
};

export default Landing;