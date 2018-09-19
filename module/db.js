const mongoose = require("mongoose");
// const config = require('config');
var uniqueValidator = require('mongoose-unique-validator');


// var database = config.get('db');
const dbURI = 'mongodb://user:PASSWORD@cluster-shard-xxxx-xxxx.mongodb.net:xxxxxxxxxxxxxxxx';

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};
var companySchema = mongoose.Schema({
    CIN : {type:String,required:true,unique:true},
    companydata:Object,
    statecode:String
});
companySchema.plugin(uniqueValidator);

mongoose.connect(dbURI, options).then(
  (data) => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


module.exports = mongoose.model('company',companySchema)