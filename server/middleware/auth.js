const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.body.token || req.headers.authorization || req.cookies.token

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        res.send({
          success: false,
          status: 401,
          message: 'Invalid token'
        })
      } else {
        // Запись декодированых данных юзера в переменную
        // для последующей передачи в цикле запросов/ответов
        res.locals.user = decode
        next()
      }
    })
  } else {
    res.send({
      success: false,
      status: 401,
      message: 'Token must not be empty'
    })
  }
}
