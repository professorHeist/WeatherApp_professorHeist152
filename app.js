//jshint esversion:6

const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+ "/index.html");
});

app.set('view engine', 'ejs');
app.post("/",function(req,res){

  var query=req.body.cityName;
  var apiKey="93e1626e8dac0d938388238e12760fed";

  var url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+ apiKey+"&units=metric";
  https.get(url,function(response){

    console.log(response.statusCode);

    if(response.statusCode===200){
      response.on("data",function(data){

      const weatherData=JSON.parse(data);
      const temp=weatherData.main.temp;
      const weatherDescription=weatherData.weather[0].description;
      const icon=weatherData.weather[0].icon;
      const imageURL="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
      const minTemp=weatherData.main.temp_min;
      const maxTemp=weatherData.main.temp_max;
      // res.write("<p>The weather is currently "+ weatherDescription +"<p>");
      // res.write("<img src="+imageURL+">");
      // res.write("<h1>The temperature in "+query+" is "+ temp+" degrees Celcius</h1>");

      res.render("content",{
        weatherDescription:weatherDescription,
        temp:temp,
        icon:icon,
        imageURL:imageURL,
        query:query,
        minTemp:minTemp,
        maxTemp:maxTemp
      });


        });


      }else{
res.sendFile(__dirname+"/failure.html");
}
  });
});


app.post("/failure",function(req,res){
    res.redirect("/");
});

let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}


app.listen(port, function() {
  console.log("Server started successfully");
});
