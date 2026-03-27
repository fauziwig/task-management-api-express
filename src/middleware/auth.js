const TokenManager = require('../security/TokenManager');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Missing authentication' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.auth = TokenManager.verifyAccessToken(token);
    
    return next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: error.message });
  }
}

module.exports = auth;
