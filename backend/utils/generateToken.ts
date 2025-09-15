// backend/utils/generateToken.ts
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d', // The token will expire after 30 days
  });
};

export default generateToken;