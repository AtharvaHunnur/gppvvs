import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, isRefresh = false): JwtPayload => {
  const secret = isRefresh ? config.jwtRefreshSecret : config.jwtSecret;
  return jwt.verify(token, secret) as JwtPayload;
};
