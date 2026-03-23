import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { twoFactorAPI, TwoFactorMethod, isWebAuthnSupported } from '../services/twoFactorApi';
import { authenticateWithPasskey } from '../services/auth2FA';

const TwoFactorVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [method, setMethod] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  
  // User info passed from login
  const { userId, userType } = location.state || {};

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    setLoading(true);
    const result = await twoFactorAPI.getSettings(userId);
    if (result.success) {
      setSettings(result.data);
      setMethod(result.data.method);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    let result;
    if (useRecovery) {
      result = await twoFactorAPI.verifyRecoveryCode(userId, recoveryCode);
    } else {
      result = await twoFactorAPI.verifyOTP(userId, otpCode);
    }

    setVerifying(false);

    if (result.success) {
      // 2FA verified, redirect to dashboard
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const handleVerifyTOTP = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    const result = await twoFactorAPI.verifyTOTP(userId, otpCode);

    setVerifying(false);

    if (result.success) {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const handlePasskeyAuth = async () => {
    setError('');
    setVerifying(true);

    const initResult = await twoFactorAPI.initiatePasskeyAuth(userId);
    
    if (!initResult.success) {
      setError(initResult.message);
      setVerifying(false);
      return;
    }

    const authResult = await authenticateWithPasskey(initResult.data.credentialId);

    setVerifying(false);

    if (authResult.success) {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(authResult.message || 'Passkey authentication failed');
    }
  };

  const handleSubmit = (e) => {
    if (method === TwoFactorMethod.EMAIL_OTP) {
      handleVerifyOTP(e);
    } else if (method === TwoFactorMethod.GOOGLE_AUTH) {
      handleVerifyTOTP(e);
    }
  };

  const resendOTP = async () => {
    setError('');
    const result = await twoFactorAPI.sendEmailOTP(userId);
    if (result.success) {
      setError('');
      // For demo purposes, show the OTP
      alert(`Demo OTP: ${result.data.demoOTP}`);
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!settings?.isConfigured) {
    // No 2FA configured, redirect back
    useEffect(() => {
      navigate('/');
    }, []);
    return null;
  }

  const getMethodTitle = () => {
    switch (method) {
      case TwoFactorMethod.EMAIL_OTP:
        return 'Email OTP Verification';
      case TwoFactorMethod.GOOGLE_AUTH:
        return 'Google Authenticator Verification';
      case TwoFactorMethod.PASSKEY:
        return 'Passkey Verification';
      default:
        return 'Two-Factor Verification';
    }
  };

  return (
    <div className="two-factor-verify">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2><i className="fa fa-shield"></i></h2>
              <h2>{getMethodTitle()}</h2>
              <p>Enter the code to continue</p>
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {method === TwoFactorMethod.PASSKEY ? (
              <div className="passkey-section">
                <p>Use your passkey to verify your identity</p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handlePasskeyAuth}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying...' : 'Use Passkey'}
                </button>
                <button
                  className="btn btn-link btn-block mt-2"
                  onClick={() => navigate('/')}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    {useRecovery ? 'Recovery Code' : (method === TwoFactorMethod.GOOGLE_AUTH ? 'Authenticator Code' : 'OTP Code')}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={useRecovery ? recoveryCode : otpCode}
                    onChange={(e) => useRecovery ? setRecoveryCode(e.target.value) : setOtpCode(e.target.value)}
                    placeholder={useRecovery ? 'Enter recovery code' : 'Enter 6-digit code'}
                    maxLength={useRecovery ? 8 : 6}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={verifying}
                >
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="btn btn-link btn-block"
                  onClick={() => {
                    setUseRecovery(!useRecovery);
                    setOtpCode('');
                    setRecoveryCode('');
                  }}
                >
                  {useRecovery ? 'Use OTP Code' : 'Use Recovery Code'}
                </button>

                {method === TwoFactorMethod.EMAIL_OTP && !useRecovery && (
                  <button
                    type="button"
                    className="btn btn-link btn-block"
                    onClick={resendOTP}
                  >
                    Resend OTP
                  </button>
                )}
              </form>
            )}

            <div className="auth-footer">
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .two-factor-verify {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .passkey-section {
          text-align: center;
        }
        
        .passkey-section p {
          margin-bottom: 20px;
          color: #666;
        }
        
        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        
        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #dee2e6;
        }
        
        .divider span {
          background: white;
          padding: 0 10px;
          color: #666;
          position: relative;
        }
        
        .btn-block {
          display: block;
          width: 100%;
        }
        
        .mt-2 {
          margin-top: 10px;
        }
        
        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .alert-danger {
          background: #f8d7da;
          color: #721c24;
        }
        
        .auth-page {
          min-height: auto;
          display: block;
          padding: 40px 15px;
        }
        
        .auth-container {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .auth-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .auth-header h2 {
          color: #1e3c72;
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .auth-header h2:first-child {
          font-size: 48px;
          margin-bottom: 0;
        }
        
        .auth-header p {
          color: #666;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }
        
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0056b3;
        }
        
        .btn-primary:disabled {
          background: #ccc;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-link {
          background: none;
          color: #007bff;
          text-decoration: none;
        }
        
        .btn-link:hover {
          text-decoration: underline;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default TwoFactorVerify;
