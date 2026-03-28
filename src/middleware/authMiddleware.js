import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: 'Користувача не знайдено' });
      }

      return next();
    } catch (err) {
      console.error('JWT Error:', err.message);
      return res
        .status(401)
        .json({ error: 'Не авторизовано, токен недійсний' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Немає токена, доступ заборонено' });
  }
};
