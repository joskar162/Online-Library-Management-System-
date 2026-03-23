import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { twoFactorAPI, TwoFactorMethod, isWebAuthnSupported } from '../services/twoFactorApi';
import { getTOTPQRUrl } from '../services/auth2FA';

const TwoFactorSetup = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  
  // Setup form
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(TwoFactorMethod.NONE);

  const userId = userType === 'admin' ? 'admin' : user?.studentId;

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    const result = await twoFactorAPI.getSettings(userId);
    if (result.success) {
      setSettings(result.data);
    }
    setLoading(false);
  };

  const handleMethodSelect = async (method) => {
    if (method === TwoFactorMethod.NONE) {
      if (window.confirm('Are you sure you want to disable two-factor authentication?')) {
        setSaving(true);
        const result = await twoFactorAPI.disable2FA(userId);
        setSaving(false);
        if (result.success) {
          setMessage(result.data.message);
          fetchSettings();
        } else {
          setError(result.message);
        }
      }
      return;
    }

    setSelectedMethod(method);
    setError('');
    setMessage('');

    if (method === TwoFactorMethod.EMAIL_OTP) {
      // Setup email OTP
      const userEmail = userType === 'admin' ? 'kumarpandule@gmail.com' : user?.email;
      if (!userEmail) {
        setError('Please update your email in your profile first');
        return;
      }
      setSaving(true);
      const result = await twoFactorAPI.setupEmailOTP(userId, userEmail);
      setSaving(false);
      if (result.success) {
        setMessage('Email OTP has been enabled successfully');
        setRecoveryCodes(result.data.recoveryCodes);
        setShowRecoveryCodes(true);
        fetchSettings();
      } else {
        setError(result.message);
      }
    } else if (method === TwoFactorMethod.GOOGLE_AUTH) {
      // Setup Google Authenticator
      const userEmail = userType === 'admin' ? 'kumarpandule@gmail.com' : user?.email;
      if (!userEmail) {
        setError('Please update your email in your profile first');
        return;
      }
      setSaving(true);
      const result = await twoFactorAPI.setupGoogleAuth(userId, userEmail);
      setSaving(false);
      if (result.success) {
        setRecoveryCodes(result.data.recoveryCodes);
        setShowRecoveryCodes(true);
        fetchSettings();
      } else {
        setError(result.message);
      }
    } else if (method === TwoFactorMethod.PASSKEY) {
      // Setup Passkey - handled separately
      try {
        const { registerPasskey } = await import('../services/auth2FA');
        const userName = userType === 'admin' ? user?.username : user?.fullName;
        const result = await registerPasskey(userName);
        
        if (result.success) {
          // Save passkey to API
          const saveResult = await twoFactorAPI.setupPasskey(userId, result.credentialId);
          if (saveResult.success) {
            setMessage('Passkey has been enabled successfully');
            fetchSettings();
          } else {
            setError(saveResult.message);
          }
        } else {
          setError(result.message || 'Failed to register passkey');
        }
      } catch (err) {
        setError('Passkey registration failed: ' + err.message);
      }
    }
  };

  const handleClose = () => {
    if (userType === 'admin') {
      navigate('/admin/profile');
    } else {
      navigate('/student/my-profile');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="two-factor-setup">
      <div className="page-header">
        <h2>Two-Factor Authentication</h2>
        <p>Add an extra layer of security to your account</p>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {showRecoveryCodes && (
        <div className="card mb-3">
          <div className="card-header">
            <h3><i className="fa fa-key"></i> Recovery Codes</h3>
          </div>
          <div className="card-body">
            <p className="text-warning">
              <i className="fa fa-exclamation-triangle"></i> 
              Save these recovery codes in a safe place. You can use them to access your account if you lose your 2FA device.
            </p>
            <div className="recovery-codes">
              {recoveryCodes.map((code, index) => (
                <code key={index}>{code}</code>
              ))}
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => {
                setShowRecoveryCodes(false);
                setRecoveryCodes([]);
              }}
            >
              I have saved these codes
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Choose 2FA Method</h3>
        </div>
        <div className="card-body">
          {settings?.isConfigured && (
            <div className="current-method">
              <span className="badge badge-success">
                <i className="fa fa-check"></i> Currently enabled: {
                  settings.method === TwoFactorMethod.EMAIL_OTP ? 'Email OTP' :
                  settings.method === TwoFactorMethod.GOOGLE_AUTH ? 'Google Authenticator' :
                  settings.method === TwoFactorMethod.PASSKEY ? 'Passkey' : 'None'
                }
              </span>
            </div>
          )}

          <div className="method-options">
            {/* Email OTP Option */}
            <div 
              className={`method-option ${selectedMethod === TwoFactorMethod.EMAIL_OTP ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(TwoFactorMethod.EMAIL_OTP)}
            >
              <div className="method-icon">
                <i className="fa fa-envelope"></i>
              </div>
              <div className="method-info">
                <h4>Email OTP</h4>
                <p>Receive a one-time password via email</p>
              </div>
              <div className="method-status">
                {settings?.method === TwoFactorMethod.EMAIL_OTP && (
                  <span className="badge badge-success">Enabled</span>
                )}
              </div>
            </div>

            {/* Google Authenticator Option */}
            <div 
              className={`method-option ${selectedMethod === TwoFactorMethod.GOOGLE_AUTH ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(TwoFactorMethod.GOOGLE_AUTH)}
            >
              <div className="method-icon">
                <i className="fa fa-google"></i>
              </div>
              <div className="method-info">
                <h4>Google Authenticator</h4>
                <p>Use an authenticator app on your phone</p>
              </div>
              <div className="method-status">
                {settings?.method === TwoFactorMethod.GOOGLE_AUTH && (
                  <span className="badge badge-success">Enabled</span>
                )}
              </div>
            </div>

            {/* Passkey Option */}
            {isWebAuthnSupported() && (
              <div 
                className={`method-option ${selectedMethod === TwoFactorMethod.PASSKEY ? 'selected' : ''}`}
                onClick={() => handleMethodSelect(TwoFactorMethod.PASSKEY)}
              >
                <div className="method-icon">
                  <i className="fa fa-key"></i>
                </div>
                <div className="method-info">
                  <h4>Passkey</h4>
                  <p>Use your device's biometric or PIN to login</p>
                </div>
                <div className="method-status">
                  {settings?.method === TwoFactorMethod.PASSKEY && (
                    <span className="badge badge-success">Enabled</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {settings?.isConfigured && (
            <div className="disable-section mt-3">
              <button 
                className="btn btn-danger"
                onClick={() => handleMethodSelect(TwoFactorMethod.NONE)}
                disabled={saving}
              >
                <i className="fa fa-times"></i> Disable 2FA
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-secondary" onClick={handleClose}>
          Back to Profile
        </button>
      </div>

      <style>{`
        .two-factor-setup {
          max-width: 700px;
          margin: 0 auto;
        }
        
        .current-method {
          margin-bottom: 20px;
        }
        
        .method-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .method-option {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .method-option:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }
        
        .method-option.selected {
          border-color: #007bff;
          background: #e7f3ff;
        }
        
        .method-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 24px;
          color: #666;
        }
        
        .method-info {
          flex: 1;
        }
        
        .method-info h4 {
          margin: 0 0 5px;
        }
        
        .method-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .method-status {
          margin-left: 15px;
        }
        
        .recovery-codes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin: 15px 0;
        }
        
        .recovery-codes code {
          padding: 10px;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
          letter-spacing: 1px;
        }
        
        .text-warning {
          color: #ffc107;
        }
        
        .badge {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .badge-success {
          background: #28a745;
          color: white;
        }
        
        .alert {
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .alert-success {
          background: #d4edda;
          color: #155724;
        }
        
        .alert-danger {
          background: #f8d7da;
          color: #721c24;
        }
        
        .mt-3 {
          margin-top: 20px;
        }
        
        .mb-3 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default TwoFactorSetup;
