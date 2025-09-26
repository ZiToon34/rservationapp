// src/pages/SpecialDaysPage.tsx
// Gestion des jours spéciaux (ouverture/fermeture exceptionnelle).
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import {
  deleteSpecialDay,
  fetchSchedules,
  fetchSpecialDays,
  triggerManualPurge,
  upsertSpecialDay,
} from '../services/api';
import type { Schedule, SpecialDay } from '../types';
import { dayjs, generateMonthGrid, isDateOpenByDefault, overrideWithSpecialDay, toIsoDate, todayParis } from '../utils/date';

function SpecialDaysPage() {
  const [currentMonth, setCurrentMonth] = useState(() => todayParis());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  const monthRange = useMemo(() => ({
    from: currentMonth.startOf('month').format('YYYY-MM-DD'),
    to: currentMonth.endOf('month').format('YYYY-MM-DD'),
  }), [currentMonth]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [scheduleData, specialData] = await Promise.all([
          fetchSchedules(),
          fetchSpecialDays(monthRange),
        ]);
        setSchedules(scheduleData);
        setSpecialDays(specialData);
      } catch (_error) {
        setError('Impossible de charger les jours spéciaux.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [monthRange]);

  const grid = useMemo(() => generateMonthGrid(currentMonth), [currentMonth]);

  const toggleDate = (iso: string) => {
    setSelectedDates((prev) => {
      const clone = new Set(prev);
      if (clone.has(iso)) {
        clone.delete(iso);
      } else {
        clone.add(iso);
      }
      return clone;
    });
  };

  const applyStatusToSelection = async (isOpen: boolean) => {
    if (selectedDates.size === 0) {
      setError('Sélectionnez au moins un jour.');
      return;
    }
    try {
      setError(undefined);
      await Promise.all(
        Array.from(selectedDates).map((date) => upsertSpecialDay({ date, isOpen })),
      );
      const refreshed = await fetchSpecialDays(monthRange);
      setSpecialDays(refreshed);
      setSelectedDates(new Set());
      setMessage('Mise à jour effectuée.');
    } catch (_error) {
      setError('La mise à jour a échoué.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce jour spécial ?')) return;
    try {
      await deleteSpecialDay(id);
      const refreshed = await fetchSpecialDays(monthRange);
      setSpecialDays(refreshed);
    } catch (_error) {
      setError('Impossible de supprimer ce jour.');
    }
  };

  const handlePurge = async () => {
    if (!window.confirm('Lancer la purge manuelle des anciens enregistrements ?')) return;
    try {
      await triggerManualPurge();
      setMessage('Purge déclenchée avec succès.');
    } catch (_error) {
      setError('Erreur lors de la purge.');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 mb-0">Calendrier des ouvertures exceptionnelles</h2>
            <small>Mois affiché : {currentMonth.format('MMMM YYYY')}</small>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={() => setCurrentMonth((prev) => prev.subtract(1, 'month'))}>
              Mois précédent
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => setCurrentMonth((prev) => prev.add(1, 'month'))}>
              Mois suivant
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Chargement du calendrier…</span>
            </div>
          ) : (
            <div className="calendar-grid" role="grid" aria-label="Calendrier des jours spéciaux">
              {grid.map((date) => {
                const iso = toIsoDate(date);
                const isCurrentMonth = date.month() === currentMonth.month();
                const defaultOpen = isDateOpenByDefault(date, schedules);
                const override = overrideWithSpecialDay(date, specialDays);
                const finalStatus = override ?? defaultOpen;
                const isSelected = selectedDates.has(iso);
                return (
                  <div
                    key={iso}
                    role="gridcell"
                    aria-selected={isSelected}
                    className={`calendar-day border ${
                      isCurrentMonth ? 'bg-white' : 'bg-light'
                    } ${finalStatus ? 'border-success' : 'border-secondary'} ${isSelected ? 'border-3' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="fw-bold">{date.date()}</span>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDate(iso)}
                        aria-label={`Sélectionner le ${date.format('DD MMMM')}`}
                      />
                    </div>
                    <small>{date.format('ddd')}</small>
                    <span className={`badge ${finalStatus ? 'bg-success' : 'bg-secondary'} mt-auto`}>
                      {finalStatus ? 'Ouvert' : 'Fermé'}
                    </span>
                    {override !== null && <small>Spécial</small>}
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
        <Card.Footer className="d-flex gap-2">
          <Button variant="outline-success" onClick={() => applyStatusToSelection(true)}>
            Marquer ouvert
          </Button>
          <Button variant="outline-danger" onClick={() => applyStatusToSelection(false)}>
            Marquer fermé
          </Button>
          <Button variant="outline-dark" className="ms-auto" onClick={handlePurge}>
            Purge manuelle
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="h5 mb-0">Jours spéciaux existants</h2>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-2">
          {specialDays.length === 0 ? (
            <Alert variant="secondary">Aucun jour spécial pour ce mois.</Alert>
          ) : (
            specialDays.map((day) => (
              <div
                key={day._id}
                className="d-flex justify-content-between align-items-center border rounded p-2 bg-white"
              >
                <div>
                  <strong>{dayjs(day.date).format('dddd DD MMMM YYYY')}</strong>
                  <div>{day.isOpen ? 'Ouvert' : 'Fermé'}</div>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={() => handleDelete(day._id)}>
                  Supprimer
                </Button>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default SpecialDaysPage;
