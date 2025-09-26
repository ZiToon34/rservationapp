// src/pages/ConfirmationPage.tsx
// Page de confirmation affichée après une réservation réussie.
import { useEffect } from 'react';
import { Alert, Card, ListGroup } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type ConfirmationState = {
  id: string;
  date: string;
  time: string;
  peopleCount: number;
  name: string;
  email: string;
  phone: string;
  comment?: string;
};

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState | undefined;

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [navigate, state]);

  if (!state) {
    return <Alert variant="info">Redirection vers la page d'accueil…</Alert>;
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Header>
        <h1 className="h4 mb-0">Merci {state.name} !</h1>
        <small>Votre réservation est bien enregistrée.</small>
      </Card.Header>
      <Card.Body>
        <Alert variant="success" aria-live="polite">
          Un e-mail de confirmation vient de vous être envoyé.
        </Alert>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Date :</strong> {state.date}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Heure :</strong> {state.time}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Nombre de personnes :</strong> {state.peopleCount}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Contact :</strong> {state.email} / {state.phone}
          </ListGroup.Item>
          {state.comment && (
            <ListGroup.Item>
              <strong>Commentaire :</strong> {state.comment}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="text-end">
        <Link to="/" className="btn btn-danger">
          Retour à l'accueil
        </Link>
      </Card.Footer>
    </Card>
  );
}

export default ConfirmationPage;
