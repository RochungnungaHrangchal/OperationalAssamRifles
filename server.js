const express = require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
var path = require("path");
const cookieParser=require('cookie-parser');
// Kan configurastion FILE ... 

const dbConfig = require('./config/config.js');

//const authroute = require('./routes/auth.route.js');

const mongoose = require('mongoose');
const MongoClient=require('mongodb').MongoClient;

const https = require('https');

const filesystem=require('fs');

const helmet=require('helmet');
const csp = require('content-security-policy');

const { Console } = require('console');

const httpsoptions = {
    key: filesystem.readFileSync("./config/key.pem"),
    cert: filesystem.readFileSync("./config/cert.pem"),
    passphrase:dbConfig.passPhrase
  };
  

const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());
//app.use(cors);
app.use(cookieParser());
app.use(helmet());

//app.use(app.router);
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname,'./public')));

mongoose.Promise = global.Promise;

// Connecting to the database
MongoClient.connect(dbConfig.databaseURL,{ useNewUrlParser: true, useUnifiedTopology: true},function(err,db){

    if(err) throw err;
    console.log("Database Created");
    db.close();
});


/*mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true})

.then(() => {console.log("Successfully connected to the database");})
.catch
    (err => 
      {
        console.log('Could not connect to the database. Exiting now...', err);

        process.exit();
      }
    ); */

    
    const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src-attr':[SELF,'localhost','https://aframe.io','https://raw.githack.com'],
        'script-src': [SELF, INLINE, 'localhost','https://aframe.io','https://raw.githack.com'],
        'style-src': [SELF, 'https://aframe.io'],
        'img-src': ['data:', 'images.com'],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));
    // https in kan ti lui ang!

app.use(function(req, res, next) {
      if ((req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
      } else
        next();
    });

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/index.html'));

//res.sendFile('index.html');
//res.sendFile('index.html', { root:'./public' });

   // res.json({"Msg":"Online Change Effects!"});
});


//app.use("/api",authroute)

/*app.listen(3066,()=>{

    console.log("Server Connected and UP!");
});*/


// Hetah hian kawng kan SIAL ang !

require('./routes/users.route.js')(app);
require('./routes/chengrang.route.js')(app);

// /*  var kanRoute = require('../routes/users.route.js')
// kanRoute(app);*/
// A chung a code nen hian a in ang chiah..  express hi ROUTE nan kan hmang dawn tihna.


//const port = process.environment.port || 3066;

/*app.listen(3066,()=>{
  console.log("Server Connected");
});*/





https.createServer(httpsoptions,app).listen(5737,()=>{
    console.log("Server Started Successfully!")
});
