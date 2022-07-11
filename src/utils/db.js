const mongoose = require('mongoose')

let connectionDB = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.on('open', (_) => {
        console.log('Database connected');
    });
    mongoose.connection.on('error', (error) => {
        console.log(error);
    });
}

module.exports = connectionDB