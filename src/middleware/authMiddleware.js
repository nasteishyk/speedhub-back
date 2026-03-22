import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Не авторізовано, токен недійсний' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Немає токена, доступ заборонено' });
  }
};
