import bcrypt from 'bcrypt';

export const PasswordUtil = {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  },
};
