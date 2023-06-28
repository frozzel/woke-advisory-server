const mongoose = require('mongoose');// import mongoose
mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGODB_URI).// connect to mongodb
    then(()=>{
        console.log('');// log success
        console.log('🤑🤑🤑  Mongo db connection successful  🤑🤑🤑');// log success
        console.log('');// log success
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');// log success
    })
    .catch((err)=>{
        console.log('');
        console.log('😈😈😈     Mongo db connection error     😈😈😈');// log error
        console.log('');
        console.log('🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬');
        console.log(err);// log error
    });
