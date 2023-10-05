import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Alert, Spinner, Image , Navbar, Nav, Container, Dropdown} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Fade } from  'react-reveal';
import axios from 'axios';

interface LogoutDropdownProps {
  email: string;
  onLogout: () => void;
  onDarkMode: string;
}

interface dataDiri {
  id: number;
  kontakName: string;
  kontakImg: string;
  kontakDesc: string;
}

interface CardSProps {
  id: number;
  kontakName: string;
  kontakImg: string;
  kontakDesc: string;
  onDelete: () => void;
  darkMode: string;
}

interface NavbarProps {
  darkMode: string;
  img: string;
  onDarkMode: React.ReactNode;
  userEmail:string;
  dropDown:string;
}

interface FootProps {
  darkMode: string;
}

const NaviBarElement = (props: NavbarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    localStorage.removeItem('userEmail'); // Hapus email dari localStorage jika diperlukan
    // Lakukan sesuatu untuk mengarahkan pengguna ke halaman login (misalnya dengan menggunakan React Router)
    window.location.href = '/login'; // Ganti dengan URL login yang sesuai
  };
  
  return (
    <div>
      <Navbar className={`${props.darkMode} shadow-lg`}>
        <Container>
          <Navbar.Brand href="/">
            <img
              src={props.img}
              // 
              width="30"
              height="30"
              className="d-inline-block align-top me-4"
            />
            <div className={`d-inline ${props.darkMode} fw-bold`}>HxH</div>
          </Navbar.Brand>
          <Nav className="me-auto">
            {/* Tambahkan item navigasi lainnya di sini */}
          </Nav>
          <LogoutDropdown email={props.userEmail} onLogout={handleLogout} onDarkMode={props.dropDown}/>
        </Container>
        {props.onDarkMode}
      </Navbar>
    </div>
  )
};

const LogoutDropdown: React.FC<LogoutDropdownProps> = ({ email, onLogout, onDarkMode }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className={`${onDarkMode} border-0`} id="dropdown-basic">
        {email}
      </Dropdown.Toggle>

      <Dropdown.Menu className={onDarkMode}>
        <Dropdown.Item  className={onDarkMode} onClick={onLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const ShowData = () => {
  const [data, setData] = useState<dataDiri[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<dataDiri[]>([]);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false); // State untuk menampilkan loading indicator
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('isDarkMode') === 'true'
  );
  const [userEmail, setUserEmail] = useState<string>('');

  const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Konfigurasi Axios dengan header Authorization yang berisi token
  const client = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Ganti URL Anda
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getToken()}` // Tambahkan token ke header
    }
  });
  // Mengambil data kontak dari server saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Lakukan sesuatu untuk mengambil email pengguna dari server atau localStorage.
    // Misalnya, jika Anda menyimpan email di localStorage dengan nama 'userEmail':
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Efek yang memicu pencarian saat searchTerm berubah
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
      setNoDataFound(false);
      setLoading(false);
      setShowSearchResult(false); // Sembunyikan hasil pencarian saat tidak ada kata kunci
    } else {
      setLoading(true);

      const timer = setTimeout(() => {
        filterData();
        setLoading(false);

        // Set showSearchResult true ketika hasil pencarian ditemukan
        setShowSearchResult(filteredData.length > 0);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchTerm, data]);


  // Fungsi untuk mengambil data kontak dari server
  async function fetchData() {
    try {
      console.log(client.defaults.headers)
      const response = await client.get('kontaks/');
      const data = response.data;
      console.log('Data dari server:', data);
      // Lakukan sesuatu dengan data yang diterima
      setData(data); // Atur data yang diterima ke state
    } catch (error) {
      console.error('Error fetching data:', error);
    }  
  }
  // Fungsi untuk menghapus data kontak berdasarkan ID
  async function deleteData(id: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kontaks/${id}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Item berhasil dihapus dari server, perbarui tampilan
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      } else {
        // Handle error jika diperlukan
        console.error('Error deleting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  // Fungsi untuk memfilter data berdasarkan kata kunci pencarian
  function filterData() {
    // Menggunakan data yang ada dan filter berdasarkan searchTerm
    const filtered = data.filter((item) =>
      item.kontakName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Set state noDataFound jika hasil pencarian kosong
    setNoDataFound(filtered.length === 0);

    setFilteredData(filtered);
  }

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>

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
        userEmail={userEmail} 
        dropDown={isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}
      />

      <Container>
        <h1 className={`text-center mt-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}>Hunter x Hunter Contact</h1>
        <Form.Control
          type='text'
          placeholder='Search username'
          onChange={(e) => setSearchTerm(e.target.value)}
          className='d-block mb-4'
          name='search'
        />
        <Link to='/add' className='btn btn-primary mt-2'>
          Add
        </Link>

        {noDataFound ? (
          <Alert variant='danger' className='mt-4'>
            Data not found
          </Alert>
        ) : null}

        {loading ? (
          <div className='text-center mt-4'>
            <Spinner animation='border' variant='primary' />
          </div>
        ) : null}

        {/* Render data pencarian dengan animasi */}
        <Row xs={1} md={3} className='g-4 mt-4'>
          {filteredData.map((item) => (
            <Col key={item.id}>
              <Fade bottom> {/* Animasi untuk hasil pencarian */}
                <CardS
                  id={item.id}
                  kontakName={item.kontakName}
                  kontakImg={item.kontakImg}
                  kontakDesc={item.kontakDesc}
                  onDelete={() => deleteData(item.id)}
                  darkMode={isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}
                />
              </Fade>
            </Col>
          ))}
        </Row>

        {/* Animasi untuk hasil pencarian */}
        <Fade bottom when={showSearchResult}>
          <div className='mt-4'>
            {filteredData.length === 0 && !loading && !noDataFound ? (
              <Alert variant='warning'>
                No results found for "{searchTerm}"
              </Alert>
            ) : null}
          </div>
        </Fade>
      </Container>
      <div>
        <Footer
          darkMode={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
        />
      </div>
    </div>
  );
};

const Footer = (props: FootProps) => {
  return (
    <footer className={` text-center py-3 ${props.darkMode} d-block`}>
      &copy; 2023 Your Website Name
    </footer>
  );
};

const CardS = (props: CardSProps) => {

  return (
    <div>
      <div className='custom-card text-center'>
        <Card className={`border-secondary ${props.darkMode}`}>
          <Card.Img variant="top" src={props.kontakImg} className='img' />
          <Card.Body>
            <Card.Title>{props.kontakName}</Card.Title>
            <Card.Text>
              {props.kontakDesc}
            </Card.Text>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <div>
              </div>
              <Col>
                <Link to={`/edit/${props.id}`} className="btn btn-warning me-2">Edit</Link>
                <Button onClick={props.onDelete} className='btn btn-danger'>Delete</Button>
              </Col>
            </Card.Footer>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export { ShowData, NaviBarElement, Footer };