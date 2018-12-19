const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    salt: String,
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'project'
      }
    ],
    projectsFavorite: [
      {
        type: Schema.Types.ObjectId,
        ref: 'project'
      }
    ],
    passport: [
      {
        _id: false,
        project: {
          type: Schema.Types.ObjectId,
          ref: 'project'
        },
        role: {
          type: Schema.Types.ObjectId,
          ref: 'role'
        }
      }
    ],
    isAdmin: Boolean
  },
  {
    timestamps: true
  }
)
/**
 * Создание виртуального поля для пароля
 * для последующего хеширование пароля
 * и записи в passwordHash модели
 */
userSchema
  .virtual('password')
  .set(function (password) {
    this._plainPassword = password
    if (!password) {
      this.salt = null
      this.passwordHash = null
      return
    }
    this.salt = crypto.randomBytes(128).toString('base64')
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1')
  })
  .get(function () {
    return this._plainPassword
  })
/**
 * Проверка хешировананного пароля
 * @returns {boolean}
 */
userSchema.methods.checkPassword = function (password) {
  if (!password) return false
  if (!this.passwordHash) return false
  return (
    // eslint-disable-next-line eqeqeq
    crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash
  )
}
/**
 * Генерация токена авторизации
 * @returns {object} token
 */
userSchema.methods.generateAuthToken = function () {
  const sign = {
    id: this._id,
    isAdmin: this.isAdmin
  }
  const token = jwt.sign(sign, process.env.SECRET_KEY, {
    expiresIn: '30d'
  })
  return token
}

const User = mongoose.model('user', userSchema)

module.exports = User
