const { ObjectId } = require('bson');
const urlG = require('url');

//GetPendingRequests : it retrieves from the database the request with "Pending" Status 
exports.getPendingsUsersRequest = function (req, res) {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            dashdb.collection('users').find({ status: 'PENDING' }).toArray(function (err, result) {
              if (err) {
                throw err;
              }

              var arrayToSend = [];

              result.forEach(user => {
                const tmp = {
                  username: user.username,
                  email : user.email,
                  role: user.role,
                  status: user.status,
                  date:user.date,
                  id: user._id
                }

                arrayToSend.push(tmp);
              });

              res.send(arrayToSend);

            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }

}
exports.getUsers = function (req, res) {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {
            console.log(result);

            dashdb.collection('users').find({ role: { $ne: "admin" },status : {$ne:"PENDING"} }).toArray(function (err, result) {
              if (err) {
                throw err;
              }

              var arrayUsers = [];

              result.forEach(user => {
                const tmp = {
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                  id: user._id
                }

                arrayUsers.push(tmp);
                console.log(arrayUsers);
              });

              res.send(arrayUsers);

            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }

}



exports.acceptUser = function (req, res) {

  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url, {useUnifiedTopology: true},function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            const q = urlG.parse(req.url, true).query;
            

            const id = q.id;

            var mongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/"

            mongoClient.connect(url, function (err, db) {
              if (err) { throw err };
              var dashdb = db.db('Dashboard');


              dashdb.collection('users').updateOne({ _id: ObjectId(id) }, { $set: { status: 'ACCEPTED' } }, function (err, response) {
                res.send({ success: true });
              })
            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }
}


exports.editUser = function (req, res) {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    let body = [];
    let requestBody = {};
    console.log(requestBody);

    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      requestBody = JSON.parse(body);

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');







        

        var filter = { username: requestBody.username };
        var updateQ = { $set: { role: requestBody.role ,program:requestBody.program} };
        

        dashdb.collection('users').updateOne(filter, updateQ, function (err, response) {
          res.send({

            success: true,

          });
        })
        
        
      })
    })
  } else {
    res.send({ success: false, message: "access denied: bad request" });
  }
}
exports.AddCourses = function (req, res) {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    let body = [];
    let requestBody = {};
    console.log(requestBody);

    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      requestBody = JSON.parse(body);

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');









        var filter = { username: requestBody.username };
        var updateQ = { $set: { role: requestBody.role } }

        dashdb.collection('users').updateOne(filter, updateQ, function (err, response) {
          res.send({

            success: true,

          });
        })
      })
    })
  } else {
    res.send({ success: false, message: "access denied: bad request" });
  }
}



exports.deleteUser = function (req, res) {

  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url, {useUnifiedTopology: true},function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            const q = urlG.parse(req.url, true).query;

            const id = q.id;

            var mongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/"

            mongoClient.connect(url, function (err, db) {
              if (err) { throw err };
              var dashdb = db.db('Dashboard');

              dashdb.collection('users').deleteOne({ _id: ObjectId(id) }, function (err, response) {
                res.send({ success: true });
              })
            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }
}
//GetCourses : it retrieves from the data base all the courses that has to be assigned to a professor
exports.getCourses = function (req, res) {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {

            dashdb.collection('courses').find({}).toArray(function (err, result) {
              if (err) {
                throw err;
              }

              var arrayCourses = [];

              result.forEach(course => {
                const crs = {
                  course_name: course.coursename,
                  program: course.program,

                  id: course._id
                }

                arrayCourses.push(crs);
                console.log(arrayCourses);
              });

              res.send(arrayCourses);

            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }

}
//AssignCourses : assign to each user the courses that he teaches
exports.assignCourses = function (req, res) {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    let body = [];
    let requestBody = {};

    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      requestBody = JSON.parse(body);

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');
        dashdb.collection('courses').findOne({coursename:requestBody.coursename},function (err, result) {
          if (err) {
            throw err;
          }
          console.log("this is the result");
          
          console.log(result.program);
          




        var userDoc = {
          username: requestBody.username,
          coursename: requestBody.coursename,
          email: requestBody.email,
          program : result.program,
          term: requestBody.term,
          role: requestBody.role,
          year: requestBody.year,

        }
        console.log(userDoc);
        dashdb.collection('professorcourse').insertOne(userDoc, function (err, resl) {
          res.send({ success: true, message: "user inserted successfully." });
        })
      })

    })








    })
  } else {
    res.send({ success: false, message: "access denied: bad request" });
  }
}
exports.getAllProfessors = function (req, res) {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {
            console.log(result);
            

            dashdb.collection('professorcourse').find({ } ).toArray(function (err, result) {
              if (err) {
                throw err;
              }

              var arrayMyProfessors = [];

              result.forEach(user => {
                const tmp = {
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  program : user.program,
                  outcome: user.outcome,
                  coursename:user.coursename,
                  year:user.year,
                  term:user.term,
                  id:user._id
                }

                arrayMyProfessors.push(tmp);
                console.log(arrayMyProfessors);
              });

              res.send(arrayMyProfessors);

            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }

}
exports.getPrograms = function (req, res) {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];


  if (contentType == 'application/json') {
    if (authorization != null) {

      var mongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/"

      mongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
        if (err) { throw err };
        var dashdb = db.db('Dashboard');

        dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
          if (err) { throw err }
          if (result) {
            console.log(result);
            

            dashdb.collection('programs').find({ } ).toArray(function (err, result) {
              if (err) {
                throw err;
              }

              var arrayMyPrograms = [];

              result.forEach(user => {
                const tmp = {
                  
                  program : user.program,
                  
                }

                arrayMyPrograms.push(tmp);
                console.log(arrayMyPrograms);
              });

              res.send(arrayMyPrograms);

            })




          } else {
            res.send({ success: false, message: "Session expired." })
          }
        })

      })


    } else {
      res.send({ success: false, message: "Access denied." })
    }
  } else {
    res.send({})
  }

}
