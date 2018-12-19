const mongoose = require('mongoose')
const Schema = mongoose.Schema

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    description: String,
    summary: String,
    favoriteColor: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    members: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user'
        },
        role: {
          type: Schema.Types.ObjectId,
          ref: 'role'
        }
      }
    ],
    tasks: [
      {
        _id: false,
        type: Schema.Types.ObjectId,
        ref: 'task'
      }
    ],
    taskIncId: Number
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model('project', projectSchema)

module.exports = Project
