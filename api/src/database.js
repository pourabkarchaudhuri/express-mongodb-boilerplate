import {MongoClient} from 'mongodb'
// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'fileapp';
// Use connect method to connect to the server
export const connect = (cb) =>{
  MongoClient.connect(url, (err, client) =>{
    console.log("Connecting to MongoDB Server . . .");
    const db = client.db(dbName);
    return cb(err, db)
  });
};
