import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { auth0, User, AuthState } from '@/config/auth0';
import { AUTH0_IOS, AUTH0_ANDROID } from '@env';

interface AuthStore extends AuthState {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,

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
        } catch (error) {
          console.error('Google login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },


      logout: async () => {
        try {
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout failed:', error);
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
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
