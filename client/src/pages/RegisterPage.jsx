import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const user = await register(
  //       formData.name,
  //       formData.email,
  //       formData.password,
  //       formData.role,
  //       formData.phone
  //     );
  //     // Role ke hisaab se redirect karo
  //   //   if (user.role === 'provider') {
  //   //     navigate('/dashboard/provider');
  //   //   } else {
  //   //     navigate('/dashboard/customer');
  //   //   }
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Registration failed. Try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  //   await register(
  //     formData.name,
  //     formData.email,
  //     formData.password,
  //     formData.role,
  //     formData.phone
  //   );

  //   navigate('/login');
  
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.phone
    );
    
    alert('Registration Successful');
    navigate('/login');
  } catch (err) {
    setError(
      err.response?.data?.message || 'Registration failed. Try again.'
    );
  } finally {
    setLoading(false);
  }
 };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <h2 style={styles.title}>🎉 Create Account</h2>
        <p style={styles.subtitle}>Naya account banao — bilkul free!</p>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>

          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Aapka naam"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="aapka@email.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Phone */}
          <div style={styles.field}>
            <label style={styles.label}>Phone (Optional)</label>
            <input
              type="text"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Role */}
          <div style={styles.field}>
            <label style={styles.label}>Main kaun hoon?</label>
            <div style={styles.roleRow}>
              <div
                style={formData.role === 'customer' ? styles.roleActive : styles.roleCard}
                onClick={() => setFormData({ ...formData, role: 'customer' })}
              >
                <span style={styles.roleIcon}>👤</span>
                <span style={styles.roleText}>Customer</span>
                <small style={styles.roleDesc}>Services book karna chahta hoon</small>
              </div>
              {/* <div
                style={formData.role === 'provider' ? styles.roleActive : styles.roleCard}
                onClick={() => setFormData({ ...formData, role: 'provider' })}
              >
                <span style={styles.roleIcon}>🏢</span>
                <span style={styles.roleText}>Provider</span>
                <small style={styles.roleDesc}>Apni services offer karna chahta hoon</small>
              </div> */}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? styles.btnDisabled : styles.btn}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>

        {/* Login Link */}
        <p style={styles.bottomText}>
          Pehle se account hai?{' '}
          <Link to="/login" style={styles.link}>
            Login karo
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
    backgroundColor: '#F5F3FF', padding: '20px',
  },
  card: {
    backgroundColor: 'white', padding: '40px',
    borderRadius: '16px', width: '100%', maxWidth: '460px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  title: { fontSize: '26px', color: '#1E1B4B', marginBottom: '6px', textAlign: 'center' },
  subtitle: { color: '#6B7280', textAlign: 'center', marginBottom: '24px' },
  error: {
    backgroundColor: '#FEE2E2', color: '#DC2626',
    padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none',
  },
  roleRow: { display: 'flex', gap: '12px' },
  roleCard: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px', borderRadius: '10px', border: '2px solid #E5E7EB',
    cursor: 'pointer', gap: '4px',
  },
  roleActive: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px', borderRadius: '10px', border: '2px solid #4F46E5',
    cursor: 'pointer', gap: '4px', backgroundColor: '#EEF2FF',
  },
  roleIcon: { fontSize: '28px' },
  roleText: { fontWeight: 'bold', color: '#1E1B4B', fontSize: '15px' },
  roleDesc: { color: '#6B7280', fontSize: '12px', textAlign: 'center' },
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

export default RegisterPage;