import { PrismaClient } from '../client/client';

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
