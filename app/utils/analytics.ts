import { logger } from './logger';

export const trackSessionPlay = (userId: string, programId: number, sessionId: number): void => {
  // Replace this with your actual analytics implementation
  logger.info('Session played', {
    userId,
    programId,
    sessionId,
    event: 'session_play'
  });
};
