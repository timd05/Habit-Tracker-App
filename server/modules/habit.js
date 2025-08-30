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
    daily : {
        type: Boolean
    },
    weekly : {
        type: Boolean
    },
    monthly : {
        type: Boolean
    },
    counter : {
        type: Array
    },
    description : {
        type: String,
        required: true
    },
    field : {
        type : String,
        required: true
    },
    days : {
        type : Array
    }
});

module.exports = mongoose.model('Habit', habitSchema);