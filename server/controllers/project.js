const Project = require('../models/project')
const User = require('../models/user')
const Task = require('../models/task')
const Role = require('../models/role')
require('../models/task')
const mongoose = require('mongoose')
const Joi = require('joi')

const PROJECT_SCHEMA = Joi.object().keys({
  title: Joi.string()
    .max(255)
    .required(),
  slug: Joi.string()
    .max(255)
    .required(),
  key: Joi.string()
    .min(2)
    .max(10)
    .required(),
  members: Joi.array().required(),
  owner: Joi.string().required(),
  description: Joi.string().allow(''),
  summary: Joi.string().allow(''),
  favoriteColor: Joi.string().allow(null)
})

const TASK_SCHEMA = Joi.object().keys({
  title: Joi.string()
    .required()
    .min(3)
    .max(255),
  description: Joi.string().allow(''),
  type: Joi.string(),
  assign: Joi.string()
    .required()
    .allow(null)
    .allow(''),
  status: Joi.string(),
  priority: Joi.number(),
  storyPoint: Joi.number().allow(null)
})

module.exports = {
  /**
   * Создание нового проекта
   * @param {object} req.body
   */
  async createProject (req, res) {
    const schema = PROJECT_SCHEMA.optionalKeys('members', 'owner')
    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const user = await User.findById(res.locals.user.id)
    const existSlug = await Project.findOne({
      $and: [{ owner: user.id }, { slug: req.body.slug }]
    })
    const existKey = await Project.findOne({
      $and: [{ owner: user.id }, { key: req.body.key }]
    })

    if (existSlug) {
      return res.send({
        success: false,
        status: 400,
        errors: 'Slug must be a uniq',
        message: 'Slug must be a uniq'
      })
    }

    if (existKey) {
      return res.send({
        success: false,
        status: 400,
        errors: 'Key must be a uniq',
        message: 'Key must be a uniq'
      })
    }

    const project = new Project(req.body)
    // Устанавливаем первоначальное значение в 0
    // для последующего инкремента при добавлении нового таска
    // taskIncId является номером таска
    project.taskIncId = 0
    // Добавляем владельца текущего юзера
    project.owner = user.id

    const role = await Role.findOne({ id: 'admin' })
    // Добавляем владельца в участники проекта
    project.members.push({ user, role })
    await project.save()
    // Добавляем в passport юзера запись с id проектом и id роли admin
    user.passport.push({ project, role })
    await user.save()

    res.send({
      success: true,
      status: 200,
      message: 'Project successfully created'
    })
  },
  /**
   * Создание таска в проекте
   * @param {*} req.body - данные таска
   */
  async createProjectTask (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)

    const schema = TASK_SCHEMA.optionalKeys(
      'assign',
      'priority',
      'storyPoint',
      'status'
    )
    // Поскольку согласно схеме, если присутствует свойство assign,
    // mongoose ожидает ObjectID для референсной связи,
    // то необходимо удалить assign если свойство пришло, но оно пустое
    if ('assign' in req.body && req.body.assign.length === 0) {
      delete req.body.assign
    }

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const project = await Project.findById(projectId)

    project.taskIncId += 1

    const taskBody = Object.assign({}, req.body, {
      id: project.taskIncId,
      slug: project.key + '-' + project.taskIncId
    })

    const task = new Task(taskBody)

    task.project = project

    await task.save()
    project.tasks.push(task)
    await project.save()

    res.send({
      success: true,
      status: 200,
      message: 'Task successfully created'
    })
  },
  /**
   * Получение списка проектов где юзер является членом
   * В получаемый список добавить поле favorite
   * @param {string} req.query.sort - порядок сортировки
   */
  async getProjects (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const sort = req.query.sort || { createdAt: -1 }
    const user = await User.findById(userId)

    if (!user) {
      return res.send({
        success: false,
        status: 401,
        errors: `User not found or invalid token`,
        message: `User not found or invalid token`
      })
    }

    const projects = await Project.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              user: { $eq: user._id }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerData'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          key: 1,
          description: 1,
          summary: 1,
          favorite: {
            $in: ['$_id', user.projectsFavorite]
          },
          favoriteColor: 1,
          createdAt: 1,
          owner: 1,
          ownerUserName: { $arrayElemAt: ['$ownerData.username', 0] }
        }
      },
      {
        $sort: sort
      }
    ])

    res.send({
      success: true,
      status: 200,
      data: projects,
      message: 'Projects fetched successfully'
    })
  },
  /**
   * Получение проекта по id где юзер является членом
   * @param {string} req.params.id - id проекта
   */
  async getProjectById (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const project = await Project.findOne({
      $and: [
        {
          _id: projectId
        },
        {
          members: {
            $elemMatch: {
              user: {
                $eq: userId
              }
            }
          }
        }
      ]
    }).populate('members.user', ['name', 'username'])

    res.send({
      success: true,
      status: 200,
      data: project,
      message: 'Project fetched successfully'
    })
  },
  /**
   * Получение проекта по id со списком членов проекта
   * @param {string} req.params.id - id проекта
   */
  async getProjectByIdMembers (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const projectId = mongoose.Types.ObjectId(req.params.id)

    const project = await Project.findOne({
      $and: [
        {
          _id: projectId
        },
        {
          members: {
            $elemMatch: {
              user: {
                $eq: userId
              }
            }
          }
        }
      ]
    }).populate('members.user', ['name', 'username'])

    if (!project) {
      return res.send({
        success: false,
        status: 404,
        errors: `Project not found`,
        message: `Project not found`
      })
    }

    res.send({
      success: true,
      status: 200,
      data: project,
      message: 'Project fetched successfully'
    })
  },
  /**
   * Получение проекта по username и slug, а так же данных по членам проекта
   * @param {string} req.params.username - уникальное имя пользователя
   * @param {string} req.params.slug - slug проекта
   */
  async getProjectByOwnerBySlug (req, res) {
    const username = req.params.username
    const slug = req.params.slug
    const user = await User.findOne({
      username
    })

    if (!user) {
      return res.send({
        success: false,
        status: 404,
        errors: `User with name: ${username} not found`,
        message: `User with name: ${username} not found`
      })
    }

    const project = await Project.findOne({
      $and: [
        {
          slug: slug
        },
        {
          members: {
            $elemMatch: {
              user: {
                $eq: user._id
              }
            }
          }
        }
      ]
    })
      .populate('members.user', 'name username')
      .populate('members.role')

    if (!project) {
      return res.send({
        success: false,
        status: 404,
        errors: `Project with name: ${slug} not found`,
        message: `Project with name: ${slug} not found`
      })
    }

    res.send({
      success: true,
      status: 200,
      data: project,
      message: 'Project fetched successfully'
    })
  },
  /**
   * Получение списка тасков по username и slug
   * @param {string} req.params.username - уникальное имя пользователя
   * @param {string} req.params.slug - slug проекта
   */
  async getProjectByOwnerBySlugTasks (req, res) {
    const username = req.params.username
    const taskStatus = req.query.taskStatus
    const search = req.query.s || ''
    const slug = req.params.slug
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    let sort = req.query.sort || { createdAt: -1 }
    let total
    let pageTotal
    const skip = page * limit - limit
    console.warn('==========')
    console.warn(skip, page, limit)
    console.warn(page * limit - limit)
    // Конвертация значений в сортировке в number
    // { createdAt: '-1' } => { createdAt: -1 }
    Object.keys(sort).map(key => (sort[key] = Number(sort[key])))

    const user = await User.findOne({ username })

    if (!user) {
      return res.send({
        success: false,
        status: 404,
        errors: `User with name: ${username} not found`,
        message: `User with name: ${username} not found`
      })
    }

    const project = await Project.findOne({
      $and: [
        {
          slug: slug
        },
        {
          members: {
            $elemMatch: {
              user: {
                $eq: user._id
              }
            }
          }
        }
      ]
    })

    if (!project) {
      return res.send({
        success: false,
        status: 404,
        errors: `Project with name: ${slug} not found`,
        message: `Project with name: ${slug} not found`
      })
    }

    // Проверяем query параметр taskStatus на содержание '!' в начале строки
    // для отрицательного поиска ?taskStatus=!closed
    let status = {}
    if (taskStatus) {
      const isEqual = !/^!\w+/.test(taskStatus)
      if (isEqual) {
        status = {
          $eq: taskStatus
        }
      }
      if (!isEqual) {
        status = {
          $not: {
            $eq: taskStatus.substr(1)
          }
        }
      }
    } else {
      status = {
        $not: {
          $eq: ''
        }
      }
    }

    let query = [
      {
        $match: {
          project: project._id,
          status
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assign',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          title: 1,
          comments: 1,
          description: 1,
          summary: 1,
          type: 1,
          status: 1,
          priority: 1,
          storyPoint: 1,
          slug: 1,
          project: 1,
          createdAt: 1,
          assign: {
            _id: '$user._id',
            name: '$user.name',
            username: '$user.username'
          }
        }
      },
      {
        $sort: sort
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    // Если поисковой запрос ?s= не пустой, добавляем в начало запроса к БД
    // текстовый поиск в pipeline
    if (search) {
      query.unshift({
        $match: {
          $text: {
            $search: search
          }
        }
      })
      // Получаем кол-во тасков по статусу и результата поиска
      total = await Task.find({
        $and: [
          {
            $text: {
              $search: search
            }
          },
          {
            project: project._id
          },
          {
            status
          }
        ]
      }).count()
    } else {
      // Получаем кол-во тасков по статусу
      total = await Task.find({
        $and: [{ project: project._id }, { status }]
      }).count()
    }

    const tasks = await Task.aggregate(query)

    // Высчитывает кол-ва страниц
    pageTotal = total < limit ? 1 : Math.ceil(total / limit)

    res.send({
      success: true,
      status: 200,
      data: tasks,
      sort,
      total,
      limit,
      page,
      pageTotal,
      message: 'Tasks fetched successfully'
    })
  },
  /**
   * Получение таска по username и slug
   * @param {*} req.param.username - username
   * @param {*} req.param.slug - slug проекта
   * @param {*} req.param.taskSlug - slug таска
   */
  async getProjectByOwnerBySlugByTask (req, res) {
    const username = req.params.username
    const slug = req.params.slug
    const taskSlug = req.params.taskSlug

    const user = await User.findOne({ username })

    if (!user) {
      return res.send({
        success: false,
        status: 404,
        errors: `User with name: ${username} not found`,
        message: `User with name: ${username} not found`
      })
    }

    const project = await Project.findOne({
      $and: [
        {
          slug: slug
        },
        {
          members: {
            $elemMatch: {
              user: {
                $eq: user._id
              }
            }
          }
        }
      ]
    })

    if (!project) {
      return res.send({
        success: false,
        status: 404,
        errors: `Project with name: ${slug} not found`,
        message: `Project with name: ${slug} not found`
      })
    }

    const task = await Task.findOne({
      slug: taskSlug
    }).populate('assign', ['_id', 'name', 'username'])

    if (!task) {
      return res.send({
        success: false,
        status: 404,
        errors: `Task with slug: ${slug} not found`,
        message: `Task with slug: ${slug} not found`
      })
    }

    res.send({
      success: true,
      status: 200,
      data: task,
      message: 'Task fetched successfully'
    })
  },
  /**
   * Проверка является ли пользователь владельцем проекта
   * @param {string} req.params.id - user id
   * @param {string} req.params.slug - slug проекта
   */
  async getIsOwnerByProject (req, res) {
    const userId = req.params.id
    const slug = req.params.slug

    const project = await Project.findOne({
      $and: [
        {
          slug: slug
        },
        {
          owner: userId
        }
      ]
    }).lean()

    if (!project) {
      return res.send({
        success: true,
        status: 200,
        data: false,
        message: 'User is not owner'
      })
    }

    res.send({
      success: true,
      status: 200,
      data: true,
      message: 'User is owner'
    })
  },
  /**
   * Получение сгруппированных по статусам кол-ва тасков
   */
  async getProjectByIdCounts (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const tasks = await Task.aggregate([
      {
        $match: {
          project: projectId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    res.send({
      success: true,
      status: 200,
      data: tasks,
      message: 'Count by project fetched successfully'
    })
  },
  /**
   * Получение списка избранных проектов
   */
  async getFavoriteProjects (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const user = await User.findById(userId)
    const sort = req.query.sort || { title: 1 }

    const projects = await Project.find({
      _id: { $in: user.projectsFavorite }
    })
      .populate('owner', 'username')
      .sort(sort)
      .lean()

    res.send({
      success: true,
      status: 200,
      data: projects,
      message: 'Favorite projects fetched successfully'
    })
  },
  /**
   * Обновление проекта
   * @param {string} req.params.id - id проекта
   * @param {object} req.body - данные по проекту
   */
  async updateProjectById (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const schema = PROJECT_SCHEMA.optionalKeys(
      'title',
      'slug',
      'key',
      'description',
      'summary',
      'members',
      'owner',
      'favoriteColor'
    ).forbiddenKeys('members')

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const existSlug = await Project.findOne({
      $and: [{ owner: userId }, { slug: req.body.slug }]
    })

    if (existSlug) {
      return res.send({
        success: false,
        status: 400,
        errors: 'Slug must be a uniq',
        message: 'Slug must be a uniq'
      })
    }

    const project = await Project.findOneAndUpdate({ _id: projectId }, req.body)

    if (project) {
      res.send({
        success: true,
        status: 200,
        message: 'Project successfully updated'
      })
    } else {
      res.send({
        success: false,
        status: 400,
        message: 'Project not found'
      })
    }
  },
  /**
   * Изменить ключ проекта и его тасков
   * @param {object} req.body.key - ключ проекта
   */
  async updateProjectAndTasksKey (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const schema = PROJECT_SCHEMA.optionalKeys(
      'title',
      'slug',
      'description',
      'summary',
      'members',
      'owner',
      'favoriteColor'
    )

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const existKey = await Project.findOne({
      $and: [{ owner: userId }, { key: req.body.key }]
    })

    if (existKey) {
      return res.send({
        success: false,
        status: 400,
        errors: 'Key must be a uniq',
        message: 'Key must be a uniq'
      })
    }

    const key = req.body.key.toUpperCase()

    const project = await Project.findById(projectId)

    project.key = key
    project.save()

    const tasks = await Task.find({
      project: project._id
    })

    tasks.forEach(task => {
      task.slug = task.slug.replace(task.slug, `${key}-${task.id}`)
      task.save()
    })

    res.send({
      success: true,
      status: 200,
      message: 'Project and tasks key changed successfully'
    })
  },
  /**
   * Добавление участников в проект
   * @param {string} req.params.id - id проекта
   * @param {array} req.body.members - список участников и роли
   * {user: id, role: id}
   */
  async addMembersByProject (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const members = req.body.members

    const schema = PROJECT_SCHEMA.optionalKeys(
      'title',
      'slug',
      'key',
      'description',
      'summary',
      'owner',
      'favoriteColor'
    ).requiredKeys('members')

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const project = await Project.findById(projectId)

    // Добавляем нового участника в members в проекте
    // и делаем новую запись в passport юзера
    members.forEach(async item => {
      const userId = mongoose.Types.ObjectId(item.user)
      const roleId = mongoose.Types.ObjectId(item.role)

      const isMemberInProject = project.members.find(
        item => item.user.toString() === userId.toString()
      )
      if (!isMemberInProject) project.members.push(item)

      const user = await User.findById(userId)

      const isProjectInPassport = user.passport.find(
        item => item.project.toString() === projectId.toString()
      )
      if (!isProjectInPassport) {
        user.passport.push({
          project: projectId,
          role: roleId
        })
      }
      await user.save()
    })

    await project.save()

    res.send({
      success: true,
      status: 200,
      message: 'Members successfully added'
    })
  },
  /**
   * Удаление участников из проекта
   * @param {string} req.params.id - id проекта
   * @param {array} req.body.members - список участников
   */
  async removeMembersByProject (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const members = req.body.members

    const schema = PROJECT_SCHEMA.optionalKeys(
      'title',
      'slug',
      'key',
      'description',
      'summary',
      'owner',
      'favoriteColor'
    ).requiredKeys('members')

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const project = await Project.findById(projectId)

    // Удаляем участника из members в проекте,
    // запись в passport у юзера, а так же проект из projectsFavorite
    members.forEach(async item => {
      const userId = mongoose.Types.ObjectId(item)

      const isMemberInProject = project.members.findIndex(
        item => item.user.toString() === userId.toString()
      )

      if (isMemberInProject >= 0) {
        project.members.splice(isMemberInProject, 1)
      }

      const user = await User.findById(userId)

      const isProjectInPassport = user.passport.findIndex(
        item => item.project.toString() === projectId.toString()
      )

      if (isProjectInPassport >= 0) {
        user.passport.splice(isProjectInPassport, 1)
      }

      await user.save()

      await user.update({
        $pull: {
          projectsFavorite: projectId
        }
      })
    })

    await project.save()

    res.send({
      success: true,
      status: 200,
      message: 'Members successfully removed'
    })
  },
  /**
   * Обновление роли юзера по проекту
   * @param {*} req.body.user - юзер id
   * @param {*} req.body.roles - роль id
   */
  async updateMemberRoleByProject (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)
    const userId = mongoose.Types.ObjectId(req.body.user)
    const roleId = mongoose.Types.ObjectId(req.body.role)

    const schema = Joi.object().keys({
      user: Joi.string().required(),
      role: Joi.string().required()
    })

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      return res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        'members.user': userId
      },
      {
        'members.$.role': roleId
      }
    )

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        'passport.project': projectId
      },
      {
        'passport.$.role': roleId
      }
    )

    if (!project || !user) {
      return res.send({
        success: false,
        status: 400,
        errors: 'Project or user not found',
        message: 'Project or user not found'
      })
    }

    return res.send({
      success: true,
      status: 200,
      message: 'User role successfully updated'
    })
  },
  /**
   * Удаление проекта
   * @param {string} req.params.id - id проекта
   */
  async deleteProjectById (req, res) {
    const projectId = mongoose.Types.ObjectId(req.params.id)

    const project = await Project.findById(projectId)

    if (!project) {
      return res.send({
        success: false,
        status: 404,
        errors: 'Project not found',
        message: 'Project not found'
      })
    }

    // Найти всех членов в проекте
    // Удалить у каждого члена из passport запись
    // Удалить у каждого члена проекта, проект из projectsFavorite
    project.members.forEach(async member => {
      const user = await User.findById(member.user)
      const passportIndex = user.passport.findIndex(
        item => item.project.toString() === project._id.toString()
      )
      const favProjectIndex = user.projectsFavorite.findIndex(
        project => project.toString() === project._id.toString()
      )

      if (favProjectIndex >= 0) {
        user.projectsFavorite.splice(favProjectIndex, 1)
      }

      if (passportIndex >= 0) {
        user.passport.splice(passportIndex, 1)
      }

      await user.save()
    })

    await project.remove()

    res.send({
      success: true,
      status: 200,
      message: 'Project successfully deleted'
    })
  },
  /**
   * Добавление проекта в избранное у юзера
   * @param {boolean} req.body.value - триггер для добавления или удаления из избранного
   */
  async toggleProjectFavorite (req, res) {
    const userId = mongoose.Types.ObjectId(res.locals.user.id)
    const projectId = mongoose.Types.ObjectId(req.params.id)

    // REST валидация
    const schema = {
      value: Joi.boolean().required()
    }

    const { error } = Joi.validate(req.body, schema)

    if (error) {
      res.send({
        success: false,
        status: 400,
        errors: error.details[0].message,
        message: error.details[0].message
      })
    }

    if (req.body.value) {
      await User.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $addToSet: {
            projectsFavorite: projectId
          }
        }
      )
      res.send({
        success: true,
        status: 200,
        message: 'Project successfully set favorite'
      })
    } else {
      await User.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $pull: {
            projectsFavorite: projectId
          }
        }
      )
      res.send({
        success: true,
        status: 200,
        message: 'Project successfully unset favorite'
      })
    }
  },
  /**
   * Получение ролей по проекту
   * @param {*} req
   * @param {*} res
   */
  async getProjectRoles (req, res) {
    const roles = await Role.find({})

    res.send({
      success: true,
      status: 200,
      data: roles,
      message: 'Roles fetched successfully'
    })
  }
}
