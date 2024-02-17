import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const SECRETKEY = 'fikiaBack';

async function hashPassword(password: string) {
  const saltRounds = 5;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function comparePasswords(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

function generateToken(payload) {
  const token = jwt.sign(payload, SECRETKEY, { expiresIn: '7h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRETKEY);
    return decoded;
  } catch (error) {
    return null;
  }
}

// when doing authentication and authorization using JWT tokens, should I use a single secret key for signing my JWT tokens or should I

export { hashPassword, comparePasswords, generateToken, verifyToken };
