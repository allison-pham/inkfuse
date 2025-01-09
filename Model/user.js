import mongoose from 'mongoose';

const user_information = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 

    username: {
        type: String, 
        required: true
    }, 

    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }

})

export default mongoose.models.User || mongoose.model("User", user_information);

