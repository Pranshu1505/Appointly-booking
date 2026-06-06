import { useState } from 'react';

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month ka naam
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  // Pehle din kaun sa hai (0=Sun, 1=Mon...)
  const firstDay = new Date(year, month, 1).getDay();

  // Is month mein kitne din hain
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Previous month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Date click handler
  const handleDateClick = (day) => {
    const clicked = new Date(year, month, day);
    clicked.setHours(0, 0, 0, 0);

    // Past dates disable
    if (clicked < today) return;

    // YYYY-MM-DD format
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(formatted);
  };

  // Check — kya yeh date selected hai?
  const isSelected = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return formatted === selectedDate;
  };

  // Check — kya yeh date past hai?
  const isPast = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check — kya aaj hai?
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Empty boxes pehle (pehle din se pehle)
  const emptyBoxes = Array(firstDay).fill(null);

  // Days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div style={styles.container}>

      {/* Header — Month Navigation */}
      <div style={styles.header}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <h3 style={styles.monthTitle}>
          {monthNames[month]} {year}
        </h3>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      {/* Day Names */}
      <div style={styles.dayNames}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={styles.dayName}>{d}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div style={styles.grid}>
        {/* Empty boxes */}
        {emptyBoxes.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day boxes */}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDateClick(day)}
            style={{
              ...styles.dayBox,
              ...(isSelected(day) ? styles.selected : {}),
              ...(isToday(day) && !isSelected(day) ? styles.todayBox : {}),
              ...(isPast(day) ? styles.past : {}),
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Selected Date Show */}
      {selectedDate && (
        <div style={styles.selectedInfo}>
          📅 Selected: <strong>{selectedDate}</strong>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    maxWidth: '380px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  navBtn: {
    backgroundColor: '#EEF2FF',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: '16px',
    color: '#1E1B4B',
    margin: 0,
    fontWeight: 'bold',
  },
  dayNames: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },
  dayName: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    padding: '4px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  dayBox: {
    textAlign: 'center',
    padding: '8px 4px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#374151',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  selected: {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
  },
  todayBox: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  past: {
    color: '#D1D5DB',
    cursor: 'not-allowed',
  },
  selectedInfo: {
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#EEF2FF',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#4F46E5',
    textAlign: 'center',
  },
};

export default Calendar;