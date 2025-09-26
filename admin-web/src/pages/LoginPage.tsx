// src/pages/LoginPage.tsx
// Formulaire de connexion pour accéder au tableau de bord.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, token, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  if (token && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    if (!email || !password) {
      setError('Merci de saisir votre e-mail et votre mot de passe.');
      return;
    }
    try {
      setSubmitting(true);
      await login(email, password);
    } catch (_error) {
      setError('Identifiants invalides. Vérifiez vos informations.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ minWidth: '360px' }}>
        <Card.Header>
          <h1 className="h4 mb-0">Connexion administrateur</h1>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="admin@restaurant.fr"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="danger" disabled={submitting}>
              {submitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;
