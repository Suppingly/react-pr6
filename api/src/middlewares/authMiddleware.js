import JWT from './../utils/jwt.js'


export function authMiddleware (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({message: 'No token provided'});

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({message: 'No token provided'});

  try {
    const payload = JWT.verifyToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({message: 'Invalid token'});
  }
}
export function authMiddlewareAlt (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({message: 'No token provided'});

  try {
    const payload = JWT.verifyToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({message: 'Invalid token'});
  }
}
