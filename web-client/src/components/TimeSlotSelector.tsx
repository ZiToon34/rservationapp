// src/components/TimeSlotSelector.tsx
// Liste les créneaux disponibles pour la date choisie.
import { Alert, Button, Spinner } from 'react-bootstrap';

type TimeSlotSelectorProps = {
  slots: string[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
  error?: string;
  disabled: boolean;
};

function TimeSlotSelector({ slots, selectedTime, onSelect, loading, error, disabled }: TimeSlotSelectorProps) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2" aria-live="polite">
        <Spinner animation="border" size="sm" />
        <span>Chargement des créneaux en cours…</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!slots.length) {
    return <Alert variant="warning">Aucun créneau disponible pour cette date.</Alert>;
  }

  return (
    <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Créneaux disponibles">
      {slots.map((slot) => (
        <Button
          key={slot}
          type="button"
          variant={selectedTime === slot ? 'danger' : 'outline-danger'}
          className="time-slot-button"
          onClick={() => onSelect(slot)}
          disabled={disabled}
          aria-pressed={selectedTime === slot}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
}

export default TimeSlotSelector;
