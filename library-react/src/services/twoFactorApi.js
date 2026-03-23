// Two-Factor Authentication API
import { generateOTP, generateTOTPSecret, verifyTOTP, generateRecoveryCode, TwoFactorMethod, isWebAuthnSupported } from './auth2FA';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// OTP storage (in production, this would be in a database with expiration)
const otpStorage = {};

// 2FA settings storage
const twoFactorSettings = {
  admin: {
    method: TwoFactorMethod.NONE,
    email: 'kumarpandule@gmail.com',
    totpSecret: null,
    passkeyCredentialId: null,
    recoveryCodes: []
  }
};

// Initialize 2FA settings for students
const initializeStudent2FA = (studentId) => {
  if (!twoFactorSettings[studentId]) {
    twoFactorSettings[studentId] = {
      method: TwoFactorMethod.NONE,
      email: null,
      totpSecret: null,
      passkeyCredentialId: null,
      recoveryCodes: []
    };
  }
};

export const twoFactorAPI = {
  // Get 2FA settings for a user
  getSettings: async (userId) => {
    await delay(200);
    initializeStudent2FA(userId);
    const settings = twoFactorSettings[userId] || twoFactorSettings.admin;
    return {
      success: true,
      data: {
        method: settings.method,
        isConfigured: settings.method !== TwoFactorMethod.NONE,
        hasPasskey: !!settings.passkeyCredentialId,
        hasRecoveryCodes: settings.recoveryCodes.length > 0,
        supportedMethods: [
          TwoFactorMethod.NONE,
          TwoFactorMethod.EMAIL_OTP,
          TwoFactorMethod.GOOGLE_AUTH,
          isWebAuthnSupported() ? TwoFactorMethod.PASSKEY : null
        ].filter(Boolean)
      }
    };
  },

  // Setup Email OTP
  setupEmailOTP: async (userId, email) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    settings.method = TwoFactorMethod.EMAIL_OTP;
    settings.email = email;
    
    // Generate recovery codes
    settings.recoveryCodes = Array(8).fill(null).map(() => generateRecoveryCode());
    
    return {
      success: true,
      data: {
        message: 'Email OTP has been enabled',
        recoveryCodes: settings.recoveryCodes
      }
    };
  },

  // Setup Google Authenticator
  setupGoogleAuth: async (userId, email) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    const secret = generateTOTPSecret();
    
    settings.method = TwoFactorMethod.GOOGLE_AUTH;
    settings.totpSecret = secret;
    settings.email = email;
    
    // Generate recovery codes
    settings.recoveryCodes = Array(8).fill(null).map(() => generateRecoveryCode());
    
    return {
      success: true,
      data: {
        secret,
        recoveryCodes: settings.recoveryCodes
      }
    };
  },

  // Setup Passkey
  setupPasskey: async (userId, credentialId) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    settings.method = TwoFactorMethod.PASSKEY;
    settings.passkeyCredentialId = credentialId;
    
    return {
      success: true,
      data: {
        message: 'Passkey has been enabled'
      }
    };
  },

  // Disable 2FA
  disable2FA: async (userId) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    settings.method = TwoFactorMethod.NONE;
    settings.totpSecret = null;
    settings.passkeyCredentialId = null;
    settings.recoveryCodes = [];
    
    return {
      success: true,
      data: {
        message: 'Two-factor authentication has been disabled'
      }
    };
  },

  // Send OTP to email
  sendEmailOTP: async (userId) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    const email = settings.email || settings.email;
    
    if (!email) {
      return { success: false, message: 'Email not configured' };
    }
    
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    otpStorage[userId] = {
      otp,
      expiresAt: expiresAt.toISOString(),
      attempts: 0
    };
    
    // In production, this would send an actual email
    console.log(`OTP for ${email}: ${otp}`);
    
    return {
      success: true,
      data: {
        message: `OTP has been sent to ${email.substring(0, 3)}***@${email.split('@')[1]}`,
        // For demo purposes, return the OTP
        // In production, this would not be returned
        demoOTP: otp
      }
    };
  },

  // Verify OTP
  verifyOTP: async (userId, code) => {
    await delay(300);
    
    const stored = otpStorage[userId];
    if (!stored) {
      return { success: false, message: 'No OTP requested' };
    }
    
    // Check expiration
    if (new Date(stored.expiresAt) < new Date()) {
      delete otpStorage[userId];
      return { success: false, message: 'OTP has expired' };
    }
    
    // Check attempts
    if (stored.attempts >= 3) {
      delete otpStorage[userId];
      return { success: false, message: 'Too many attempts. Please request a new OTP' };
    }
    
    // Verify code
    if (stored.otp === code) {
      delete otpStorage[userId];
      return { success: true };
    }
    
    stored.attempts += 1;
    return { success: false, message: 'Invalid OTP' };
  },

  // Verify TOTP (Google Authenticator)
  verifyTOTP: async (userId, code) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    
    if (!settings.totpSecret) {
      return { success: false, message: 'Google Authenticator not configured' };
    }
    
    // In production, use proper TOTP verification
    // For demo, accept any 6-digit code
    if (verifyTOTP(code, settings.totpSecret)) {
      return { success: true };
    }
    
    return { success: false, message: 'Invalid code' };
  },

  // Verify recovery code
  verifyRecoveryCode: async (userId, code) => {
    await delay(300);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    
    const codeIndex = settings.recoveryCodes.indexOf(code.toUpperCase());
    if (codeIndex === -1) {
      return { success: false, message: 'Invalid recovery code' };
    }
    
    // Remove used recovery code
    settings.recoveryCodes.splice(codeIndex, 1);
    
    return { success: true };
  },

  // Initiate passkey authentication
  initiatePasskeyAuth: async (userId) => {
    await delay(200);
    initializeStudent2FA(userId);
    
    const settings = userId === 'admin' ? twoFactorSettings.admin : twoFactorSettings[userId];
    
    if (!settings.passkeyCredentialId) {
      return { success: false, message: 'Passkey not configured' };
    }
    
    return {
      success: true,
      data: {
        credentialId: settings.passkeyCredentialId
      }
    };
  }
};

// Export TwoFactorMethod for use in components
export { TwoFactorMethod, isWebAuthnSupported };
