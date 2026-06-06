import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Role ke hisaab se redirect karo
      if (user.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <h2 style={styles.title}>👋 Welcome Back</h2>
        <p style={styles.subtitle}>Apne account mein login karo</p>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="aapka@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? styles.btnDisabled : styles.btn}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Register Link */}
        <p style={styles.bottomText}>
          Account nahi hai?{' '}
          <Link to="/register" style={styles.link}>
            Register karo
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5F3FF',
  },
  card: {
    backgroundColor: 'white', padding: '40px',
    borderRadius: '16px', width: '100%', maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  title: { fontSize: '26px', color: '#1E1B4B', marginBottom: '6px', textAlign: 'center' },
  subtitle: { color: '#6B7280', textAlign: 'center', marginBottom: '24px' },
  error: {
    backgroundColor: '#FEE2E2', color: '#DC2626',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none',
  },
  btn: {
    backgroundColor: '#4F46E5', color: 'white', border: 'none',
    padding: '12px', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'pointer', marginTop: '6px',
  },
  btnDisabled: {
    backgroundColor: '#A5B4FC', color: 'white', border: 'none',
    padding: '12px', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'not-allowed', marginTop: '6px',
  },
  bottomText: { textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '14px' },
  link: { color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' },
};

export default LoginPage;