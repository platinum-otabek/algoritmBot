const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    chat_id:{
        type:String,
    },
    name:{
        type:String,
    },
    number:{
        type:String,
    },
    location:{
        type:String,
    },
    direction:{
        type:String,
    },
    service_type:{
        type:String,
    },
    step_id:{
        type:String,
    },

})
module.exports = mongoose.model('user',UserSchema);