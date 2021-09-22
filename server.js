var express=require('express');
var mongoose=require('mongoose');
var IOTASS=require('./model');
var bodyParser=require("body-parser");
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var port=process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(express.static("public"));


var dbUri=`mongodb+srv://root:38CWz9iKbRCEF8ya@cluster0.29oaz.mongodb.net/UserDb?retryWrites=true&w=majority`
var options={
    useUnifiedTopology:true,
    useNewUrlParser:true
}
var temp=14;
var level=50;
var getDataIntervel;
mongoose.connect(dbUri,options).then(()=>{
    console.log("Database connected");
})
io.on('connection',function(socket){
    socket.on("add-data",function(){
        getDataIntervel=setInterval(async ()=>{
            let currentDate=await new Date();
            let month=currentDate.getMonth() + 1;
            month=month < 10 ? "0"+month :month;
            let year=currentDate.getFullYear();
            let getDate=currentDate.getDate();
            getDate=getDate < 10 ? "0"+getDate :getDate;
            let addDate= year+"-"+month+"-"+getDate;
            var hours = currentDate.getHours();
            hours = hours < 10 ? "0" + hours : hours;
            var minutes = currentDate.getMinutes() < 10 ? "0" +currentDate.getMinutes() : currentDate.getMinutes();
            var seconds = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();
            let currentTime=hours+":"+minutes+":"+seconds;
            var storedData= await new IOTASS({Temperature:++temp,
                BatteryLevel:++level,
                TimeStamp:`${addDate}---${currentTime}`}).save();
                
            var getData=await IOTASS.find().limit(20).sort({TimeStamp:-1});
            io.emit("realtime-data",getData);
        },2000)
    })
    socket.on('disconnect',()=>{
        console.log("disconnected");
        clearInterval(getDataIntervel);
    })
   
})
app.set("view engine","jade");

app.get("/selectDateTime",(req,res)=>{
   res.render("historical");
})

app.post("/historicalData",async (req,res)=>{
    var getHistoricalData=await IOTASS.find({TimeStamp : {$lt :req.body.end, $gt :req.body.start}})
    if(getHistoricalData.length!=0){
        res.send({status:200,result:getHistoricalData});
    }else{
        res.send({status:404,message:"Page Not Found"})
    }
})
server.listen(port,()=>{
    console.log("server running")
})



