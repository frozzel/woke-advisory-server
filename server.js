const express = require('express'); // import express
require('express-async-errors'); // import express-async-errors
const morgan = require('morgan')    // import morgan
const {errorHandler} = require('./utils/error')// import error handler
require('dotenv').config()// import dotenv
require('./config/connections')//   import database connection
const socketio = require('socket.io');


const schoolRouter = require('./routes/school');// import school router
const userRouter = require('./routes/user');// import user router
const actorRouter = require('./routes/actor');// import user router
const movieRouter = require('./routes/movie');// import user router
const reviewRouter = require("./routes/review"); // import review router
const reviewTvRouter = require("./routes/reviewtv"); // import review router
const newsRouter = require("./routes/news"); // import news router
const reviewSchoolRouter = require("./routes/reviewschool"); // import review router
const teacherRouter = require('./routes/teacher');// import teacher router
const alertsSchoolRouter = require("./routes/alertsschool"); // import review router
const reviewsTeacherRouter = require("./routes/reviewsteacher"); // import review router
const alertsTeacherRouter = require("./routes/alertsteacher"); // import review router
const followRouter = require('./routes/follow');// import follow router
const messagesRouter = require('./routes/post');




const adminRouter = require("./routes/admin"); // import admin router
const movie1Router = require("./routes/movie1"); // import admin router

const cors = require('cors'); // import cors (cross origin resource sharing) can also be done in the client side with proxy
const { handleNotFound } = require('./utils/helper');
const school = require('./models/school');


const app = express();// create express app
app.use(cors())
app.use(express.json())// parse json request body
app.use(morgan('dev'))// log http requests


const server = require('http').Server(app);
const io = socketio(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://wokeadvisory.com', 'https://www.wokeadvisory.com'],
    }
  });

app.use('/api/school', schoolRouter);// use user router
app.use("/api/admin", adminRouter); // use admin router
app.use('/api/user', userRouter);// use user router
app.use('/api/actor', actorRouter);// use user router
app.use('/api/movie', movieRouter);// use user router
app.use('/api/movie1', movie1Router);// use user router
app.use("/api/review", reviewRouter); // use review router
app.use("/api/reviewTv", reviewTvRouter); // use review router
app.use("/api/news", newsRouter); // use news router
app.use("/api/reviewSchool", reviewSchoolRouter); // use news router
app.use('/api/teacher', teacherRouter);// use user router
app.use("/api/reviewsTeacher", reviewsTeacherRouter); // use review router
app.use('/api/alertsSchool', alertsSchoolRouter);// use user router
app.use('/api/alertsTeacher', alertsTeacherRouter);// use user router
app.use('/api/follow', followRouter);// use user router
app.use('/post', messagesRouter);


app.use('/*', handleNotFound) // catch 404 and forward to error handler


app.use(errorHandler)// use error handler


const PORT = process.env.PORT || 8080// define a port

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('room', (schoolId, pass) => {
      socket.join(schoolId);
      console.log(`Socket ${socket.id} joined room ${schoolId}`);
      console.log('sending message',  pass)
      io.to(schoolId).emit('msg', pass);
      
      }
      );

    socket.on('roomDelete', (schoolId, pass) => {
      console.log(`Socket ${socket.id} joined roomDelete ${schoolId}`);
      console.log('deleting message',  pass)
      io.to(schoolId).emit('delete', pass);
      }
      ); 
  
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });


server.listen(PORT,  () => {// start express server on port 3000
    console.log(`..............................................`)
    console.log(`🚀  Server running on http://localhost:${PORT}, 🚀`)
    console.log(`...............................................`)
    console.log(`...............Starting Database...............`)
   
    
})
