/**
 * Secure Storage Utility
 * 
 * This utility provides secure storage for sensitive data like access tokens
 * using react-native-keychain (Keychain on iOS, Keystore on Android).
 * 
 * Keychain/Keystore are encrypted storage systems provided by the OS,
 * making them much more secure than AsyncStorage.
 */

import * as Keychain from 'react-native-keychain';
import logger from '../utils/logger';

const AUTH_SERVICE = 'com.finstockhub.auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Save authentication tokens to secure storage
 * @param tokens - Object containing accessToken and optionally refreshToken
 */
export const saveAuthTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    const tokensJson = JSON.stringify(tokens);
    
    // Save to Keychain (iOS) or Keystore (Android)
    // ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY ensures:
    // - Tokens are only accessible when device is unlocked
    // - Tokens are only accessible on the device where they were saved (not in backups)
    await Keychain.setGenericPassword(
      AUTH_SERVICE, // username (can be any identifier)
      tokensJson,   // password (will store our tokens as JSON)
      {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        service: AUTH_SERVICE, // Optional: adds extra identifier
      }
    );
    
    logger.debug('Auth tokens saved to secure storage');
  } catch (error) {
    logger.error('Failed to save auth tokens to secure storage', error);
    throw error;
  }
};

/**
 * Retrieve authentication tokens from secure storage
 * @returns AuthTokens object or null if no tokens found
 */
export const getAuthTokens = async (): Promise<AuthTokens | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: AUTH_SERVICE,
    });
    
    if (!credentials || !credentials.password) {
      logger.debug('No auth tokens found in secure storage');
      return null;
    }
    
    const tokens = JSON.parse(credentials.password) as AuthTokens;
    
    if (!tokens.accessToken) {
      logger.warn('Invalid token format in secure storage');
      return null;
    }
    
    logger.debug('Auth tokens retrieved from secure storage');
    return tokens;
  } catch (error) {
    logger.error('Failed to retrieve auth tokens from secure storage', error);
    return null;
  }
};

/**
 * Remove authentication tokens from secure storage
 */
export const clearAuthTokens = async (): Promise<void> => {
  try {
    const result = await Keychain.resetGenericPassword({
      service: AUTH_SERVICE,
    });
    
    if (result) {
      logger.debug('Auth tokens cleared from secure storage');
    } else {
      logger.warn('No auth tokens found to clear');
    }
  } catch (error) {
    logger.error('Failed to clear auth tokens from secure storage', error);
    // Don't throw - we want logout to succeed even if clearing fails
  }
};

/**
 * Check if secure storage is available on this device
 * @returns true if Keychain/Keystore is available
 */
export const isSecureStorageAvailable = async (): Promise<boolean> => {
  try {
    // Try to get supported biometric types as a test
    const supportedBiometrics = await Keychain.getSupportedBiometryType();
    // If this doesn't throw, secure storage is available
    return true;
  } catch (error) {
    // If it fails, secure storage might not be available
    logger.warn('Secure storage might not be available', error);
    return false;
  }
};

