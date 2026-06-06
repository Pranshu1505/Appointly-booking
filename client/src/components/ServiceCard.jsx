import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ServiceCard = ({ service }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${service._id}`);
  };

  return (
    <div style={styles.card}>
      {/* Top — Category Badge */}
      <div style={styles.cardTop}>
        <span style={styles.category}>{service.category}</span>
        <span style={styles.price}>₹{service.price}</span>
      </div>

      {/* Service Name */}
      <h3 style={styles.name}>{service.name}</h3>

      {/* Description */}
      <p style={styles.description}>
        {service.description || 'No description available.'}
      </p>

      {/* Details */}
      <div style={styles.details}>
        <span style={styles.detail}>⏱ {service.duration} min</span>
        <span style={styles.detail}>👤 {service.provider?.name}</span>
      </div>

      {/* Book Button */}
      <button style={styles.btn} onClick={handleBook}>
        Book Now
      </button>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'transform 0.2s',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1E1B4B',
  },
  name: {
    fontSize: '20px',
    color: '#1E1B4B',
    margin: 0,
  },
  description: {
    color: '#6B7280',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5',
  },
  details: {
    display: 'flex',
    gap: '16px',
    marginTop: '4px',
  },
  detail: {
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#F9FAFB',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  btn: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: 'auto',
  },
};

export default ServiceCard;