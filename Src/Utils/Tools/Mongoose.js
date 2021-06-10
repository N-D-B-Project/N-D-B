const mongoose = require('mongoose');
const config = require('../../Config/Config.json');
const { mongouri } = require('./Variables');
const Logger = require('./Logger');

module.exports = {
  init: () => {
    const Connect = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    if (!process.env.MongoURI) Logger.error(`Você deve definir o link do MongoDB para o Client.`)
    mongoose.connect(process.env.MongoURI, Connect)
    .catch(e => {
      Logger.error(e.message)
      this.database = null
    });

    mongoose.connection.on('connected', () => {
        Logger.dtb("Client: MongoDB Conectado!");
    });

    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('err', err => {
      Logger.error(`Mongoose Connection error: ${err.stack}`)
    });

    mongoose.connection.on('disconnected', () => {
      Logger.error(`Mongoose Connection lost`)
    });
  }
}