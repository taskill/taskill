# Taskill

> WIP

The goal of this project is to create an open source independent task manager on a javascript stack that can be use locally or in web. Idea of creation inspired by redmine

<img src="./screenshot.png">

## Install

Clone the repo and install client and server parts. Also on the local machine must be installed mongoDB

```bash
npm i
cd server npm i
```

Fill in the client and server environment variables

### Example

`server/.env`

```bash
# Server
PORT=3000 # start server on port 3000 - http://localhost:3000/, http://localhost:3000/api
DEBUG=false # express debug mode
CLIENT_URI=http://localhost:8080 # url client for CORS permission
MONGO_URI=mongodb://localhost/taskill # mongo url
SECRET_KEY=KnVSbaxCH3pWSexCsb # random string as salt to generate token
MAIL_HOST=smtp.yandex.ru # smtp server email client
MAIL_PORT=465 # email port
MAIL_USER=john@dohn.com # email login
MAIL_PASS=password # email password

```

`.env`

```bash
# Client
PORT=8080 # start client on port 8080 - http://localhost:8080
VUE_APP_SERVER_API=http://localhost:3000/api
```

## Roadmap

### Client

- [x] Layout
- [ ] Sing in / Sing up / Reset
- [ ] Projects
- [ ] Project
- [ ] Project settings
- [ ] Project add new
- [ ] Tasks
- [ ] Task
- [ ] Task add new view
- [ ] User profile view

### Server

- [x] Sing in / Sing up / Reset
- [x] Authorization by JWT
- [x] Project CRUD
- [x] Project add to favorite
- [ ] Task CRUD
- [x] Task assignee
- [x] Members & transfer
- [x] Roles
- [ ] Comments
