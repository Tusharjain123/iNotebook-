const mongoose =require("mongoose")
const {Schema} = mongoose
const NotesSchema = new Schema({
    user: {
// to store the data of the same user who is logging in, we will be providing the object id of the user in this way
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("notes", NotesSchema)