import Auth0, { Credentials } from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'dev-8crvukra8kuadxc5.us.auth0.com',
  clientId: '54sf1BPtMqCrfkHGqfhig0mFlTrmjy9B',
});

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

export { auth0 };
export type { Credentials };
