import { AuthPayload, User } from '@project-compass/shared-types';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user: User): string | null {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  if (JWT_SECRET === undefined) {
    console.log('JWT_SECRET is required.');
    return null;
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return token;
}

export function verifyToken(token: string) {
  if (JWT_SECRET === undefined) {
    console.log('JWT_SECRET is required.');
    return null;
  }

  try {
    const playload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return playload;
  } catch (error) {
    console.error('Error while verifivation: ' + error);
    return null;
  }
}
