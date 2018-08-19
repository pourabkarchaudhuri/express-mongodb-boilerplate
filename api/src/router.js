import {version} from '../package.json'
import path from 'path'
import _ from 'lodash'
import File from './model/file'
import {ObjectID} from 'mongodb'

class AppRouter {
  constructor(app){
    this.app=app;
    this.setupRouters();
  }
  setupRouters(){
    const app = this.app;
    const db = app.get('db');
    const uploadDir = app.get('storage');
    const upload = app.get('upload');

    //Root Route
    app.get('/', (req, res, next) =>{
      return res.status(200).json({
        version : version,
        active : true
      });
    });

    app.post('/api/upload', upload.array('files'), (req, res, next) =>{
      console.log("Recieved file uploaded", req.files);
      const files = _.get(req, 'files', [])
      let fileModels = [];
      _.each(files, (fileObject)=>{
        const newFile = new File(app).initWithObject(fileObject).toJSON()
        fileModels.push(newFile)
      })

      if(fileModels.length){
        db.collection('files').insertMany(fileModels, (err, result) =>{
          if(err){
            return res.status(503).json({
              error_status: true,
              error:{
                message: "Unable to save your files"
              },
              status_code: 503
            })
          }
          console.log("File saved with Result : ", err, result);
          return res.json({
            upload : true,
            success : true,
            files : fileModels,
            error_status: null,
            status_code: 200
          })

        })
      }//Files Exists
      else{
        return res.status(503).json({
          error_status: true,
          error:{
            message:"File needs to be uploaded as formdata"
          },
          status_code: 403
        })
      }//Models Empty
    });
    // Upload Routing

    app.get('/api/download/:id', (req, res, next) =>{
      const fileId = req.params.id;

      db.collection('files').find({_id: ObjectID(fileId)}).toArray((err, result)=>{
        console.log("Finding Object file from DB : ", err, result);

        const filename = _.get(result, '[0].name');
        if(err||!filename){
          return res.status(404).json({
            error_status: true,
            error:{
              message:"File not found"
            },
            status_code: 404
          })
        }

        const filepath = path.join(uploadDir, filename)
        return res.download(filepath, filename, (err) =>{
          if(err){
            return res.status(404).json({
              error_status: true,
              error:{
                message:"File not found"
              },
              status_code: 404
            })
          }
          else{
            console.log("File has been downloaded");
          }
        })
      })


    });
    //Download Routing

    console.log("App Routers have been initialized");
  }
}

export default AppRouter;
