const Group = require('../models/group')
const User = require('../models/user')

module.exports = {
  /**
   * Создание новой группы
   */
  create: async (req, res, next) => {
    const newGroup = new Group(req.body)
    const userId = res.locals.userId
    const user = await User.findById(userId)

    newGroup.userId = userId

    await newGroup.save((err, group) => {
      if (err) {
        // Дубликат slug
        if (err.name === 'MongoError' && err.code === 11000) {
          return res.send({
            success: false,
            status: 409,
            error: err,
            message: `Slug ${req.body.slug} is exist`
          })
        }
        if (err.errors.title) {
          return res.send({
            success: false,
            status: 409,
            errors: err.errors,
            message: `Title must not be empty`
          })
        }
        if (err.errors.slug) {
          return res.send({
            success: false,
            status: 409,
            errors: err.errors,
            message: `Slug must not be empty`
          })
        }
      } else {
        res.send({
          success: true,
          status: 200,
          data: newGroup
        })
      }
    })

    user.groups.push(newGroup.id)

    await user.save()
  },
  /**
   * Обновление группы
   */
  update: async (req, res, next) => {
    const userId = res.locals.userId
    const groupId = req.params.id
    const updateGroup = req.body

    await Group.findOneAndUpdate(
      { _id: groupId, userId },
      updateGroup,
      {
        new: true, // возврат уже обновленного документа
        runValidators: true // включение валидации при обновлении
      },
      (err, group) => {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // Дубликат slug
            return res.send({
              success: false,
              status: 409,
              error: err.message,
              message: `Slug ${req.body.slug} is exist`
            })
          }
          if (err.errors.title) {
            return res.send({
              success: false,
              status: 409,
              errors: err.errors,
              message: `Title must not be empty`
            })
          }
          if (err.errors.slug) {
            return res.send({
              success: false,
              status: 409,
              errors: err.errors,
              message: `Slug must not be empty`
            })
          }
        } else {
          res.send({
            success: true,
            status: 200,
            data: group
          })
        }
      }
    )
  },
  /**
   * Удаление группы
   */
  delete: async (req, res, next) => {
    const userId = res.locals.userId
    const groupId = req.params.id

    await Group.findOneAndRemove({ _id: groupId, userId }, (err, group) => {
      if (err) {
        return res.send({
          success: false,
          status: 400,
          message: 'Something wrong'
        })
      }
      if (!group) {
        res.send({
          success: false,
          status: 404,
          message: 'Group not found'
        })
      } else {
        // Удаление связанной группы у юзера
        User.findOneAndUpdate(
          { _id: userId },
          { $pull: { groups: groupId } },
          (err, user) => {
            if (err) {
              return res.send({
                success: false,
                status: 400,
                message: 'Something wrong'
              })
            } else {
              res.send({
                success: true,
                status: 200,
                message: `Group: ${group.title} is deleted`,
                data: group
              })
            }
          }
        )
      }
    })
  },
  /**
   * Получение конкретной группы
   */
  getGroup: async (req, res, next) => {
    const userId = res.locals.userId
    const groupId = req.params.id

    await Group.findOne({ _id: groupId, userId }, (err, group) => {
      if (err) {
        return res.send({
          success: false,
          status: 400,
          message: 'Something wrong'
        })
      }
      if (!group) {
        return res.send({
          success: false,
          status: 404,
          message: 'Group not found'
        })
      }

      res.send({
        success: true,
        status: 200,
        group
      })
    })
  },
  /**
   * Получение списка групп пользователя
   */
  getGroups: async (req, res, next) => {
    const userId = res.locals.userId
    const user = await User.findById(userId)
    let sort = req.query.sort || { createdAt: -1 }
    const limit = Number(req.query.limit) || 10
    const total = await Group.find({ userId }).count()
    const page = Number(req.query.page) || 1
    const pageTotal = total < limit ? 1 : Math.ceil(total / limit)
    const skip = page * limit - limit

    // Если пришла сортировка ввиде query string
    if (typeof sort === 'string') sort = JSON.parse(sort)

    /**
     * Получение списка групп с включенными дополнительными полями,
     * с фильтрацией и лимитом на выдачу
     */
    await Group.aggregate(
      [
        // Фильтрация по конкретному юзер
        {
          $match: { userId: user._id }
        },
        // Поиск
        {
          /**
           * Поиск на предмет: находится ли текущая итерируемая группа
           * в поле groupsFavorite
           */
          $lookup: {
            from: 'users', // Поиск в коллекции users
            localField: '_id', // Текущий id группы
            foreignField: 'groupsFavorite', // В поле groupsFavorite
            as: 'groupsInUserGroupsFavorite' // Сохраняем как массив
          }
        },
        {
          /**
           * Поиск на предмет: находится ли текущая итерируемая группа
           * в поле groups
           */
          $lookup: {
            from: 'users', // Поиск в коллекции users
            localField: '_id', // Текущий id группы
            foreignField: 'groups', // В поле groups
            as: 'groupsInUserGroups' // Сохраняем как массив
          }
        },
        // Объединение в массив для выдачи
        {
          $project: {
            _id: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: 1,
            title: 1,
            slug: 1,
            description: 1,
            favorite: {
              $cond: {
                // Если id группы совпадают ставить true, в противном случае false
                if: {
                  $eq: [
                    '$groupsInUserGroupsFavorite._id',
                    '$groupsInUserGroups._id'
                  ]
                },
                then: true,
                else: false
              }
            }
          }
        },
        // Сортировка
        {
          $sort: sort
        },
        // Пропуск кол-во записей
        {
          $skip: skip
        },
        // Лимит на выдачу
        {
          $limit: limit
        }
      ],
      (err, groups) => {
        if (err) {
          return res.send({
            success: false,
            status: 400,
            error: err,
            message: 'Something wrong'
          })
        }

        if (!groups.length) {
          return res.send({
            success: false,
            status: 404,
            message: 'Groups not found'
          })
        }
        // Формирование выдачи с включением мета информации для построения пагинации
        const output = {
          success: true,
          status: 200,
          sort,
          total,
          limit,
          page,
          pageTotal,
          data: groups
        }

        res.send(output)
      }
    )
  },
  /**
   * Получение списка избранных групп
   */
  getFavoriteGroups: async (req, res, next) => {
    const userId = res.locals.userId
    const user = await User.findById(userId)

    await Group.find({ _id: { $in: user.groupsFavorite } }, (err, groups) => {
      if (err) {
        return res.send({
          success: false,
          status: 400,
          message: 'Something wrong'
        })
      }
      if (!groups.length) {
        return res.send({
          success: false,
          status: 404,
          message: 'Groups not found'
        })
      }

      res.send({
        success: true,
        status: 200,
        data: groups
      })
    })
  },
  /**
   * Установка группы как избранная для пользователя.
   * А так же обратное действие.
   */
  toggleFavorite: async (req, res, next) => {
    const userId = res.locals.userId
    const groupId = req.params.id

    await Group.findOne({ _id: groupId, userId }, (err, group) => {
      if (err) {
        return res.send({
          success: false,
          status: 400,
          message: 'Something wrong'
        })
      }
      if (!group) {
        return res.send({
          success: false,
          status: 404,
          message: 'Group not found'
        })
      }

      if (req.body.value) {
        User.update(
          { _id: userId },
          { $addToSet: { groupsFavorite: group.id } },
          (err, user) => {
            if (err) {
              res.send({
                success: false,
                status: 400,
                message: 'Something wrong'
              })
            } else {
              res.send({
                success: true,
                status: 200,
                message: 'Group set as favorite'
              })
            }
          }
        )
      } else {
        User.update(
          { _id: userId },
          { $pull: { groupsFavorite: group._id } },
          (err, user) => {
            if (err) {
              res.send({
                success: false,
                status: 400,
                message: 'Something wrong'
              })
            } else {
              res.send({
                success: true,
                status: 200,
                message: 'Group unset as favorite'
              })
            }
          }
        )
      }
    })
  }
}
