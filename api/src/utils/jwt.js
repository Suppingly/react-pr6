import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

class JWT {
  static signToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }
  static verifyToken(token) {
    return jwt.verify(token, secret);
  }
  /*static decodeToken(token) {
    return jwt.decode(token);
  }*/
}

export default JWT;