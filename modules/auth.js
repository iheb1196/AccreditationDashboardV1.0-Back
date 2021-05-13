const TokenGenerator = require('uuid-token-generator');



exports.auth = function(req,res){
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

            mongoClient.connect(url,{useUnifiedTopology: true},function(err,db){
                if(err){throw err};
                var dashdb = db.db('Dashboard');

                
               

                dashdb.collection('users').findOne({ username: requestBody.username, password:requestBody.password }, function(err,result){
                    if(err){throw err}
                    if (result) {
                        
                        if (result.status !== 'PENDING') {
                                          // generate a new token
                        const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
                        const tokenf = tokgen2.generate();

                        var filter = { username:requestBody.username };
                        var updateQ = { $set : { token : tokenf } }

                        dashdb.collection('users').updateOne(filter,updateQ,function(err,response){
                            res.send({
                                token:tokenf,
                                success:true,
                                role:result.role,
                                username:result.username
                            });
                        })
                        } else {
                            res.send({
                                success:false,
                                message:'Please contact your , whatever... '
                            });
                        }


                        
                    }else{
                        res.send({success:false,message:"wrong username or password."})
                    }
                    
                })


            })
            
        })
    }else{
        res.send({success:false , message:"access denied: bad request"});
    }
}




exports.signup = function(req,res){
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

            mongoClient.connect(url,{useUnifiedTopology: true},function(err,db){
                if(err){throw err};
                var dashdb = db.db('Dashboard');

                dashdb.collection('users').find({username:requestBody.username}).toArray(function(err,result){
                    console.log(result);

                    
                        if (result.length != 0 ) {
                            res.send({success:false, message:"username already in use."})
                        }else{
                            var userDoc = {
                                username:requestBody.username,
                                password:requestBody.password,
                                email : requestBody.email,
                                status:'PENDING',
                                date : new Date(),
                                
                            }
                            dashdb.collection('users').insertOne(userDoc,function(err,resl){
                                res.send({success:true, message:"user inserted successfully."});
                            })
                        }
                    

                    

                    
                })


            })
            
        })
    }else{
        res.send({success:false , message:"access denied: bad request"});
    }
}