const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.connect(process.env.MONGO_URI)

const faker = require('faker')
const { timesAsync } = require('../utils/helper')
const User = require('../models/user')
const Project = require('../models/project')
const Task = require('../models/task')
const Role = require('../models/role')

async function seed () {
  await User.collection.drop()
  await Project.collection.drop()
  await Task.collection.drop()

  // Создаем роли
  const roles = ['admin', 'manager']

  roles.forEach(async i => {
    const role = new Role({
      id: i,
      name: i
    })

    await role.save()
  })

  // Создаем админа
  const user = new User({
    name: 'Admin',
    email: 'reshetov.art@gmail.com',
    username: 'antonreshetov',
    password: '123456',
    isAdmin: true
  })

  await user.save()

  const project = new Project({
    title: 'Awesome Project',
    slug: 'awesome-project',
    key: 'AP',
    description: faker.lorem.sentence(3),
    taskIncId: 0
  })
  project.owner = user
  project.members.push(user)
  await project.save()

  user.projectsFavorite.push(project)
  user.save()

  project.taskIncId += 1
  await project.save()

  const task = new Task({
    title: 'New task',
    description: 'Some text',
    id: project.taskIncId,
    slug: project.key + '-' + project.taskIncId,
    assign: user.id,
    project: project,
    status: 'backlog',
    priority: 0,
    storyPoint: 10
  })

  await task.save()
  project.tasks.push(task)
  await project.save()

  await timesAsync(4, async n => {
    // Создаем пользователя
    const name = faker.name.firstName()

    const user = new User({
      name: name,
      username: name.toLocaleLowerCase(),
      email: faker.internet.email(),
      password: '123456'
    })
    await user.save()

    // Создаем проект
    const project = new Project({
      title: `Project-${n + 1}`,
      slug: `project-${n + 1}`,
      key: faker.hacker
        .adjective()
        .slice(0, 3)
        .toUpperCase(),
      description: faker.lorem.sentence(3),
      taskIncId: 0
    })
    // Добавляем проекту владельца
    project.owner = user.id
    // У проекта есть члены, поэтому добавляем владельца как члена проекта
    project.members.push(user.id)
    await project.save()

    // Добавляем пользователю связь с проектом
    user.projects.push(project.id)
    await user.save()
  })

  const users = await User.find()
  const projects = await Project.find()

  // Добавляем к первому проект двух новых членов
  projects[0].members.push(users[2].id)
  projects[0].members.push(users[4].id)
  // Добавляем ко второму и третьему проекту первого юзера (админа)
  projects[1].members.push(users[0].id)
  projects[2].members.push(users[0].id)

  await projects[0].save()
  await projects[1].save()
  await projects[2].save()

  console.log(chalk.green('\nDB successfully seeded 👍\n'))

  process.exit()
}

seed()
