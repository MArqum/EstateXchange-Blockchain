import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = (e) => {
    emailjs
      .send(
        'service_xlc0ntg',
        'template_fblqo7n',
        formData,
        'v0hrowQnfBw4gKHgH'
      )
      .then(
        (result) => {
          console.log('Email sent successfully!', result.text);
        },
        (error) => {
          console.log('Error sending email:', error.text);
        }
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail();
    // Implement your logic to handle the form submission (e.g., send data to backend, display a success message)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-us-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;