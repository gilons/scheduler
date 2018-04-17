var boardfunc = require('./boardfunc');
var temp = [];

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
/*boardfunc.course_value('giles',function(params) {
    console.log(params);
});

boardfunc.current_course(function (params) {
    console.log(params);
});

boardfunc.current_classes('Sat_08',function (params) {
    boardfunc.course_value('giles', function (params1) {
        boardfunc.choose_class(params,'G105',params1,'Sat_08','giles',function (params2) {
           boardfunc.undo(params2,function (params3) {
              console.log(params3); 
           });
        });
    });
});*/

/*var os = require('os');
var ifaces = os.networkInterfaces();
var address;
os = require('os');
ifaces = os.networkInterfaces();
    
for (var dev in ifaces) {
    var iface = ifaces[dev].filter(function (details) {
        return details.family === 'IPv4' && details.internal === false;
    });

    if (iface.length > 0) address = iface[0].address;
}
console.log(address);

var file = require('fs');
file.writeFile('password.txt',"giles", function (err) {
    if (err) {
        callback(err);
    }
    console.log('ysss');
    file.readFile('password.txt',function (err,data) {
        console.log(data.toString());    
        file.exists('password.txt',function (params) {
            if(params) console.log("exists");
        })    ;
    });
});*/
function createtables(CLASSES, number, password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    var i = 0;
    var j = 0;
    con.connect(function (err) {
        if (err) callback(err);
        sql = 'CREATE TABLE CLASSES (' +
            ' id int(11) not null auto_increment primary key ,' +
            'class_name varchar(200) not null ,' +
            'capacity1 int(64) ,' +
            'capacity2 int(64))';
        con.query(sql, function (err) {
            if (err) callback(err);
              for (var keys in CLASSES) {
                j++;
              }
            for (var key in CLASSES) {
               
                var value = CLASSES[key];
                var value1 = value[1];
                var value2 = value[0];
                sql = 'INSERT INTO CLASSES SET class_name = "' + key + '" ,capacity1 = ' + value2 + ' ,capacity2 = ' + value1;
                con.query(sql, function (err1) {
                     i++;
                    if (i == j) {
                        if (err1) throw err1;
                        console.log("fine!");
                        callback(null);
                        con.end();
                    }

                });
            }

        });
    });
}

function makecopies(password,number,callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err);
        var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
        var index = [];
        var j =number;
        var courses = [];
        day.forEach(element => {
            periods.forEach(value => {
                index.push(element.substr(0, 3) + '_' + value.substr(0, 2));
            });
        });
        for (var i = 0; i < number; i++) {
          
            for (var key in index) {
               
                var value = index[key];
                var temp = i.toString() + value;
                sql = 'CREATE TABLE ' + temp + ' AS SELECT id, class_name, capacity1, capacity2 FROM CLASSES';
                con.query(sql, function (err2) {
                    if (err2) {
                        callback(err2);
                    }
                     j++;
                      console.log(j);
                    if (i == (j-(number*18))) {
                          con.end();
                          console.log(temp + 'was successfuly created and populated');
                          callback(null);
                    }
                  console.log("OK!");
                });
            }

        }
    });
}

function createcredential(password, user, noWeeks, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        var sql = 'CREATE TABLE credentials  ( ' +
            'id int(20) auto_increment not null PRIMARY KEY,' +
            'user varchar(20)  ,' +
            'host varchar(20),' +
            'numWeeks int(20) not null )';
        con.query(sql, function (err) {
            if (err) callback(err);
            var os = require('os');
            var ifaces = os.networkInterfaces();
            var address;
            os = require('os');
            ifaces = os.networkInterfaces();
            for (var dev in ifaces) {
                var iface = ifaces[dev].filter(function (details) {
                    return details.family === 'IPv4' && details.internal === false;
                });
                if (iface.length > 0) address = iface[0].address;
            }
            var host = address;
            sql = 'INSERT INTO  credentials SET  ' +
                'user  = "' + user + '",' +
                'host = "' + host + '",' +
                'numWeeks =' + noWeeks ;

            con.query(sql, function (err) {
                if (err) callback(err);
                console.log('credentials successfuly added');
                con.end();
                callback(null);
            });
        });
    });
}
function createothers(password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err);
        var sql = 'CREATE TABLE courses (' +
            'id int(20) not null auto_increment primary key ,' +
            'name varchar(20) ,' +
            'number int(20) )';
        con.query(sql, function (err) {
            if (err) callback(err);
            sql = 'CREATE table scheduled ( ' +
                'id int(20) auto_increment not null primary key ,' +
                'course varchar(20) , ' +
                'period varchar(20) not null )';
            con.query(sql, function (err) {
                if (err) callback(err);
                sql = 'CREATE TABLE done  ( ' +
                    'id int(20) auto_increment not null primary key, ' +
                    'course varchar(20)  ,' +
                    'period varchar(20) ,' +
                    'course_value int(20))';
                con.query(sql, function (err) {
                    if (err) {
                        callback(err);
                        con.end();
                    }
                    console.log("Other table successfuly connected");
                    callback(null);
                    con.end();
                });
            });
        });
    });
};
function getnoWeeks(password, callback) {
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err, null);

        sql = 'select numWeeks from credentials where id = 1';
        con.query(sql, function (err, result) {
            if (err) throw err;
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    tempo = value[key2];
                }
            }
            con.end();
            callback(null, tempo);
        });
    });
}
function gethost(password, callback) {
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err, null);

        sql = 'select host from credentials where id = 1';
        con.query(sql, function (err, result) {
            if (err) throw err;
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    tempo = value[key2];
                }
            }
            con.end();
            callback(null, tempo);
        });
    });
}
/*createtables(CLASSES, 2, "santers1997", function (err) {
    if (err) throw err;
    console.log("yess");
    makecopies("santers1997",2,function (params) {
       if(params) throw params;
       console.log('fine!'); 
        createothers("santers1997", function (err) {
            if (err) throw err;
            console.log("every thing went fine");
        });
    });

});*/
getnoWeeks("santers1997",function (err,result) {
   console.log(result); 
   gethost("santers1997",function (err,result) {
      if(err)throw err;
      console.log(result); 
   });
});

