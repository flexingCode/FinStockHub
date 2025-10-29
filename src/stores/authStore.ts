import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { auth0, User, AuthState } from '@/config/auth0';
import { AUTH0_IOS, AUTH0_ANDROID } from '@env';
import logger from '@/utils/logger';
import { saveAuthTokens, getAuthTokens, clearAuthTokens } from '@/stores/secureStorage';

interface AuthStore extends AuthState {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

/**
 * Auth Store with Secure Token Storage
 * 
 * SECURITY IMPROVEMENT:
 * - Access tokens are stored in Keychain/Keystore (encrypted OS storage)
 * - Only non-sensitive data (user info, isAuthenticated) is stored in AsyncStorage
 * - Access tokens are kept in memory only (not persisted in Zustand)
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null, // Stored only in memory, not persisted
      isLoading: false,

      /**
       * Initialize the auth store by loading tokens from secure storage
       * Call this when the app starts to restore authentication state
       */
      initialize: async () => {
        try {
          logger.debug('Initializing auth store from secure storage');
          
          const tokens = await getAuthTokens();
          
          if (tokens && tokens.accessToken) {
            // Tokens found in secure storage - restore authentication state
            set({
              isAuthenticated: true,
              accessToken: tokens.accessToken,
            });
            
            // Optionally, fetch user info again to ensure it's up to date
            try {
              const userInfo = await auth0.auth.userInfo({
                token: tokens.accessToken,
              });
              
              set({
                user: {
                  id: userInfo.sub,
                  email: userInfo.email || '',
                  name: userInfo.name || '',
                  picture: userInfo.picture,
                },
              });
              
              logger.info('Auth state restored from secure storage');
            } catch (error) {
              // Token might be expired, clear it
              logger.warn('Token validation failed during initialization', error);
              await clearAuthTokens();
              set({
                isAuthenticated: false,
                accessToken: null,
                user: null,
              });
            }
          } else {
            // No tokens found - user is not authenticated
            set({
              isAuthenticated: false,
              accessToken: null,
            });
            logger.debug('No auth tokens found in secure storage');
          }
        } catch (error) {
          logger.error('Failed to initialize auth store', error);
          // On error, assume user is not authenticated
          set({
            isAuthenticated: false,
            accessToken: null,
          });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const credentials = await auth0.webAuth.authorize({
            scope: 'openid profile email',
            connection: 'google-oauth2',
            redirectUrl: Platform.OS === 'ios' 
              ? AUTH0_IOS
              : AUTH0_ANDROID,
          });
          
          const userInfo = await auth0.auth.userInfo({
            token: credentials.accessToken,
          });

          // Save tokens to secure storage (Keychain/Keystore)
          await saveAuthTokens({
            accessToken: credentials.accessToken,
            // If Auth0 provides a refresh token, include it here:
            // refreshToken: credentials.refreshToken,
          });

          // Update state (tokens in memory, user info persisted to AsyncStorage)
          set({
            isAuthenticated: true,
            user: {
              id: userInfo.sub,
              email: userInfo.email || '',
              name: userInfo.name || '',
              picture: userInfo.picture,
            },
            accessToken: credentials.accessToken,
            isLoading: false,
          });
          
          logger.info('Login successful - tokens saved to secure storage');
        } catch (error) {
          logger.error('Google login failed', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Clear tokens from secure storage
          await clearAuthTokens();
          
          // Clear state
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            isLoading: false,
          });
          
          logger.info('Logout successful - tokens cleared from secure storage');
        } catch (error) {
          logger.error('Logout failed', error);
          // Even if clearing fails, reset state
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => set({ user }),
      setAccessToken: (accessToken: string | null) => set({ accessToken }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist non-sensitive data
      // accessToken is NOT persisted - it's stored in Keychain/Keystore
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        // accessToken is intentionally excluded from persistence
        // It's stored in secure storage (Keychain/Keystore) instead
      }),
    }
  )
);
