const bodyParser = require("body-parser");
const express = require("express")

app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

devices = {};
ids = {};

port = process.env.PORT | 5000;

app.listen(port, ()=>{
    console.log(`Running on Port:${port}`);
})
app.get("/",(req,res)=>{
    console.log("request made..");
    console.log(req.body);
    res.send("Done")
})

id=0;
counter=0;
app.post("/postloc",(req,res,next)=>{
    data = req.body;
    console.log(req.body);
    address=data["address"];
    if(!(data["address"] in ids)){
        id=++counter;
        ids[address]={
            id:id,
            address:address,
            time:new Date(),
            connected:true,
            available:data["available"],
        };
        console.log("Welcome ",data.device);
    }else{
        id=ids[data["address"]]["id"];
        ids[address]["time"]=new Date();
        ids[address]["connected"]=true;
        ids[address]["available"]=data["available"];
    }
    next();
},(req,res)=>{
    data = req.body;
    location = data.location;
    ids[address]["location"]=location;
    console.log(data,"\nid:",id);
    console.log("ids:\n",ids);
    res.status(200).send(JSON.stringify(id));
})

app.get("/getinfo/",(req,res)=>{
    data=req.body;
    address=req.query.address;
    if(ids[address]){
        res.status(200).send(JSON.stringify(ids[address]));
    }else{
        res.send("No connections with a device with such MACAddress was found.","Id:",address);
    }
})

app.get("/requestInfo",(req,res)=>{
    allDevices = JSON.stringify(ids);
    res.send(allDevices);
})

setInterval(()=>{
    for(x in ids){
        if(new Date() - ids[x]["time"].getTime() >= 5*60000){
            ids[x]["connected"]=false;
        }
    }
},3*60000)