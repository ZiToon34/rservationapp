// src/components/Calendar.tsx
// Affiche un calendrier mensuel avec les jours ouverts/fermés.
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import dayjs from 'dayjs';
import type { CalendarData } from '../types';
import { generateMonthGrid, isDateOpen, todayParis, toIsoDate } from '../utils/date';

type CalendarProps = {
  month: dayjs.Dayjs;
  onMonthChange: (direction: 1 | -1) => void;
  selectedDate: dayjs.Dayjs | null;
  onSelectDate: (date: dayjs.Dayjs) => void;
  calendarData: CalendarData | null;
};

function Calendar({ month, onMonthChange, selectedDate, onSelectDate, calendarData }: CalendarProps) {
  const gridDays = generateMonthGrid(month);
  const today = todayParis();

  const isSelectable = (date: dayjs.Dayjs): boolean => {
    if (!calendarData) return false;
    if (date.isBefore(today, 'day')) return false;
    return isDateOpen(date, calendarData);
  };

  return (
    <Card aria-label="Calendrier de sélection de la date">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h5 mb-0">Choisissez une date</h2>
          <small>Mois : {month.format('MMMM YYYY')}</small>
        </div>
        <ButtonGroup aria-label="Navigation mois">
          <Button variant="outline-secondary" onClick={() => onMonthChange(-1)}>
            Mois précédent
          </Button>
          <Button variant="outline-secondary" onClick={() => onMonthChange(1)}>
            Mois suivant
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        <div className="calendar-grid" role="grid" aria-label="Jours du mois">
          {gridDays.map((date) => {
            const isCurrentMonth = date.month() === month.month();
            const selectable = isSelectable(date);
            const isSelected = selectedDate?.isSame(date, 'day');
            return (
              <div
                key={toIsoDate(date)}
                role="gridcell"
                aria-selected={isSelected}
                className={`calendar-day border ${!selectable ? 'calendar-day--disabled bg-light' : 'bg-white'} ${
                  !isCurrentMonth ? 'opacity-50' : ''
                } ${isSelected ? 'border-danger border-2' : ''}`}
              >
                <span className="fw-bold">{date.date()}</span>
                <small>{date.format('dd')}</small>
                <Button
                  variant={isSelected ? 'danger' : 'outline-danger'}
                  size="sm"
                  className="mt-auto"
                  onClick={() => selectable && onSelectDate(date)}
                  disabled={!selectable}
                  aria-disabled={!selectable}
                >
                  {selectable ? 'Sélectionner' : 'Fermé'}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="calendar-legend mt-3" aria-hidden="true">
          <span>
            <span className="badge bg-danger">&nbsp;</span> Jour ouvert
          </span>
          <span>
            <span className="badge bg-secondary">&nbsp;</span> Jour fermé ou passé
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Calendar;
