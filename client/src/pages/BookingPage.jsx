import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../api/serviceApi';
import { getSlots, createBooking } from '../api/bookingApi';
import Calendar from '../components/Calendar';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchService();
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots();
  }, [selectedDate]);

  const fetchService = async () => {
    try {
      const res = await getService(serviceId);
      setService(res.data.service);
    } catch (err) {
      setError('Service nahi mili.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await getSlots(serviceId, selectedDate);
      setSlots(res.data.slots);
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      setError('Pehle ek slot choose karo.');
      return;
    }
    setBooking(true);
    setError('');
    try {
      await createBooking({ slotId: selectedSlot, notes });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/customer'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setBooking(false);
    }
  };

  // Aaj ki date minimum set karo
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <p style={styles.loading}>Loading...</p>;

  if (success) {
    return (
      <div style={styles.successBox}>
        <h2>✅ Booking Successful!</h2>
        <p>Aapki appointment confirm ho gayi. Dashboard par ja rahe hain...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Service Info */}
      {service && (
        <div style={styles.serviceCard}>
          <span style={styles.category}>{service.category}</span>
          <h2 style={styles.serviceName}>{service.name}</h2>
          <p style={styles.serviceDesc}>{service.description}</p>
          <div style={styles.serviceDetails}>
            <span>⏱ {service.duration} min</span>
            <span>💰 ₹{service.price}</span>
            <span>👤 {service.provider?.name}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Date Picker
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Date Choose Karo</h3>
        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div> */}
      {/* Date Picker */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Date Choose Karo</h3>
          <Calendar
          selectedDate={selectedDate}
          onDateSelect={(date) => setSelectedDate(date)}
        />
      </div>

      {/* Slots */}
      {selectedDate && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🕐 Available Slots</h3>
          {slots.length === 0 ? (
            <p style={styles.noSlots}>
              Is date par koi slot available nahi hai.
            </p>
          ) : (
            <div style={styles.slotsGrid}>
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  style={
                    selectedSlot === slot._id
                      ? styles.slotActive
                      : styles.slotCard
                  }
                  onClick={() => setSelectedSlot(slot._id)}
                >
                  {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {selectedSlot && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📝 Notes (Optional)</h3>
          <textarea
            placeholder="Koi special request ya notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBook}
        disabled={booking || !selectedSlot}
        style={!selectedSlot || booking ? styles.btnDisabled : styles.btn}
      >
        {booking ? 'Booking...' : '✅ Confirm Booking'}
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '680px', margin: '0 auto', padding: '32px 16px' },
  loading: { textAlign: 'center', marginTop: '80px', fontSize: '18px', color: '#6B7280' },
  successBox: {
    textAlign: 'center', marginTop: '100px',
    padding: '40px', backgroundColor: '#ECFDF5',
    borderRadius: '16px', color: '#065F46',
  },
  serviceCard: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  category: {
    backgroundColor: '#EEF2FF', color: '#4F46E5',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold',
  },
  serviceName: { fontSize: '24px', color: '#1E1B4B', margin: '12px 0 8px' },
  serviceDesc: { color: '#6B7280', fontSize: '14px', marginBottom: '16px' },
  serviceDetails: { display: 'flex', gap: '20px', fontSize: '14px', color: '#374151' },
  error: {
    backgroundColor: '#FEE2E2', color: '#DC2626',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  section: { marginBottom: '28px' },
  sectionTitle: { fontSize: '18px', color: '#1E1B4B', marginBottom: '14px' },
  dateInput: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none',
  },
  noSlots: { color: '#6B7280', fontStyle: 'italic' },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
  },
  slotCard: {
    padding: '12px', borderRadius: '8px', border: '2px solid #E5E7EB',
    textAlign: 'center', cursor: 'pointer', fontSize: '14px',
    fontWeight: '600', color: '#374151',
  },
  slotActive: {
    padding: '12px', borderRadius: '8px', border: '2px solid #4F46E5',
    textAlign: 'center', cursor: 'pointer', fontSize: '14px',
    fontWeight: '600', color: '#4F46E5', backgroundColor: '#EEF2FF',
  },
  textarea: {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #D1D5DB', fontSize: '15px',
    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', backgroundColor: '#4F46E5', color: 'white',
    border: 'none', padding: '14px', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
  },
  btnDisabled: {
    width: '100%', backgroundColor: '#A5B4FC', color: 'white',
    border: 'none', padding: '14px', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed',
  },
};

export default BookingPage;