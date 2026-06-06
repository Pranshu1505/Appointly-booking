import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, getCategories } from '../api/serviceApi';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async (category = '') => {
    try {
      setLoading(true);
      const res = await getServices(category ? { category } : {});
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    fetchServices(category);
  };

  const handleBook = (serviceId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${serviceId}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📅 Book an Appointment</h1>
        <p style={styles.subtitle}>Apni pasand ki service choose karo aur slot book karo</p>
      </div>

      {/* Category Filter */}
      <div style={styles.filterRow}>
        <button
          style={selectedCategory === '' ? styles.activeCat : styles.catBtn}
          onClick={() => handleCategoryFilter('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            style={selectedCategory === cat ? styles.activeCat : styles.catBtn}
            onClick={() => handleCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <p style={styles.loading}>Loading services...</p>
      ) : services.length === 0 ? (
        <p style={styles.loading}>Koi service nahi mili.</p>
      ) : (
        <div style={styles.grid}>
          {services.map((service) => (
            <div key={service._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{service.category}</span>
              </div>
              <h3 style={styles.serviceName}>{service.name}</h3>
              <p style={styles.description}>{service.description}</p>
              <div style={styles.cardFooter}>
                <div>
                  <p style={styles.detail}>⏱ {service.duration} min</p>
                  <p style={styles.detail}>💰 ₹{service.price}</p>
                  <p style={styles.detail}>👤 {service.provider?.name}</p>
                </div>
                <button
                  style={styles.bookBtn}
                  onClick={() => handleBook(service._id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' },
  header: { textAlign: 'center', marginBottom: '32px' },
  title: { fontSize: '32px', color: '#1E1B4B', marginBottom: '8px' },
  subtitle: { color: '#6B7280', fontSize: '16px' },
  filterRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' },
  catBtn: {
    padding: '8px 18px', borderRadius: '20px', border: '1px solid #C7D2FE',
    backgroundColor: 'white', cursor: 'pointer', color: '#4F46E5',
  },
  activeCat: {
    padding: '8px 18px', borderRadius: '20px', border: 'none',
    backgroundColor: '#4F46E5', cursor: 'pointer', color: 'white', fontWeight: 'bold',
  },
  loading: { textAlign: 'center', color: '#6B7280', marginTop: '60px', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between' },
  category: {
    backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '4px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
  },
  serviceName: { fontSize: '20px', color: '#1E1B4B', margin: 0 },
  description: { color: '#6B7280', fontSize: '14px', margin: 0 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  detail: { margin: '4px 0', fontSize: '14px', color: '#374151' },
  bookBtn: {
    backgroundColor: '#4F46E5', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '14px',
  },
};

export default HomePage;