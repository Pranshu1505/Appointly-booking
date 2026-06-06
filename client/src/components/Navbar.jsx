import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        📅 BookIt
      </Link>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Services</Link>

        {/* Agar logged in nahi hai */}
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {/* Agar customer logged in hai */}
        {user?.role === 'customer' && (
          <>
            <Link to="/dashboard/customer" style={styles.link}>My Bookings</Link>
            <span style={styles.name}>👋 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}

        {/* Agar provider logged in hai */}
        {user?.role === 'provider' && (
          <>
            <Link to="/dashboard/provider" style={styles.link}>Dashboard</Link>
            <span style={styles.name}>👋 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    backgroundColor: '#4F46E5',
    color: 'white',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
  },
  name: {
    color: '#C7D2FE',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'white',
    color: '#4F46E5',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;