const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    id: {
      type: String,
      required: true
    },
    slug: String,
    assign: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'project'
    },
    timeEstimate: Number,
    timeElapsed: Number,
    type: String,
    status: String,
    priority: Number,
    storyPoint: Number,
    comments: [String]
  },
  {
    timestamps: true
  }
)

taskSchema.index({
  title: 'text',
  slug: 'text'
})

module.exports = mongoose.model('task', taskSchema)
