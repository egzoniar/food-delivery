const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    console.log(req.headers)
    const decoded = jwt.verify(req.headers.token, 'fresca_users')
    req.userData = decoded
    next()
  } 
  catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    })
  }
}