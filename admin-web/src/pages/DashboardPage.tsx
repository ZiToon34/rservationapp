// src/pages/DashboardPage.tsx
// Tableau de bord listant les réservations et permettant des actions rapides.
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import {
  createAdminReservation,
  deleteReservation,
  fetchReservations,
  fetchSettings,
} from '../services/api';
import type { Reservation, ReservationForm, Settings } from '../types';

const EMPTY_FORM: ReservationForm = {
  date: dayjs().format('YYYY-MM-DD'),
  time: '12:00',
  name: '',
  phone: '',
  email: '',
  peopleCount: 2,
  comment: '',
};

function DashboardPage() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string>();

  const [formValues, setFormValues] = useState<ReservationForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();

  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (_error) {
        // On ignore ici mais on pourrait afficher un message spécifique
      }
    }
    void loadSettings();
  }, []);

  const maxSelectablePeople = useMemo(
    () => settings?.maxPeoplePerReservation ?? 12,
    [settings?.maxPeoplePerReservation],
  );

  const loadReservations = async (targetDate: string) => {
    try {
      setLoadingList(true);
      setListError(undefined);
      const data = await fetchReservations(targetDate);
      setReservations(data);
    } catch (_error) {
      setListError('Impossible de charger les réservations.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    void loadReservations(date);
  }, [date]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    setFormSuccess(undefined);

    if (formValues.peopleCount > maxSelectablePeople) {
      setFormError('Nombre de convives trop élevé pour les réservations en ligne.');
      return;
    }

    try {
      setIsSaving(true);
      await createAdminReservation(formValues);
      setFormSuccess('Réservation ajoutée.');
      setFormValues((prev) => ({ ...prev, name: '', phone: '', email: '', comment: '' }));
      void loadReservations(date);
    } catch (_error) {
      setFormError('Échec de la création. Vérifiez les données et la capacité.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Confirmer la suppression de la réservation ?');
    if (!confirmDelete) return;
    try {
      await deleteReservation(id);
      void loadReservations(date);
    } catch (_error) {
      alert('La suppression a échoué.');
    }
  };

  return (
    <Row className="g-4">
      <Col lg={7}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h5 mb-0">Réservations du jour</h2>
              <small>Sélectionnez une date pour rafraîchir la liste.</small>
            </div>
            <Form.Control
              type="date"
              style={{ maxWidth: '200px' }}
              value={date}
              onChange={(event) => {
                const newDate = event.target.value;
                setDate(newDate);
                setFormValues((prev) => ({ ...prev, date: newDate }));
              }}
            />
          </Card.Header>
          <Card.Body>
            {loadingList ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>Chargement des réservations…</span>
              </div>
            ) : listError ? (
              <Alert variant="danger">{listError}</Alert>
            ) : reservations.length === 0 ? (
              <Alert variant="secondary">Aucune réservation pour cette date.</Alert>
            ) : (
              <div className="table-responsive">
                <Table hover size="sm" className="align-middle">
                  <thead>
                    <tr>
                      <th>Heure</th>
                      <th>Nom</th>
                      <th>Contact</th>
                      <th>Pers.</th>
                      <th>Source</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>{reservation.time}</td>
                        <td>{reservation.name}</td>
                        <td>
                          <div>{reservation.phone}</div>
                          <small>{reservation.email}</small>
                        </td>
                        <td>{reservation.peopleCount}</td>
                        <td>{reservation.source === 'client' ? 'Client' : 'Admin'}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(reservation._id)}
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <Card as="form" onSubmit={handleCreate}>
          <Card.Header>
            <h2 className="h5 mb-0">Ajouter une réservation</h2>
          </Card.Header>
          <Card.Body className="d-flex flex-column gap-3">
            <Row className="g-2">
              <Col md={6}>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formValues.date}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, date: event.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTime">
                  <Form.Label>Heure</Form.Label>
                  <Form.Control
                    type="time"
                    value={formValues.time}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, time: event.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formName">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control
                value={formValues.name}
                onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nom client"
                required
              />
            </Form.Group>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    value={formValues.phone}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formValues.email}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group controlId="formPeople">
                  <Form.Label>Personnes</Form.Label>
                  <Form.Select
                    value={formValues.peopleCount}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        peopleCount: Number.parseInt(event.target.value, 10),
                      }))
                    }
                  >
                    {Array.from({ length: maxSelectablePeople }, (_, index) => index + 1).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formSource">
                  <Form.Label>Source</Form.Label>
                  <Form.Control value="Admin" readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formComment">
              <Form.Label>Commentaire</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formValues.comment}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, comment: event.target.value }))
                }
              />
            </Form.Group>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          </Card.Body>
          <Card.Footer className="text-end">
            <Button type="submit" variant="danger" disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : 'Ajouter'}
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

export default DashboardPage;
