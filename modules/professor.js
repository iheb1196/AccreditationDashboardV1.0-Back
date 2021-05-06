const { ObjectId } = require('bson');
const urlG = require('url');
exports.getMyCourses = function (req, res) {
    const contentType = req.headers['content-type'];
    const authorization = req.headers['authorization'];
  
  
    if (contentType == 'application/json') {
        
      if (authorization != null) {
        
  
        var mongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/"
  
        mongoClient.connect(url, function (err, db) {
          if (err) { throw err };
          var dashdb = db.db('Dashboard');
  
          dashdb.collection('users').findOne({ token: authorization }, function (err, result) {
            if (err) { throw err }
            if (result) {
                console.log(result);
                
  
              dashdb.collection('professorcourse').find({username:result.username}).toArray(function (err, result) {
                if (err) {
                  throw err;
                }
  
                
                var arrayMyCourses = [];
                result.forEach(mycourse => {
                  const myCrs = {
                    coursname:mycourse.coursename,
                    term:mycourse.term,
                    program:mycourse.program,
                    year:mycourse.year,
                    username:mycourse.username
  
                    
                  }
  
                  arrayMyCourses.push(myCrs);
                  console.log(arrayMyCourses);
                });
  
                res.send(arrayMyCourses);
  
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