import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes';

/** Mounts every feature module under /api/v1. */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
