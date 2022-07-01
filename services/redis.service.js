
module.exports.setAdminMonitoring = async (content, cb) => {
    try{
        const result = await client.HSET("admin_monitorings", "content", JSON.stringify(content))
        
        cb(true);
    }
    catch(err){
        console.log({err})
        cb(false);
    }
}

module.exports.getAdminMonitoring = async (cb) => {
    try{
        const result = await client.HGET("admin_monitorings", "content")

        cb(JSON.parse(result));
    }
    catch(err){
        console.log(err)
        cb(false)
    }
}