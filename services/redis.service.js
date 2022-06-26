
module.exports.setAdminMonitoring = function(content, cb){
    client.HSET("admin_monitorings", "content", JSON.stringify(content), (err, result) => {
        if(err){
            console.log({err})
            cb(false);
        }
        else{
            console.log({saveResult: result})
            cb(true);
        }
    })
}

module.exports.getAdminMonitoring = async (cb) => {
    try{
        const result = await client.HGET("admin_monitorings", "content")

        cb(JSON.parse(result));
    }
    catch(err){
        cb(false)
        console.log(err)
    }
}