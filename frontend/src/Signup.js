import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

function Signup() {
	const navigate = useNavigate();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
   {/* const [address2, setAddress2] = useState(''); */}
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
   

    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastName = (event) => {
        setLastName(event.target.value);
    };

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleAddress = (event) => {
        setAddress(event.target.value);
    };

 {/* const handleAddress2 = (event) => {
        setAddress2(event.target.value);
    }; */}

    const handleCity = (event) => {
        setCity(event.target.value);
    };

    const handleState = (event) => {
        setState(event.target.value);
    };

    const handleZip = (event) => {
        setZip(event.target.value);
    };

	
console.log('process.env.REACT_APP_API_URI ',process.env.REACT_APP_API_URI)
const handleApi = () => {
    console.log('Request payload:', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        address: address,
        city: city,
        state: state,
        zip: zip,
       
    });

		axios.post('http://localhost:4000/api/v1/user/created', {
			firstname: firstname,
			lastname: lastname,
			email: email,
			password: password,
			address: address,
			city: city,
			state: state,
			zip: zip,
			
		})
		.then(response => {
			// Handle the response if the request is successful
			console.log('Response:', response.data);
			if (response.status === 201) {
				navigate('/login');
			  } else {
				console.error('Registration failed:', response.data.message);
			  }
		})
		.catch(error => {
			// Handle errors if the request fails
			console.error('Error:', error);
		});
				// axios.post(`${process.env.REACT_APP_API_URI}/api/v1/user/created`, {
        //     name: name,
        //     lastname: lastname,
        //     email: email,
        //     password: password,
        //     adress: adress,
        //     adress2: adress2,
        //     city: city,
        //     state: state,
        //     zip: zip,
        //     check: check,
        // })

        //     .then(result => {
        //         console.log(result.data);
        //     })

        //     .catch(err => {
        //         console.log(err);
        //     });

			
    };

    return (
        <div className="signup-container">
            <div style={{ height: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <div>
                        <div>
                            <div style={{ width: '400px' }}>
                                <label className='form-label'> FirstName</label>
                                <input
                                    type='text'
                                    className={`form-control`}
                                    placeholder='First name'
                                    name='firstName'
                                    onChange={handleFirstName}
                                />
                            </div>
						<div style={{ width: '400px' }}>
							<label className='form-label'>LastName</label>
							<input
								type='text'
								className={`form-control`}
								placeholder='Last name'
								name='lastName'
								onChange={handleLastName}
							/>
						</div>
					</div>
					<div>
						<div style={{ width: '400px' }}>
							<label
								htmlFor='inputEmail4'
								className='form-label'>
								Email
							</label>
							<input
								type='email'
								className={`form-control`}
								id='inputEmail4'
								name='email'
								onChange={handleEmail}
							/>
						</div>

						<div style={{ width: '400px' }}>
							<label
								htmlFor='inputPassword4'
								className='form-label'>
								Password
							</label>
							<input
								type='password'
								className={`form-control`}
								id='inputPassword4'
								name='password'
								onChange={handlePassword}
							/>
							
						</div>
					</div>
					<div style={{ width: '400px' }}>
						<label
							htmlFor='inputAddress'
							className='form-label'>
							Address
						</label>
						<input
							type='text'
							className={`form-control`}
							id='inputAddress'
							placeholder='1234 Main St'
							name='address'
							onChange={handleAddress}
						/>
					</div>
				{/*	<div style={{ width: '400px' }}>
						<label
							htmlFor='inputAddress2'
							className='form-label'>
							Address 2
						</label>
						<input
							type='text'
							className='form-control'
							id='inputAddress2'
							placeholder='Apartment, studio, or floor'
							name='address2'
							onChange={handleAddress2}
						/>
				</div> */}
					<div>
						<div style={{ width: '400px' }}>
							<label
								htmlFor='inputCity'
								className='form-label'>
								City
							</label>
							<input
								type='text'
								className={`form-control `}
								id='inputCity'
								name='city'
								onChange={handleCity}
							/>
							
						</div>
						<div style={{ width: '400px' }}>
							<label
								htmlFor='inputState'
								className='form-label'>
								State
							</label>
							<select
								id='inputState'
								className={`form-select `}
								name='state'
								onChange={handleState}>
								<option
									value=''
									>
									Choose...
								</option>
								<option value='Punjab'>Punjab</option>
								<option value='Sindh'>Sindh</option>
								<option value='KPK'>KPK</option>
								<option value='Balochistan'>Balochistan</option>
							</select>
							
						</div>
					</div>
					<div style={{ width: '400px' }}>
						<label
							htmlFor='inputZip'
							className='form-label'>
							Zip
						</label>
						<input
							type='text'
							className='form-control'
							id='inputZip'
							placeholder=''
							name='zip'
							onChange={handleZip}
						/>
					</div>
					
                        <div className='col-12'>
                            <button type='submit'
                                onClick={handleApi}>
                                SignUp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;