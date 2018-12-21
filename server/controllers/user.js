const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Joi = require('joi')

module.exports = {
  /**
   * Регистрация
   */
  async signUp (req, res, next) {
    // REST валидация
    const schema = {
      name: Joi.string()
        .min(3)
        .required(),
      username: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(5)
        .required()
    }

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: 'There were problems on creating account:'
      })
    }

    const newUser = new User(req.body)

    try {
      const user = await newUser.save()

      res.send({
        success: true,
        status: 200,
        message: 'Congratulations with the registration'
      })

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      })

      const mailOptions = {
        from: '"Taskill" taskill@antonreshetov.com',
        to: user.email,
        subject: 'Congratulations with the registration',
        text: `To sign in <a href="${
          process.env.CLIENT_URI
        }/signin">follow the link</a> and enter your email and password`,
        html: `To sign in <a href="${
          process.env.CLIENT_URI
        }/signin">follow the link</a> and enter your email and password`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
      })
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Дубликат email
        return res.send({
          success: false,
          status: 409,
          errors: {
            email: {
              message: `Email ${req.body.email} is exist`
            }
          },
          message: `There were problems on creating account:`
        })
      }
    }
  },
  /**
   * Авторизация
   */
  async signIn (req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        res.clearCookie('token')
        return res.send({
          success: false,
          status: 401,
          errors: {
            user: {
              message: 'Invalid login or password'
            }
          },
          message: 'There were problems on sign in:'
        })
      }

      const check = user.checkPassword(req.body.password)

      if (check) {
        const token = user.generateAuthToken()

        res.cookie('token', token)
        res.send({
          success: true,
          status: 200,
          data: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
          },
          token
        })
      } else {
        res.clearCookie('token')
        res.send({
          success: false,
          status: 401,
          errors: {
            user: {
              message: 'Invalid login or password'
            }
          },
          message: 'There were problems on sign in:'
        })
      }
    } catch (err) {
      res.clearCookie('token')
      return res.send({
        success: false,
        status: 400,
        message: 'There were problems on sign in:'
      })
    }
  },
  /**
   * Выход
   */
  logout (req, res, next) {
    res.clearCookie('token')
    res.send({
      success: true,
      status: 200,
      message: 'Successfully log out'
    })
  },
  /**
   * Сбрасывание пароля.
   * Генерирование token.
   * Отправка сообщения на email с ссылкой на сброс пароля
   */
  async resetPassword (req, res, next) {
    // REST валидация
    const schema = {
      email: Joi.string()
        .email()
        .required()
    }

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 401,
        errors: error.details[0].message,
        message: 'There were problems on reset password:'
      })
    }

    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        return res.send({
          success: false,
          status: 404,
          errors: {
            user: {
              message: `User with ${req.body.email} not found`
            }
          },
          message: 'There were problems on reset password:'
        })
      }

      const resetToken = jwt.sign(
        {
          userId: user.id,
          email: user.email
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '24h'
        }
      )

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      })

      const mailOptions = {
        from: '"Taskill" <taskill@antonreshetov.com>',
        to: user.email,
        subject: 'Reset password',
        text: `You recently request a password reset link.
        To reset password, please click the link <a href="${
  process.env.CLIENT_URI
}/reset/verification?token=${resetToken}">reset password</a>`,
        html: `You recently request a password reset link.
        To reset password, please click the link <a href="${
  process.env.CLIENT_URI
}/reset/verification?token=${resetToken}">reset password</a>`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
      })

      res.send({
        success: true,
        status: 200,
        message: `The reset password link was successfully sent to ${
          user.email
        }`
      })
    } catch (err) {
      return res.json({
        success: false,
        status: 400,
        errors: err,
        message: 'Something wrong'
      })
    }
  },
  /**
   * Проверка токена при сбрасывании пароля
   */
  async resetPasswordVerifyToken (req, res, next) {
    const token = req.params.token

    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        res.send({
          success: false,
          status: 401,
          message: 'Password link has expired'
        })
      } else {
        res.clearCookie('token')
        res.send({
          success: true,
          status: 200,
          data: decode
        })
      }
    })
  },
  /**
   * Обновление пароля
   */
  async passwordUpdate (req, res, next) {
    const userId = req.body.userId
    const newPassword = req.body.password

    const schema = {
      userId: Joi.string().required(),
      password: Joi.string().required()
    }

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: 'There were problems on reset password:'
      })
    }

    try {
      const user = await User.findById(userId)

      user.password = newPassword
      await user.save()

      res.send({
        success: true,
        status: 200,
        message: 'Password updated successfully'
      })
    } catch (err) {
      return res.send({
        success: false,
        status: 400,
        message: 'Something wrong'
      })
    }
  },
  /**
   * Список всех пользователей
   * @param {string} req.query.s - поиск по name или username
   * @param {string} req.query.id- поиск по id
   */
  async getUsers (req, res) {
    const search = req.query.s
    const ids = req.query.id
    let limit = req.query.limit || 30
    const re = new RegExp(`^${search}`, 'i')

    let query = {}

    if (search) {
      query = {
        $or: [{ username: { $regex: re } }, { name: { $regex: re } }]
      }
    }

    if (ids) {
      query = {
        _id: { $in: ids }
      }
      limit = 0
    }

    const users = await User.find(query)
      .populate('passport.role')
      .populate('passport.project', ['key', 'slug'])
      .sort({ username: 1 })
      .limit(limit)
      .select('projects projectsFavorite name username email isAdmin passport')
      .lean()

    res.send({
      success: true,
      status: 200,
      data: users,
      message: 'Users fetched successfully'
    })
  },
  /**
   * Получение данных по юзеру
   * @param {*} req
   * @param {*} res
   */
  async getUserById (req, res) {
    const user = await User.findById(req.params.id)
      .populate('passport.project', ['key', 'slug'])
      .populate('passport.role')
      .select('projects projectsFavorite name username email isAdmin passport')
      .lean()

    res.send({
      success: true,
      status: 200,
      data: user,
      message: 'User fetched successfully'
    })
  }
}
