// src/pages/HomePage.tsx
// Page principale de réservation côté client.
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from '../components/Calendar';
import TimeSlotSelector from '../components/TimeSlotSelector';
import { useAvailability } from '../hooks/useAvailability';
import { createReservation, fetchCalendar, fetchPublicSettings } from '../services/api';
import type { CalendarData, PublicSettings } from '../types';
import { formatDisplayDate, toIsoDate, todayParis } from '../utils/date';

const PHONE_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/;

function HomePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [initError, setInitError] = useState<string>();

  const [currentMonth, setCurrentMonth] = useState(() => todayParis());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();

  const ISODate = useMemo(() => (selectedDate ? toIsoDate(selectedDate) : null), [selectedDate]);
  const { slots, loading, error } = useAvailability(ISODate, peopleCount);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingInit(true);
        const [settingsData, calendarData] = await Promise.all([
          fetchPublicSettings(),
          fetchCalendar(),
        ]);
        setSettings(settingsData);
        setCalendar(calendarData);
      } catch (_error) {
        console.error(_error);
        setInitError("Impossible de charger les données initiales. Vérifiez votre connexion.");
      } finally {
        setLoadingInit(false);
      }
    }

    void loadInitialData();
  }, []);

  const maxPeople = settings?.maxPeoplePerReservation ?? 6;
  const isAboveMax = peopleCount > maxPeople;

  const handleMonthChange = (direction: 1 | -1) => {
    setCurrentMonth((prev) => prev.add(direction, 'month'));
  };

  const handleDateSelection = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSuccessMessage(undefined);
  };

  const resetMessages = () => {
    setFormError(undefined);
    setSuccessMessage(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (!selectedDate || !selectedTime) {
      setFormError('Choisissez une date et un créneau horaire.');
      return;
    }
    if (!customerName || !email || !phone) {
      setFormError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      setFormError('Le numéro de téléphone doit être français (+33 ou 0 suivi de 9 chiffres).');
      return;
    }
    if (isAboveMax) {
      setFormError('Au-dessus, merci de nous contacter par appel.');
      return;
    }

    try {
      setIsSubmitting(true);
      const reservationId = await createReservation({
        date: toIsoDate(selectedDate),
        time: selectedTime,
        peopleCount,
        name: customerName,
        email,
        phone,
        comment,
      });

      setSuccessMessage('Réservation confirmée ! Vous allez recevoir un e-mail.');
      navigate('/confirmation', {
        state: {
          id: reservationId,
          date: formatDisplayDate(selectedDate),
          time: selectedTime,
          peopleCount,
          name: customerName,
          email,
          phone,
          comment,
        },
      });
    } catch (_error) {
      console.error(_error);
      setFormError("La réservation n'a pas pu être enregistrée. Merci de réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInit) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status" aria-live="polite" />
        <span className="ms-2">Chargement de l'interface…</span>
      </div>
    );
  }

  if (initError || !settings || !calendar) {
    return <Alert variant="danger">{initError ?? 'Aucune donnée disponible pour le moment.'}</Alert>;
  }

  return (
    <Row className="g-4">
      <Col lg={6}>
        <Calendar
          month={currentMonth}
          onMonthChange={handleMonthChange}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelection}
          calendarData={calendar}
        />
      </Col>
      <Col lg={6}>
        <Card as="form" onSubmit={handleSubmit} aria-label="Formulaire de réservation">
          <Card.Header>
            <h2 className="h5 mb-0">Complétez votre réservation</h2>
            <small>
              Réservez entre {settings.reservationDelayMin} h et {settings.reservationDelayMax} h avant l'heure choisie.
            </small>
          </Card.Header>
          <Card.Body className="d-flex flex-column gap-3">
            {selectedDate ? (
              <Alert variant="info" aria-live="polite">
                Date sélectionnée : <strong>{formatDisplayDate(selectedDate)}</strong>
              </Alert>
            ) : (
              <Alert variant="secondary" aria-live="polite">
                Sélectionnez un jour ouvert pour afficher les horaires.
              </Alert>
            )}

            <div>
              <Form.Label htmlFor="peopleCount">Nombre de personnes *</Form.Label>
              <Form.Select
                id="peopleCount"
                value={peopleCount}
                onChange={(event) => {
                  resetMessages();
                  setPeopleCount(Number.parseInt(event.target.value, 10));
                  setSelectedTime(null);
                }}
                aria-describedby="peopleCountHelp"
              >
                {Array.from({ length: maxPeople }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? 'personne' : 'personnes'}
                  </option>
                ))}
                <option value={maxPeople + 1}>{maxPeople + 1}+</option>
              </Form.Select>
              <div id="peopleCountHelp" className="form-text">
                Maximum autorisé en ligne : {maxPeople} personnes.
              </div>
              {isAboveMax && (
                <Alert variant="warning" className="mt-2">
                  Au-dessus, merci de nous contacter par appel.
                </Alert>
              )}
            </div>

            <div>
              <Form.Label>Choisissez un horaire *</Form.Label>
              <TimeSlotSelector
                slots={slots}
                selectedTime={selectedTime}
                onSelect={(time) => {
                  resetMessages();
                  setSelectedTime(time);
                }}
                loading={loading}
                error={error}
                disabled={!selectedDate || isAboveMax}
              />
            </div>

            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="customerName">
                  <Form.Label>Nom complet *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex : Marie Dupont"
                    value={customerName}
                    onChange={(event) => {
                      resetMessages();
                      setCustomerName(event.target.value);
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="exemple@mail.com"
                    value={email}
                    onChange={(event) => {
                      resetMessages();
                      setEmail(event.target.value);
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="phone">
              <Form.Label>Téléphone *</Form.Label>
              <Form.Control
                type="tel"
                placeholder="06XXXXXXXX"
                value={phone}
                onChange={(event) => {
                  resetMessages();
                  setPhone(event.target.value);
                }}
                required
              />
            </Form.Group>

            <Form.Group controlId="comment">
              <Form.Label>Commentaire (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Allergies, demande spéciale…"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </Form.Group>

            {formError && (
              <Alert variant="danger" aria-live="assertive">
                {formError}
              </Alert>
            )}
            {successMessage && (
              <Alert variant="success" aria-live="polite">
                {successMessage}
              </Alert>
            )}
          </Card.Body>
          <Card.Footer className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={
                isSubmitting ||
                !selectedDate ||
                !selectedTime ||
                !customerName ||
                !email ||
                !phone ||
                isAboveMax
              }
            >
              {isSubmitting ? 'Envoi en cours…' : 'Réserver'}
            </button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

export default HomePage;
