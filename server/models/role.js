const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: String
})

module.exports = mongoose.model('role', roleSchema)
