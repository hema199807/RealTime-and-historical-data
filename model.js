var mongoose=require('mongoose');
var dataSchema=new mongoose.Schema({
    Temperature:Number,
    BatteryLevel:Number,
    TimeStamp:String},
    {strict:false});

var Data=mongoose.model("IOTASS",dataSchema);

module.exports=Data;