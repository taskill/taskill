const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: String
})

const Role = mongoose.model('role', roleSchema)

module.exports = Role
