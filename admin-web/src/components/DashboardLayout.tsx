// src/components/DashboardLayout.tsx
// Mise en page commune aux écrans authentifiés (menu, en-tête, déconnexion).
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardLayout() {
  const { adminEmail, logout } = useAuth();

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="sm" className="shadow">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            Panel Admin – Restaurant
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <span className="text-white me-3">{adminEmail}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={logout}>
              Déconnexion
            </button>
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="light" className="border-bottom">
        <Container>
          <Nav>
            <Nav.Link as={NavLink} to="/" end>
              Tableau de bord
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settings">
              Paramètres
            </Nav.Link>
            <Nav.Link as={NavLink} to="/special-days">
              Jours spéciaux
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="flex-grow-1 py-4">
        <Outlet />
      </Container>
      <footer className="bg-dark text-white text-center py-2">
        <small>Interface d'administration – Mon Restaurant</small>
      </footer>
    </div>
  );
}

export default DashboardLayout;
