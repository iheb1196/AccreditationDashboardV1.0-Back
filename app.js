const express = require('express');
const path = require('path');
const { getPendingsUsersRequest, acceptUser, deleteUser,editUser,getUsers,getCourses,assignCourses,getAllProfessors,getPrograms } = require('./modules/admin');
const app = express()
const port = 7000;
const { ObjectId } = require('bson');

const { auth } = require('./modules/auth');
const { signup } = require('./modules/auth');
const { getMyProfessors} = require("./modules/program director");

const {updateUser} = require ('./modules/admin');
var formidable = require('formidable');
var fs = require('fs');
const { addNotification } = require('./modules/notifications');
const { getMyCourses } = require('./modules/professor');



app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/public',express.static(path.join('/public')));


app.post('/app/signin', (req, res) => {
  auth(req, res);
})

app.post('/app/signup', (req, res) => {
  signup(req, res)
})
app.post('/app/editUser', (req, res) => {
  editUser(req, res)
})


app.get('/app/getPendingsUsers', (req, res) => {
  getPendingsUsersRequest(req, res);
})
app.get('/app/getPrograms', (req, res) => {
  getPrograms(req, res);
})
app.get('/app/getMyCourses', (req, res) => {
  getMyCourses(req, res);
})
app.get('/app/getUsers', (req, res) => {
  getUsers(req, res);
})
app.get('/app/getMyProfessors', (req, res) => {
  getMyProfessors(req, res);
})
app.get('/app/getAllProfessors', (req, res) => {
  getAllProfessors(req, res);
})
app.get('/app/getCourses', (req, res) => {
  getCourses(req, res);
})
app.post('/app/assignCourses', (req, res) => {
  assignCourses(req, res);
})

app.get('/app/acceptUser', (req, res) => {
  acceptUser(req, res);

})
app.post('/app/updateUser', (req, res) => {
  updateUser(req, res);

})

app.get("/app/deleteUser", (req, res) => {
  deleteUser(req, res);

})






app.post("/app/uploadOutcome", (req, res) => {


  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);
    console.log(fields._id);
    const id = fields._id;
    
    
    


    const authorization = fields.token;


    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            var mongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/"


            // upload file
            var dateMillis = new Date().getTime();
            var tmpNameParts = files.filetoupload.name.split(".");
            const ext = tmpNameParts[(tmpNameParts.length - 1)];

            var newName = dateMillis + '.' + ext;

            var oldpath = files.filetoupload.path;
            var newpath = '/public/' + newName;
            fs.rename(oldpath, newpath, function (err) {


              
                
                
               var  Outcome ='http://localhost:7000/' + newpath;

                
              

              dashdb.collection('professorcourse').updateOne({_id: ObjectId(id) },{ $set: { outcome: Outcome } }, function (err, response) {
               
                addNotification('New File','A new file is beeing uploaded from '+result.username+'.','admin' )
               
                res.send({ success: true });
              })
            });

          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }







  });


})
app.post("/app/uploadArtificat", (req, res) => {


  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);
    


    const authorization = fields.token;


    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            var mongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/"


            // upload file
            var dateMillis = new Date().getTime();
            var tmpNameParts = files.filetoupload.name.split(".");
            const ext = tmpNameParts[(tmpNameParts.length - 1)];

            var newName = dateMillis + '.' + ext;

            var oldpath = files.filetoupload.path;
            var newpath = '/public/' + newName;
            fs.rename(oldpath, newpath, function (err) {


              const course = {
                
                
                Artificat: 'http://localhost:7000/' + newpath,
                
              }

              dashdb.collection('professorcourse').updateOne({_id: ObjectId(id) },{ $set: { artifact: Artificat } }, function (err, response) {
               
                addNotification('New File','A new file is beeing uploaded from '+result.username+'.','admin' )
               
                res.send({ success: true });
              })
            });

          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }







  });


})



app.listen(port, () => {
  console.log(`AccreDash listening at http://localhost:${port}`)
})