const mongoose = require('mongoose');// import mongoose
mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGO_URI).// connect to mongodb
    then(()=>{
        console.log('🤑🤑🤑  Mongo db connection successful  🤑🤑🤑');// log success
    })
    .catch((err)=>{
        console.log('😈😈😈     Mongo db connection error     😈😈😈', err);// log error
    });
