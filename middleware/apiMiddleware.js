const apiMiddleware = (req, res, next) => {
  if (req.method === "GET" || req.method === "POST") {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
  }

  next();
};

module.exports = apiMiddleware;
