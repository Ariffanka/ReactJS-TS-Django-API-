import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// axios.defaults.xsrfCookieName= 'sessionid';
axios.defaults.xsrfCookieName= 'csrftoken';
axios.defaults.xsrfHeaderName= 'X-CSRFToken';
axios.defaults.withCredentials= true;

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [currentUser, setCurrentUser]= useState<boolean>();

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(()=>{
    axios.get('https://127.0.0.1:8000/api/users')
    .then(function(res){
      setCurrentUser(true);
      console.log('res',res);
    }).catch(function(error){
      setCurrentUser(false)
      console.log('error: ', error);
    });
  }, [])

  console.log("currentUser: ",currentUser)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Periksa ketidaksesuaian kata sandi setiap kali input berubah
    if (name === 'password' || name === 'confirmPassword') {
      if (formData.password == formData.confirmPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
        email: formData.email,
        password: formData.password,
      });
  
      if (response.status === 200 && response.data.token) {
        // Token diterima, simpan di localStorage atau cookie
        sessionStorage.setItem('token', response.data.token);

        //add email
        sessionStorage.setItem('userEmail', formData.email);

  
        // Alihkan pengguna ke halaman yang sesuai
        window.location.href = '/'; // Ganti dengan URL yang sesuai
      } else {
        console.error('Gagal melakukan login');
      }
    } catch (error) {
      console.error('Gagal melakukan login:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4">Login</h2>
          <Form onSubmit={handleSubmit} method='POST'>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {passwordMismatch && (
              <Alert variant="danger">Password confirmation does not match.</Alert>
            )}

            {formData.password==formData.confirmPassword ?  <Button variant="primary" type="submit" disabled={passwordMismatch}>
              Login
            </Button>
            :
            <Button variant="primary" type="submit" disabled>
            Login
          </Button>}
           
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
