import { body, validationResult } from 'express-validator';

export const registerValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
