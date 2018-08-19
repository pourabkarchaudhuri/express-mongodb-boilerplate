import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {connect} from './database.js'
import AppRouter from './router.js'
import multer from 'multer'
import path from 'path'
//ES6 style Package dependencies import

//File Storage eslintConfig
const storageDir = path.join(__dirname, '..', 'storage')
const storageConfig = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, storageDir)
  },
  filename: (req, file, cb)=>{
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageConfig })

const PORT = 3000;
//Setting Up Dynamic port allocation
const app = express();
//Creating express object
app.server = http.createServer(app);
//Create HTTP server

app.use(morgan('dev'));
//To Get Apache Log Format in Console for Handling Requests

app.use(cors({
    exposedHeaders: "*"
}));
//To Allow Cross Origin Accessability

app.use(bodyParser.json({
    limit: '50mb'
}));
//Setting Attachement Size limit

app.set('root', __dirname);
app.set('storage', storageDir);
app.set('upload', upload)
//Set root static directory for front end content

//DB Connector
connect((err, db)=>{
  if(err){
     console.log("There is an error connecting to DB ",err);
     throw (err);
   }
   console.log("Connected to MongoDB Successfully");
  // app.db = db;
  app.set('db', db);
  new AppRouter(app);
  app.server.listen(process.env.PORT || PORT, () => {
          console.log(`App is running on port ${app.server.address().port}`);
  });
  //Start Server to listen to assigned port
})
//Connect to DB Before Starting Server

export default app;
//export the service
