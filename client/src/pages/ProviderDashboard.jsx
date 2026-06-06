import { useState, useEffect } from 'react';
import { getProviderBookings, updateBookingStatus, getStats } from '../api/bookingApi';
import { getServices, createService, deleteService } from '../api/serviceApi';
import { createBulkSlots } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending:   { bg: '#FEF9C3', color: '#854D0E' },
  confirmed: { bg: '#DCFCE7', color: '#166534' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  completed: { bg: '#DBEAFE', color: '#1E40AF' },
};

const ProviderDashboard = () => {
  const { user } = useAuth();

  // Active tab
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('');
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState(null);

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // New Service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '', description: '', duration: '', price: '', category: '',
  });

  // Slots form
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState({
    serviceId: '', date: '', startTime: '', endTime: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (activeTab === 'services') fetchServices();
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [bookingFilter]);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await getProviderBookings({ status: bookingFilter });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await getServices({ provider: user._id });
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      fetchBookings();
      fetchStats();
      setSuccess(`Booking ${status} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleCreateService = async () => {
    try {
      await createService({
        ...serviceForm,
        duration: Number(serviceForm.duration),
        price: Number(serviceForm.price),
      });
      setShowServiceForm(false);
      setServiceForm({ name: '', description: '', duration: '', price: '', category: '' });
      fetchServices();
      setSuccess('Service create ho gayi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Service create failed.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Service delete karna chahte hain?')) return;
    try {
      await deleteService(id);
      fetchServices();
      setSuccess('Service delete ho gayi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleCreateSlots = async () => {
    try {
      const slots = [];
      let [startH, startM] = slotForm.startTime.split(':').map(Number);
      const [endH, endM] = slotForm.endTime.split(':').map(Number);
      const serviceDuration = services.find(
        (s) => s._id === slotForm.serviceId
      )?.duration || 30;

      // Auto generate slots between start and end time
      while (startH * 60 + startM + serviceDuration <= endH * 60 + endM) {
        const slotStart = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
        startM += serviceDuration;
        startH += Math.floor(startM / 60);
        startM = startM % 60;
        const slotEnd = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }

      await createBulkSlots({
        serviceId: slotForm.serviceId,
        date: slotForm.date,
        slots,
      });

      setShowSlotForm(false);
      setSlotForm({ serviceId: '', date: '', startTime: '', endTime: '' });
      setSuccess(`${slots.length} slots create ho gaye!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Slots create failed.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🏢 Provider Dashboard</h2>
          <p style={styles.subtitle}>Namaste {user?.name}! Apni services aur bookings manage karo.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={styles.statsGrid}>
          {[
            { label: 'Total', value: stats.total, color: '#4F46E5', bg: '#EEF2FF' },
            { label: 'Pending', value: stats.pending, color: '#854D0E', bg: '#FEF9C3' },
            { label: 'Confirmed', value: stats.confirmed, color: '#166534', bg: '#DCFCE7' },
            { label: 'Completed', value: stats.completed, color: '#1E40AF', bg: '#DBEAFE' },
            { label: 'Cancelled', value: stats.cancelled, color: '#991B1B', bg: '#FEE2E2' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, backgroundColor: stat.bg }}>
              <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              <p style={{ ...styles.statLabel, color: stat.color }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Success / Error */}
      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'bookings' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Bookings
        </button>
        <button
          style={activeTab === 'services' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('services')}
        >
          🛠 Services
        </button>
        <button
          style={activeTab === 'slots' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('slots')}
        >
          🕐 Add Slots
        </button>
      </div>

      {/* ─── TAB 1: BOOKINGS ─── */}
      {activeTab === 'bookings' && (
        <div>
          {/* Status Filter */}
          <div style={styles.filterRow}>
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                style={bookingFilter === s ? styles.filterActive : styles.filterBtn}
                onClick={() => setBookingFilter(s)}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {bookingsLoading ? (
            <p style={styles.loading}>Loading...</p>
          ) : bookings.length === 0 ? (
            <p style={styles.loading}>Koi booking nahi mili.</p>
          ) : (
            <div style={styles.list}>
              {bookings.map((booking) => (
                <div key={booking._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.cardTitle}>{booking.service?.name}</h3>
                      <p style={styles.cardSub}>
                        👤 {booking.customer?.name} • {booking.customer?.phone || booking.customer?.email}
                      </p>
                    </div>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusColors[booking.status]?.bg,
                      color: statusColors[booking.status]?.color,
                    }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div style={styles.cardDetails}>
                    <span>📅 {booking.date}</span>
                    <span>🕐 {booking.startTime} - {booking.endTime}</span>
                    <span>💰 ₹{booking.service?.price}</span>
                  </div>

                  {booking.notes && (
                    <p style={styles.notes}>📝 {booking.notes}</p>
                  )}

                  {/* Action Buttons */}
                  <div style={styles.actionRow}>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          style={styles.confirmBtn}
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                        >
                          ✅ Confirm
                        </button>
                        <button
                          style={styles.cancelBtn}
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          style={styles.confirmBtn}
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        >
                          🎉 Mark Complete
                        </button>
                        <button
                          style={styles.cancelBtn}
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: SERVICES ─── */}
      {activeTab === 'services' && (
        <div>
          <button
            style={styles.addBtn}
            onClick={() => setShowServiceForm(!showServiceForm)}
          >
            {showServiceForm ? '✕ Cancel' : '+ New Service'}
          </button>

          {/* New Service Form */}
          {showServiceForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>New Service</h3>
              <div style={styles.formGrid}>
                {[
                  { name: 'name', placeholder: 'Service name', type: 'text' },
                  { name: 'category', placeholder: 'Category (e.g. Health)', type: 'text' },
                  { name: 'duration', placeholder: 'Duration (minutes)', type: 'number' },
                  { name: 'price', placeholder: 'Price (₹)', type: 'number' },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={serviceForm[field.name]}
                    onChange={(e) => setServiceForm({ ...serviceForm, [field.name]: e.target.value })}
                    style={styles.input}
                  />
                ))}
              </div>
              <textarea
                placeholder="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                style={styles.textarea}
                rows={3}
              />
              <button style={styles.confirmBtn} onClick={handleCreateService}>
                ✅ Create Service
              </button>
            </div>
          )}

          {/* Services List */}
          {servicesLoading ? (
            <p style={styles.loading}>Loading...</p>
          ) : services.length === 0 ? (
            <p style={styles.loading}>Koi service nahi hai. Pehli service banao!</p>
          ) : (
            <div style={styles.list}>
              {services.map((service) => (
                <div key={service._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.cardTitle}>{service.name}</h3>
                      <p style={styles.cardSub}>{service.category}</p>
                    </div>
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleDeleteService(service._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                  <div style={styles.cardDetails}>
                    <span>⏱ {service.duration} min</span>
                    <span>💰 ₹{service.price}</span>
                    <span>{service.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: ADD SLOTS ─── */}
      {activeTab === 'slots' && (
        <div>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>🕐 Slots Generate Karo</h3>
            <p style={styles.formHint}>
              Start aur end time do — slots automatically service duration ke hisaab se ban jayenge!
            </p>

            {/* Service Select */}
            <div style={styles.field}>
              <label style={styles.label}>Service Choose Karo</label>
              <select
                value={slotForm.serviceId}
                onChange={(e) => setSlotForm({ ...slotForm, serviceId: e.target.value })}
                style={styles.input}
                onClick={() => { if (services.length === 0) fetchServices(); }}
              >
                <option value="">-- Service Select Karo --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.duration} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div style={styles.field}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                min={today}
                value={slotForm.date}
                onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Time Range */}
            <div style={styles.timeRow}>
              <div style={styles.field}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  value={slotForm.endTime}
                  onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              style={
                !slotForm.serviceId || !slotForm.date || !slotForm.startTime || !slotForm.endTime
                  ? styles.btnDisabled
                  : styles.confirmBtn
              }
              disabled={!slotForm.serviceId || !slotForm.date || !slotForm.startTime || !slotForm.endTime}
              onClick={handleCreateSlots}
            >
              ⚡ Generate Slots
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '26px', color: '#1E1B4B', marginBottom: '4px' },
  subtitle: { color: '#6B7280', fontSize: '14px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    padding: '20px', borderRadius: '12px',
    textAlign: 'center',
  },
  statValue: { fontSize: '32px', fontWeight: 'bold', margin: 0 },
  statLabel: { fontSize: '13px', fontWeight: '600', margin: '4px 0 0' },
  success: {
    backgroundColor: '#DCFCE7', color: '#166534',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  error: {
    backgroundColor: '#FEE2E2', color: '#DC2626',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E7EB',
    backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', color: '#6B7280',
  },
  tabActive: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    backgroundColor: '#4F46E5', cursor: 'pointer', fontSize: '14px',
    color: 'white', fontWeight: 'bold',
  },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  filterBtn: {
    padding: '6px 14px', borderRadius: '20px', border: '1px solid #E5E7EB',
    backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', color: '#6B7280',
  },
  filterActive: {
    padding: '6px 14px', borderRadius: '20px', border: 'none',
    backgroundColor: '#4F46E5', cursor: 'pointer', fontSize: '13px',
    color: 'white', fontWeight: 'bold',
  },
  loading: { textAlign: 'center', color: '#6B7280', marginTop: '40px', fontSize: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex',
    flexDirection: 'column', gap: '12px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: '17px', color: '#1E1B4B', margin: 0 },
  cardSub: { fontSize: '13px', color: '#6B7280', margin: '4px 0 0' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  cardDetails: { display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: '#374151' },
  notes: { fontSize: '13px', color: '#6B7280', margin: 0 },
  actionRow: { display: 'flex', gap: '10px' },
  confirmBtn: {
    backgroundColor: '#4F46E5', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: 'white', color: '#DC2626', border: '1px solid #DC2626',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#4F46E5', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '14px', marginBottom: '20px',
  },
  formCard: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px',
    display: 'flex', flexDirection: 'column', gap: '14px',
  },
  formTitle: { fontSize: '18px', color: '#1E1B4B', margin: 0 },
  formHint: { fontSize: '13px', color: '#6B7280', margin: 0 },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB',
    fontSize: '14px', outline: 'none', resize: 'vertical', width: '100%',
    boxSizing: 'border-box',
  },
  timeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnDisabled: {
    backgroundColor: '#A5B4FC', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'not-allowed',
    fontWeight: 'bold', fontSize: '14px',
  },
};

export default ProviderDashboard;