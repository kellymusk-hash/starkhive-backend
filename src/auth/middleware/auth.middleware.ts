/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
    walletAddress?: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    try {
      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'No valid authorization token provided',
        );
      }

      const token = authHeader.split(' ')[1];

      // Validate the token and get wallet address
      const payload = await this.authService.validateToken(token);

      if (!req.user?.id || !req.user?.email) {
        throw new Error(
          'User ID and email are required in authenticated requests.',
        );
      }

      // Set user information in request
      req.user = {
        id: req.user.id, // Ensuring `id` exists
        email: req.user.email, // Ensuring `email` exists
        role: req.user.role, // Keeping optional fields
        walletAddress: payload.sub, // Updating walletAddress
      };
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
