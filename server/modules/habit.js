const { text } = require('express');
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    frequency : {
        type : String,
        enum : ['daily', 'weekly', 'calendar'],
        required : true
    },
    counter : {
        type: Boolean
    },
    counterValue : {
        type : Number,
    },
    actualCounter : {
        type : Number,
        default : 0
    },
    streak : {
        type : Number,
        default : 0
    },
    description : {
        type: String,
        required: true
    },
    days : {
        type : Array
    },
    done : {
        type : Boolean,
        default : false
    },
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Habit', habitSchema);