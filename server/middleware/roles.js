const Project = require('../models/project')
const Role = require('../models/role')
require('../models/task')
const mongoose = require('mongoose')

module.exports = {
  /**
   * Роль админа
   */
  admin (req, res, next) {
    if (!res.locals.user.isAdmin) {
      return res.send({
        success: false,
        status: 403,
        message: 'Access denied'
      })
    }

    next()
  },
  /**
   * Владелец проекта
   */
  async projectOwner (req, res, next) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const id = req.params.id

    const project = await Project.findOne({
      $and: [{ _id: id }, { owner: userId }]
    }).lean()

    if (!project) {
      return res.send({
        success: true,
        status: 403,
        errors: 'Access denied',
        message:
          'The project was not found or the user cannot execute this method'
      })
    }

    next()
  },
  /**
   * Группа редактор проекта (admin, manager)
   */
  async projectEditor (req, res, next) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const id = req.params.id

    const roles = await Role.find({ id: { $in: ['admin', 'manager'] } })

    if (roles.length !== 2) {
      return res.send({
        success: true,
        status: 400,
        errors: 'One of the roles not found'
      })
    }

    const project = await Project.findOne({
      $and: [
        { _id: id },
        {
          members: {
            $elemMatch: {
              $or: [
                { role: roles[0]._id, user: userId },
                { role: roles[1]._id, user: userId }
              ]
            }
          }
        }
      ]
    }).lean()

    if (!project) {
      return res.send({
        success: true,
        status: 403,
        errors: 'Access denied',
        message:
          'The project was not found or the user cannot execute this method'
      })
    }
    console.log('project editor')
    next()
  }
}
