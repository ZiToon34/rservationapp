// src/pages/SettingsPage.tsx
// Permet de modifier les paramètres de capacité et les horaires d'ouverture.
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import {
  fetchSchedules,
  fetchSettings,
  updateSchedule,
  updateSettings,
} from '../services/api';
import type { Schedule, Settings } from '../types';

const DAY_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [settingsData, schedulesData] = await Promise.all([fetchSettings(), fetchSchedules()]);
        setSettings(settingsData);
        setSchedules(schedulesData);
      } catch (_error) {
        setError('Impossible de charger les paramètres.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setMessage('Paramètres enregistrés.');
      setError(undefined);
    } catch (_error) {
      setError('Échec de l\'enregistrement des paramètres.');
    }
  };

  const handleScheduleChange = (dayOfWeek: number, field: 'lunch' | 'dinner' | 'isOpen', value: unknown) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              [field]:
                field === 'isOpen'
                  ? value
                  : {
                      ...schedule[field],
                      ...(value as Record<string, string>),
                    },
            }
          : schedule,
      ),
    );
  };

  const handleSaveSchedule = async (schedule: Schedule) => {
    try {
      const updated = await updateSchedule(schedule.dayOfWeek, {
        lunch: schedule.lunch,
        dinner: schedule.dinner,
        isOpen: schedule.isOpen,
      });
      setSchedules((prev) =>
        prev.map((item) => (item.dayOfWeek === updated.dayOfWeek ? updated : item)),
      );
      setMessage(`Horaires enregistrés pour ${DAY_LABELS[schedule.dayOfWeek]}.`);
      setError(undefined);
    } catch (_error) {
      setError('Erreur lors de la sauvegarde des horaires.');
    }
  };

  if (loading || !settings) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Chargement…</span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <h2 className="h5 mb-0">Capacité et délais</h2>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-3">
          <Form.Group>
            <Form.Label>Mode de capacité</Form.Label>
            <Form.Select
              value={settings.capacityMode}
              onChange={(event) =>
                setSettings((prev) =>
                  prev ? { ...prev, capacityMode: event.target.value as Settings['capacityMode'] } : prev,
                )
              }
            >
              <option value="total">Capacité totale</option>
              <option value="tables">Gestion par tables</option>
            </Form.Select>
          </Form.Group>

          {settings.capacityMode === 'total' ? (
            <Form.Group>
              <Form.Label>Capacité totale (personnes)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={settings.totalCapacity ?? 0}
                onChange={(event) =>
                  setSettings((prev) =>
                    prev ? { ...prev, totalCapacity: Number.parseInt(event.target.value, 10) } : prev,
                  )
                }
              />
            </Form.Group>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Tables configurées</Form.Label>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            tables: [
                              ...prev.tables,
                              { tableNumber: prev.tables.length + 1, seats: 2 },
                            ],
                          }
                        : prev,
                    )
                  }
                >
                  Ajouter une table
                </Button>
              </div>
              <Table size="sm" bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Places</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {settings.tables.map((table, index) => (
                    <tr key={table.tableNumber}>
                      <td>
                        <Form.Control
                          type="number"
                          min={1}
                          value={table.tableNumber}
                          onChange={(event) =>
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tables: prev.tables.map((item, idx) =>
                                      idx === index
                                        ? { ...item, tableNumber: Number.parseInt(event.target.value, 10) }
                                        : item,
                                    ),
                                  }
                                : prev,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min={1}
                          value={table.seats}
                          onChange={(event) =>
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tables: prev.tables.map((item, idx) =>
                                      idx === index
                                        ? { ...item, seats: Number.parseInt(event.target.value, 10) }
                                        : item,
                                    ),
                                  }
                                : prev,
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tables: prev.tables.filter((_, idx) => idx !== index),
                                  }
                                : prev,
                            )
                          }
                        >
                          Retirer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <Row className="g-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Personnes max. par réservation</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={settings.maxPeoplePerReservation}
                  onChange={(event) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            maxPeoplePerReservation: Number.parseInt(event.target.value, 10),
                          }
                        : prev,
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Délai min (h)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={settings.reservationDelayMin}
                  onChange={(event) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            reservationDelayMin: Number.parseInt(event.target.value, 10),
                          }
                        : prev,
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Délai max (h)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={settings.reservationDelayMax}
                  onChange={(event) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            reservationDelayMax: Number.parseInt(event.target.value, 10),
                          }
                        : prev,
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-end">
          <Button variant="danger" onClick={handleSaveSettings}>
            Enregistrer les paramètres
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="h5 mb-0">Horaires hebdomadaires</h2>
          <small>Définissez les créneaux midi et soir pour chaque jour.</small>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-4">
          {schedules.map((schedule) => (
            <div key={schedule.dayOfWeek} className="border rounded p-3 bg-white shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 mb-0">{DAY_LABELS[schedule.dayOfWeek]}</h3>
                <Form.Check
                  type="switch"
                  id={`open-${schedule.dayOfWeek}`}
                  label={schedule.isOpen ? 'Ouvert' : 'Fermé'}
                  checked={schedule.isOpen}
                  onChange={(event) =>
                    handleScheduleChange(schedule.dayOfWeek, 'isOpen', event.target.checked)
                  }
                />
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <Card>
                    <Card.Header>Service midi</Card.Header>
                    <Card.Body className="d-flex gap-2">
                      <Form.Control
                        type="time"
                        value={schedule.lunch.start}
                        onChange={(event) =>
                          handleScheduleChange(schedule.dayOfWeek, 'lunch', {
                            start: event.target.value,
                          })
                        }
                      />
                      <span className="align-self-center">à</span>
                      <Form.Control
                        type="time"
                        value={schedule.lunch.end}
                        onChange={(event) =>
                          handleScheduleChange(schedule.dayOfWeek, 'lunch', {
                            end: event.target.value,
                          })
                        }
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>Service soir</Card.Header>
                    <Card.Body className="d-flex gap-2">
                      <Form.Control
                        type="time"
                        value={schedule.dinner.start}
                        onChange={(event) =>
                          handleScheduleChange(schedule.dayOfWeek, 'dinner', {
                            start: event.target.value,
                          })
                        }
                      />
                      <span className="align-self-center">à</span>
                      <Form.Control
                        type="time"
                        value={schedule.dinner.end}
                        onChange={(event) =>
                          handleScheduleChange(schedule.dayOfWeek, 'dinner', {
                            end: event.target.value,
                          })
                        }
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="text-end mt-3">
                <Button variant="outline-danger" onClick={() => handleSaveSchedule(schedule)}>
                  Enregistrer pour {DAY_LABELS[schedule.dayOfWeek]}
                </Button>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
}

export default SettingsPage;

