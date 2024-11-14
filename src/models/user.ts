import mongoose from 'mongoose';


let userSchema=new mongoose.Schema({
    auth0Id :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    adressLine:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    }

})
const User=mongoose.model('User',userSchema);
export default User; 
// module.exports=mongoose.model('users',UserSchema)