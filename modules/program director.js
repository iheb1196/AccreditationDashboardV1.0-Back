const { ObjectId } = require('bson');
const urlG = require('url');



exports.getMyProfessors = function (req, res) {
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
              console.log(result.program);
              console.log(result.username);
              

  
              dashdb.collection('professorcourse').find( {program:{ $in: result.program}, username : {$ne : "salma.hamza"} } ).toArray(function (err, result) {
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
  