// Two-Factor Authentication Service
// Supports: OTP (email), TOTP (Google Authenticator), Passkeys (WebAuthn)

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a random 8-character recovery code
export const generateRecoveryCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// TOTP Implementation (Time-based One-Time Password)
// Using a simplified version - in production, use a proper TOTP library
export const generateTOTPSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

// Verify TOTP code (simplified - in production use proper TOTP verification)
// This is a mock implementation - real implementation would use the authenticator's secret
export const verifyTOTP = (code, secret) => {
  // In a real implementation, this would verify against the current time window
  // For demo purposes, accept any 6-digit code
  return code.length === 6 && /^\d+$/.test(code);
};

// Generate QR Code URL for Google Authenticator
export const getTOTPQRUrl = (secret, email, issuer = 'LibraryMS') => {
  // otpauth://totp/LibraryMS:email?secret=SECRET&issuer=LibraryMS
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
};

// WebAuthn / Passkey Support
export const isWebAuthnSupported = () => {
  return !!(
    navigator.credentials &&
    navigator.credentials.create &&
    window.PublicKeyCredential
  );
};

// Register a passkey
export const registerPasskey = async (username) => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  try {
    const publicKeyCredentialCreationOptions = {
      challenge: new Uint8Array(32),
      rp: {
        name: 'Library Management System',
        id: window.location.hostname
      },
      user: {
        id: new Uint8Array(16),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7
        },
        {
          type: 'public-key',
          alg: -257
        }
      ],
      timeout: 60000,
      attestation: 'none'
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });

    // Store the credential ID for future authentication
    return {
      success: true,
      credentialId: arrayBufferToBase64(credential.rawId),
      username
    };
  } catch (error) {
    console.error('Passkey registration failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to register passkey'
    };
  }
};

// Authenticate with a passkey
export const authenticateWithPasskey = async (credentialId) => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  try {
    const publicKeyCredentialRequestOptions = {
      challenge: new Uint8Array(32),
      timeout: 60000,
      rpId: window.location.hostname,
      allowCredentials: [
        {
          type: 'public-key',
          id: base64ToArrayBuffer(credentialId)
        ]
      ]
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });

    return {
      success: true,
      signature: arrayBufferToBase64(assertion.signature)
    };
  } catch (error) {
    console.error('Passkey authentication failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to authenticate with passkey'
    };
  }
};

// Helper functions for ArrayBuffer conversion
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// 2FA Types
export const TwoFactorMethod = {
  NONE: 'none',
  EMAIL_OTP: 'email_otp',
  GOOGLE_AUTH: 'google_auth',
  PASSKEY: 'passkey'
};

// Get method name
export const getMethodName = (method) => {
  switch (method) {
    case TwoFactorMethod.EMAIL_OTP:
      return 'Email OTP';
    case TwoFactorMethod.GOOGLE_AUTH:
      return 'Google Authenticator';
    case TwoFactorMethod.PASSKEY:
      return 'Passkey';
    default:
      return 'None';
  }
};
