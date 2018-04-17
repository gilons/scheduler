

CLASSES = {
    "Rest1": [24, 0],
    "Rest2": [36, 0],
    "Rest3": [28, 0],
    "Rest4": [74, 0],
    "Rest5": [74, 0],
    "Rest6": [78, 0],
    "Rest7": [56, 0],
    "CLBK2_150A": [84, 0],
    "CLBK2_150B": [84, 0],
    "CLBK2_100A": [51, 0],
    "CLBK2_100B": [54, 0],
    "CLBK2_50A": [30, 0],
    "CLBK2_50B": [30, 0],
    "CLBK2_50C": [30, 0],
    "CLBK2_50D": [30, 0],
    "CLBK2_50E": [30, 0],
    "CLBK2_50F": [30, 0],
    "CLBK2_50G": [30, 0],
    "CLBK2_50H": [30, 0],

    "CLBK1_150A": [105, 140],
    "CLBK1_150B": [104, 84],
    "CLBK1_100A": [84, 63],
    "CLBK1_100B": [84, 63],
    "CLBK1_50A": [30, 0],
    "CLBK1_50B": [30, 0],
    "CLBK1_50C": [30, 0],
    "CLBK1_50D": [30, 0],
    "CLBK1_50E": [30, 0],
    "CLBK1_50F": [30, 0],
    "CLBK1_50G": [30, 0],
    "CLBK1_50H": [30, 0],

    "CV_ROOM1": [30, 45],
    "CV_ROOM2": [30, 45],
    "CV_ROOM3": [30, 45],
    "CV_ROOM4": [30, 45],
    "CV_ROOM5": [30, 45],
    "CV_ROOM6": [30, 45],
    "G103": [39, 0],
    "G105": [39, 0],
    "G107": [39, 0],
    "G108": [39, 0],
    "G111": [39, 0],
    "G112": [57, 76],
    "G114": [57, 76],
    "UBLKB": [162, 0],
    "UBLKE": [78, 0],
    "UBLKF": [78, 0],
    "UBLKD": [78, 0],
    "amphy-750": [325, 0],
    "amphy-600": [342, 0],
    "amphy-250": [110, 0],
    "amphy-150A": [63, 0],
    "amphy-150B": [63, 0],
    "amphy-150C": [63, 0],
    "amphy-150D": [63, 0],
    "amphy-150E": [63, 0]
};
var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
var index = [];
var courses = [];

var boardfunc = require('./boardfunc');
var createfunct = require('./createfunc');

day.forEach(element => {
    periods.forEach(value => {
        index.push(element.substr(0, 3) + '_' + value.substr(0, 2));
    });
});
/* please you will have to take note of puting the option to create the main class data base if it does not exist */
var express = require('express');
var handlebars = require('express3-handlebars');
var app = new express();
app.set('port', process.env.PORT || 3000);

//require('./templatengines')(app);
/* using just handlebars.create({
    defaultLayout: 'main'
}); makes the code to crashe for a reason i don't know. */

handlebars = handlebars.create({
    helpers: {
        id1: function (context1, context2) {
            return context1.substr(0, 3) + '_' + context2.substr(0, 2);
        },
        id2: function (context1, context2) {
            return 'course' + context1.substr(0, 3) + '_' + context2.substr(0, 2);
        },
        id3: function (context1, context2) {
            return 'class' + context1.substr(0, 3) + '_' + context2.substr(0, 2);
        }

    },
    defaultLayout: 'main'
});
app.use(require('body-parser')());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(function (request, response, next) {
    if (!response.locals.partials) response.locals.partials = {};
    response.locals.partials.courses = courses;
    next();
});

app.get('/schedule', function (request, response) {
 /*   boardfunc.current_course(function (params) {
        for (var key in params) {   
            courses.push(key);
        }
        console.log(courses);
        
        courses=[];
    });*/
    response.render('board', {
        day: day,
        periods: periods,
        course: courses
    });
});
app.get('/',function (requuest,response) {
   response.render('entry',null) ;
});

