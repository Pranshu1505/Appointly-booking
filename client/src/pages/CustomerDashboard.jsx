import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, updateBookingStatus } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending:   { bg: '#FEF9C3', color: '#854D0E' },
  confirmed: { bg: '#DCFCE7', color: '#166534' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  completed: { bg: '#DBEAFE', color: '#1E40AF' },
};

const statusEmoji = {
  pending:   '⏳',
  confirmed: '✅',
  cancelled: '❌',
  completed: '🎉',
};

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings(filter);
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Bookings load nahi hui.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Kya aap yeh booking cancel karna chahte hain?')) return;
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed.');
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>👤 My Bookings</h2>
          <p style={styles.subtitle}>Namaste {user?.name}! Yahan apni saari bookings dekho.</p>
        </div>
        <button
          style={styles.newBtn}
          onClick={() => navigate('/')}
        >
          + New Booking
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            style={filter === status ? styles.tabActive : styles.tab}
            onClick={() => setFilter(status)}
          >
            {status === '' ? 'All' : statusEmoji[status] + ' ' + status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Bookings List */}
      {loading ? (
        <p style={styles.loading}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Koi booking nahi mili.</p>
          <button style={styles.newBtn} onClick={() => navigate('/')}>
            Abhi Book Karo
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.card}>

              {/* Card Top */}
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.serviceName}>{booking.service?.name}</h3>
                  <p style={styles.providerName}>👤 {booking.provider?.name}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: statusColors[booking.status]?.bg,
                  color: statusColors[booking.status]?.color,
                }}>
                  {statusEmoji[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Card Details */}
              <div style={styles.details}>
                <span>📅 {booking.date}</span>
                <span>🕐 {booking.startTime} - {booking.endTime}</span>
                <span>💰 ₹{booking.service?.price}</span>
                <span>⏱ {booking.service?.duration} min</span>
              </div>

              {/* Notes */}
              {booking.notes && (
                <p style={styles.notes}>📝 {booking.notes}</p>
              )}

              {/* Cancel Button */}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <button
                  style={styles.cancelBtn}
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
  },
  title: { fontSize: '26px', color: '#1E1B4B', marginBottom: '4px' },
  subtitle: { color: '#6B7280', fontSize: '14px' },
  newBtn: {
    backgroundColor: '#4F46E5', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '14px',
  },
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  tab: {
    padding: '8px 16px', borderRadius: '20px', border: '1px solid #E5E7EB',
    backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', color: '#6B7280',
  },
  tabActive: {
    padding: '8px 16px', borderRadius: '20px', border: 'none',
    backgroundColor: '#4F46E5', cursor: 'pointer', fontSize: '13px',
    color: 'white', fontWeight: 'bold',
  },
  error: {
    backgroundColor: '#FEE2E2', color: '#DC2626',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
  },
  loading: { textAlign: 'center', color: '#6B7280', marginTop: '60px', fontSize: '16px' },
  emptyBox: { textAlign: 'center', marginTop: '60px' },
  emptyText: { color: '#6B7280', fontSize: '16px', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex',
    flexDirection: 'column', gap: '12px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceName: { fontSize: '18px', color: '#1E1B4B', margin: 0 },
  providerName: { fontSize: '13px', color: '#6B7280', margin: '4px 0 0' },
  badge: {
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
  },
  details: {
    display: 'flex', gap: '16px', flexWrap: 'wrap',
    fontSize: '14px', color: '#374151',
  },
  notes: { fontSize: '13px', color: '#6B7280', margin: 0 },
  cancelBtn: {
    backgroundColor: 'white', color: '#DC2626',
    border: '1px solid #DC2626', padding: '8px 16px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    fontWeight: 'bold', alignSelf: 'flex-start',
  },
};

export default CustomerDashboard;