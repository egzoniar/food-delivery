const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, 'fresca_admin')
    req.adminData = decoded
    next()
  } 
  catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    })
  }
}