const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const bdUser = process.env.MONGO_DB_USER;
const bdPass = process.env.MONGO_DB_PASS;

const dbURI = `mongodb+srv://${bdUser}:${bdPass}@fitfound-cluster.xsmcnc8.mongodb.net/?retryWrites=true&w=majority&appName=FitFound-Cluster`;

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection successfull'); 
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err.err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

