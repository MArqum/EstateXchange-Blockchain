import React, { useState } from 'react';
import axios from 'axios';

const KycVerification = () => {
	const [idCardFront, setIdCardFront] = useState(null);
	const [idCardBack, setIdCardBack] = useState(null);
	const [propertyDocument, setPropertyDocument] = useState(null);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const handleIdCardFrontChange = (event) => {
		setIdCardFront(event.target.files[0]);
	};

	const handleIdCardBackChange = (event) => {
		setIdCardBack(event.target.files[0]);
	};

	const handlePropertyDocumentChange = (event) => {
		setPropertyDocument(event.target.files[0]);
	};
	const handleFileUpload = async () => {
		const formData = new FormData();
		formData.append('files', idCardFront);
		formData.append('files', idCardBack);
		formData.append('files', propertyDocument);

		const { data } = await axios.post(
			'http://localhost:4000/api/v1/admin/file/Upload',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return data;
	};

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent default form submission

		try {
			const res = await handleFileUpload();

			if (res.length < 3) {
				throw new Error('Unexpected response format');
			}

			const formData = new FormData();
			formData.append('frontIdCard', res?.data?.Locations[0]); // Front as 0 index
			formData.append('backIdCard', res?.data?.Locations[1]); // Back as 1 index

			formData.append('propertyDocuments', res?.data?.Locations[2]); // Property as array of strings

			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Token not found');
			}
			const response = await axios.post(
				'http://localhost:4000/api/v1/property/uploadKycDocuments',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`, // Include the token in the Authorization header
					},
				}
			);

			setIdCardFront(null);
			setIdCardBack(null);
			setPropertyDocument(null);
			setSuccessMessage(response.data.message);
			setError(null);
		} catch (error) {
			setError('Error uploading files: ' + error.message);
			setSuccessMessage(null);
		}
	};

	return (
		<div className='kyc-verification'>
			<h2>KYC Verification</h2>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>ID Card Front:</label>
					<input
						type='file'
						accept='image/*'
						onChange={handleIdCardFrontChange}
					/>
				</div>
				<div className='form-group'>
					<label>ID Card Back:</label>
					<input
						type='file'
						accept='image/*'
						onChange={handleIdCardBackChange}
					/>
				</div>
				<div className='form-group'>
					<label>Property Document:</label>
					<input
						type='file'
						accept='image/*'
						onChange={handlePropertyDocumentChange}
					/>
				</div>
				<button type='submit'>Submit</button>
			</form>
			{successMessage && <p className='success-message'>{successMessage}</p>}
			{error && <p className='error-message'>{error}</p>}
		</div>
	);
};

export default KycVerification;
