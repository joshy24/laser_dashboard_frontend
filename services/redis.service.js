module.exports.setAdminMonitoring = function(content, cb){
    client.hset("admin_monitorings", "content", JSON.stringify(content), (err, result) => {
        if(err){
            console.log({err})
            cb(false);
        }
        else{
            cb(true);
        }
        
    })
}


module.exports.getAdminMonitoring = function(cb){
    client.hget("admin_monitorings", "content", (err, result) => {
        if(err){
            cb(false);
        }
        else{
            cb(JSON.parse(result));
        }
    })
}