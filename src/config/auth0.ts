import Auth0, { Credentials } from 'react-native-auth0';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

// Validate required environment variables
if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error(
    'Missing required Auth0 environment variables. Please check your .env file.'
  );
}

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
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