app.get("/create",function (request,response) {
   response.render("create",null); 
});
app.get("/faculty", function (request, response) {
    response.render("faculty", null);
});
app.post('/receiver',function (request,response) {
    var receiver;
    receiver=[];
    var classs;
    var course;
   console.log("body :"+JSON.stringify(request.body));
   var temp = request.body;
   for(var key in temp){
       receiver = temp[key];
   }
    classs = receiver[0];
    course = receiver[1];
    console.log(receiver[1]);
    boardfunc.course_value(course,function(registered) {
      boardfunc.current_classes(classs,function (err,classes) {
          if (err) {
              console.log('some thing went wrong');
          }
         boardfunc.fits(classes,registered,function (fits) {
             console.log(fits);
             classs = fits.getworsefit();
             response.send(classs); 
         }) ;
      });
    });
});
    app.post('/receiver2',function (request,response) {
    var receiver;
    var classs;
   console.log("body :"+JSON.stringify(request.body));
   var temp = request.body;
   for(var key in temp){
       receiver = temp[key];
   }
    classs = receiver[0];
    console.log(receiver[0]);
    /* boardfunc.current_course(function (courses) {
         response.send(courses); 
      });*/
    });

  // boardfunc.course_value()
   


app.post("/create",function (request,response) {
    var temp = null;
    var receiver = request.body;
    for (var key in receiver){
        temp = receiver[key];
    }
    console.log(temp);
if (temp[3] == "create") {
    createfunct.creatUser(temp[1],temp[2],function (err) {
       if (err) {
           console.log(err);
       } 
       createfunct.createScheduler(temp[2],function (err) {
          if(err) {
              console.log(err);
          }
          createfunct.createCredentials(temp[2],temp[1],temp[0],function (err,ipaddress) {
              if(err) console.log(err);
              createfunct.createTables(CLASSES,temp[0],temp[2],function (err) {
                  createfunct.copie(temp[2],temp[0],function(err){
                    if(err) throw err;
                      createfunct.ceateOthers(temp[2], function (err) {
                          if (err) console.log(err);
                          console.log("Every thing is Good");
                          var tempglo = ipaddress+"-"+temp[1]+"-"+temp[0]+"-"+temp[2];
                          response.send(tempglo);
                  });
                 }); 
              });
          }) ;
       });
    });
}
 else if (temp[3] == "department") {
     
 } else if(temp[3] == "faculty") {
    var cred = temp[1].split("-");
    var ipaddress = ced[0];
    var dbpassword = cred[3];
    var universname = cred[1];
    var noweeks = cred[2];

    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: universname,
        password: bdpassword,
        database:"scheduler"
    });
    con.connect(function (err) {
        if (err) {
            response.send("no");
            con.end();
        }
        con.end();
        createfunct.createfaccredential(temp[0],temp[2],universname,ipaddress,dbpassword,noweeks,function (err) {
           if(err) response.send("no");
           createfunct.createdeparttable(temp[0],dbpassword,universname,ipaddress,function (err) {
               if(err) throw err;
               response.send("yes");
           }) ;
        });
    });


 }else if (temp[3] == "univers"){
    var cred  = temp[1].split("-");
    var ipaddress = cred[0];
    var dbpassword = cred[3];
    var universname = cred[1];
    var noweeks = cred[2];
    var mysql = require('mysql');
  var con =   mysql.createConnection( {
        host:"localhost",
        user:"root",
        password:temp[2]
    });
    con.connect(function(err) {
       if(err) {
           response.send("no");
           con.end();
       }
       con.end();
       createfunct.createfactable(temp[2],function (err) {
           response.send("yes");
       });
     
    });

 }else {

 }
});


app.listen(app.get('port'), function () {
    console.log('the server is running under port' + app.get('port') + ' ,thanks');
});