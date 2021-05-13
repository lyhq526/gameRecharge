const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    userName: { type: String },
    passWord: { type: String },
})
const listSchema = mongoose.Schema({
    phone: { type: String },
    game: { type: String },
    gameUserId: { type: String },
    createTime: {
        type: Date,
        default: Date.now
    },
    Ingots: {type: String},
    status: { type: Number, default: 1 },
    errorText:{ type: String }
})
const User = mongoose.model('user', UserSchema)
const List = mongoose.model('list', listSchema)
module.exports = { User, List }