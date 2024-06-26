import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import your external CSS file

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleApi = () => {
    // Reset the error messages
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Email format is incorrect');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    console.log('Request payload:', {
      email: email,
      password: password,
    });

    axios
      .post('http://localhost:4000/api/v1/admin/signin', {
        email: email,
        password: password,
      })
      .then((response) => {
        // Handle the response if the request is successful
        console.log('Response:', response.data);

        if (response.status === 200) {
          // Check the role from the response data
          const userRole = response.data.data.role;

          // Redirect based on user role
          if (userRole === 'admin') {
            navigate('/AdminDashboard');
          } else if (userRole === 'user') {
            navigate('/UserDashboard');
          } else {
            console.error('Unknown role:', userRole);
          }

          console.log(response.data.data)
          localStorage.setItem('userDetails', JSON.stringify(response.data.data));
          localStorage.setItem('token', response.data.data.token);

        } else {
          setEmailError('Email or password is incorrect');
          console.error('Login failed:', response.data.message);
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
        if (error.response && error.response.status === 401) {
          // Incorrect password
          setPasswordError('Password is incorrect');
        } else {
          setEmailError('Email or password is incorrect');
        }
        console.error('Error:', error);
      });
  };

  return (
    <div className='parent-container'>
      <div className='login-container bg-slate-400'>
        <div className='mb-3'>
          <h1 className='display1'>Login</h1>
        </div>
        {emailError && <div className='error-message'>{emailError}</div>} {/* Display email error message */}
        {passwordError && <div className='error-message'>{passwordError}</div>} {/* Display password error message */}
        <div className='mb-3'>
          <label htmlFor='exampleInputEmail1' className='form-label'>
            Email address
          </label>
          <input
            type='email'
            value={email}
            onChange={handleEmail}
            className='form-control'
            id='exampleInputEmail1'
            aria-describedby='emailHelp'
          />
          <div id='emailHelp' className='form-text'>
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className='mb-3'>
          <label htmlFor='exampleInputPassword1' className='form-label'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={handlePassword}
            className='form-control'
            id='exampleInputPassword1'
          />
        </div>
        <div className='mb-3 form-check'>
          <input type='checkbox' className='form-check-input' id='exampleCheck1' />
          <label className='form-check-label' htmlFor='exampleCheck1'>
            Check me out
          </label>
        </div>
        <button type='submit' className='login-button' onClick={handleApi}>
          Login
        </button>
        <br />
      </div>
    </div>
  );
}
