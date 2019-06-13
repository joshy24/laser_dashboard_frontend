var asyncForEach = require('./asyncforeach');

module.exports.parsePhoneNumber = function(phone_number){
    phone_number = phone_number.replace(/\s/g, ''); //remove white spaces

    if(phone_number.indexOf("+234")!=-1&&phone_number.length == 14){
        return phone_number;
    }
    else{
        if(phone_number.length == 11){
            //means there is no +234 at the beginning or the number is incomplete
            if(phone_number.charAt(0)=='0'){
                //number begins with 0
                return "+234"+phone_number.slice(1);
            }
            else{
                //number is incomplete
                return null;
            }
        }
        else{
            //number is incomplete
            return null;
        }
    }
}

module.exports.formatNumbers = async((list, my_number) => {
    let all = [];

    await(asyncForEach(list,item  => {
        var edited = await(this.parsePhoneNumber(item));

        if(edited!=null && edited!=my_number){
            all.push(edited);
        }
    }))

    return all;
})

module.exports.arrayToStrings = async((user_ids) => {
    let all = [];

    await(asyncForEach(user_ids, id => {
            all.push(id.toString());
        })
    )

    return all;
})

module.exports.getEmergencyMessage = function(name, device, location, phone, email, reasons){
    var message = "Name - "+name+"\n\n";

    if(device)
    message +="Device Name - "+device+"\n\n";

    if(location)
    message +="Last Location - "+location+"\n\n";

    if(phone)
    message +="Phone Number - "+phone+"\n\n";

    if(email)
    message +="email - "+email+"\n\n";

    if(reasons.length>0){
        message +=getReason(reasons)+"\n\n";
    }

    return message;
}

function getReason(reasons){
    if(reasons.length==1){
        switch(reasons[0]){
            case "police":
                return "This person is in danger, you can reach out to the police with the above details.";
            break;
            case "hospital":
                return "This person is in need of medical assistance.";
            break;
            case "fire":
                return "This person may be in a fire at the moment, please reach out to the nearest fire center.";
            break;
            default:
            return "This person is in danger, you can reach out to the police with the above details.";
        }
    }
    else{
        return "This person is in danger, you can reach out to the police with the above details.";
    }
}
