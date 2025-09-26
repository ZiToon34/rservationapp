import { Container, Navbar } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConfirmationPage from './pages/ConfirmationPage';

// Composant principal avec la navigation entre pages.
function App() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="sm" className="shadow">
        <Container>
          <Navbar.Brand href="/">Réservations – Mon Restaurant</Navbar.Brand>
        </Container>
      </Navbar>
      <Container as="main" className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </Container>
      <footer className="bg-dark text-white text-center py-3">
        <small>© {new Date().getFullYear()} Mon Restaurant – Réservations en ligne</small>
      </footer>
    </div>
  );
}

export default App;
