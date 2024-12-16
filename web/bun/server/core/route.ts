import { Server } from 'http';

export interface Router {
  path: string;
  serve(request: Request, server: Server): Response;
}
