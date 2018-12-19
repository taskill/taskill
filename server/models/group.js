const mongoose = require('mongoose')
const Schema = mongoose.Schema

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

const groupSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
)

const Group = mongoose.model('group', groupSchema)

module.exports = Group
