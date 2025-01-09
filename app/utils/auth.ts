import { getAuth } from 'firebase/auth';
import { logger } from './logger';

export async function getAuthToken(): Promise<string | undefined> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      logger.debug('No user logged in');
      return undefined;
    }

    const token = await user.getIdToken();
    return token;
  } catch (error) {
    logger.error('Error getting auth token:', error);
    return undefined;
  }
}
