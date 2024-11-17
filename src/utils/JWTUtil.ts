import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const JWTUtil = {
  signToken(payload: object, expiresIn: string = '1h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === 'object') {
        return decoded as JwtPayload;
      }
      return null; // If it's a string, treat it as invalid
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  },
};
