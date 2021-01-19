const mongoose = require('mongoose')

module.exports = async () => {
  await mongoose.connect(process.env.DBC, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}