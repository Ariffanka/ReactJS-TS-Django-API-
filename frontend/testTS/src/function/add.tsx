import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Image } from 'react-bootstrap';
import {NaviBarElement, client} from '../showD';
import axios from 'axios';

const AddData = () => {
  const [formData, setFormData] = useState({
    kontakName: '',
    kontakImg: '',
    kontakDesc: '',
    kontakEmail: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const response = await fetch('http://127.0.0.1:8000/api/kontaks/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const response= await client.post('/kontaks', formData);
      const token= sessionStorage.getItem('token');
      const response= await axios.post('http://127.0.0.1:8000/api/kontaks/', formData, {
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      })

      if (response.status === 201) {
        window.location.href='/';
      } else {
        window.location.href='/add';
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('isDarkMode') === 'true'
  ); 
  useEffect(() => {
    localStorage.setItem('isDarkMode', 'true');
  }, [isDarkMode]);

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  } 

  const userEmail= localStorage.getItem('userEmail')
  console.log("email add: ", userEmail)

  return (
    <div>
     <NaviBarElement
        darkMode={isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}
        img={!isDarkMode ? 'https://wallpapers.com/images/hd/hunter-x-hunter-logo-mggpor0djod1etn4.jpg' : 'https://wallpapers.com/images/hd/hunter-x-hunter-logo-1r3u73itjw1ug0a0.jpg'}
        onDarkMode={isDarkMode ?
          <Button onClick={toggleDarkMode} className='bg-transparent border-0'>
            <Image src='../src/assets/img/sun.png' />
          </Button>
          :
          <Button onClick={toggleDarkMode} className='bg-transparent border-0'>
            <Image src='../src/assets/img/moon.png' />
          </Button>
        }
        userEmail={String(userEmail)} 
        dropDown={isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}
      />
      <Container>
        <h1 className='text-center mt-4'>Add Data</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="kontakName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="kontakName"
              value={formData.kontakName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="kontakImg">
            <Image src={formData.kontakImg} className='rounded d-block w-50' />
            <Form.Label>Image URL:</Form.Label>
            <Form.Control
              type="text"
              name="kontakImg"
              value={formData.kontakImg}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="kontakDesc">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              name="kontakDesc"
              value={formData.kontakDesc}
              onChange={handleTextareaChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddData;
