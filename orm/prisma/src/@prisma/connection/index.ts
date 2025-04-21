import { PrismaClient } from '../client';

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
