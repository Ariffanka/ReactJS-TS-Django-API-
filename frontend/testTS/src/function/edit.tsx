import React, { useState, useEffect } from 'react';
import {NaviBarElement} from '../showD';
import { useParams, useNavigate } from 'react-router-dom'; // Menggunakan useNavigate
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Image } from 'react-bootstrap';

interface KontakData {
  kontakName: string;
  kontakImg: string;
  kontakDesc: string;
}

const EditData: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<KontakData>({
    kontakName: '',
    kontakImg: '',
    kontakDesc: '',
  });

  const navigate = useNavigate(); // Menggunakan useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kontaks/${id}/`, {
        method: 'GET',
      });
      const jsonData = await response.json();
      setFormData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kontaks/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success, e.g., navigate to the data listing page
        navigate('/'); // Menggunakan navigate untuk navigasi
      } else {
        // Handle error, e.g., display an error message
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div>
      <NaviBarElement />
      <Container>
        <h1 className='text-center mt-4'>Edit Data</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="kontakName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="kontakName"
              value={formData.kontakName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="kontakImg">
            <Image src={formData.kontakImg} className='rounded d-block w-50' />
            <Form.Label>Image URL:</Form.Label>
            <Form.Control
              type="text"
              name="kontakImg"
              value={formData.kontakImg}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="kontakDesc">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              name="kontakDesc"
              value={formData.kontakDesc}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditData;
