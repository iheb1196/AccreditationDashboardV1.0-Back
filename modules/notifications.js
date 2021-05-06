exports.addNotification = function( title,message,AssoUser ){

    var mongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/"

    mongoClient.connect(url,function(err,db){
        if(err){throw err};
        var dashdb = db.db('Dashboard');

        const notification = {
            title:title,
            message:message,
            date : new Date(),
            user:AssoUser,
            vue : false
        }

        dashdb.collection('notifications').insertOne(notification, function(err,result){
         
        })

    })

}