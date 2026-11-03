import { Router } from 'express';
import { csrfProtection } from './middleware/csrf';
import { authRouter } from './modules/auth/auth.routes';
import { healthRouter } from './modules/health/health.routes';
import { usersRouter } from './modules/users/users.routes';

/** Mounts every feature module under /api/v1. */
export const apiRouter = Router();

// Every state-changing request, including login and register, must carry a valid CSRF token.
apiRouter.use(csrfProtection);

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
