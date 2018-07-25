CLASSES = {
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
    "amphy-150E": [63, 0],
    "CV_ROOM1": [30, 45],
    "CV_ROOM2": [30, 45],
    "CV_ROOM3": [30, 45],
    "CV_ROOM4": [30, 45],
    "CV_ROOM5": [30, 45],
    "CV_ROOM6": [30, 45],
    "CLBK1_150A": [105, 140],
    "CLBK1_150B": [104, 84],
    "CLBK1_100A": [84, 63],
    "CLBK1_100B": [84, 63],
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
    "CLBK1_50A": [30, 0],
    "CLBK1_50B": [30, 0],
    "CLBK1_50C": [30, 0],
    "CLBK1_50D": [30, 0],
    "CLBK1_50E": [30, 0],
    "CLBK1_50F": [30, 0],
    "CLBK1_50G": [30, 0],
    "CLBK1_50H": [30, 0],
    "Rest1": [24, 0],
    "Rest2": [36, 0],
    "Rest3": [28, 0],
    "Rest4": [74, 0],
    "Rest5": [74, 0],
    "Rest6": [78, 0],
    "Rest7": [56, 0],
};
var sreing = "SANTERS1997";

 
/*scrapnum(sreing, function (result) {
    console.log(result);
});
*/
function arrtransform(array, callback) {
    var temp = [];
    for (var key in array) {
        temp.push([key, array[key]]);
    }
    callback(temp);
}

function findclassmatch(classes, match, callback) {
    var temp = [];
    for (var key in classes) {
        var value = classes[key];
      /*  scrapnum(key, function (result1) {
            scrapnum(match, function (result2) {
                if ((result1 == result2) || (key.substr(0, 3) == match.substr(0, 3))) {
                    temp.push(key);
                }
            });
        });*/
    }
    callback(temp);
}
findclassmatch(CLASSES, 'CLBK1_50H', function (params) {
    arrtransform(CLASSES, function (array) {
        findclass(array, params[params.length - 1], function (position) {
            console.log(position);
        });
    });
});

function findclass(classes, classs, callback) {
    var temp;
    for (i = 0; i < classes.length; i++) {
        if (classes[i][0] == classs) {
            callback(i);
            console.log("found!");
        }
    }
}
var boardfunc = require('./boardfunc');
boardfunc.fits(null, CLASSES,100, function (fits) {
    console.log(fits, "*****************************");
});



function createfaccourses(facname, ipaddress, uname, dbpassword, callback) {
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });

    con.connect(function (err) {
        if (err) {
            console.log(err);
            con.end();
            callback(err);
        } else {
            var sql = 'CREATE TABLE' + facname + 'courses (' +
                'id int(20) not null auto_increment primary key ,' +
                'name varchar(20) ,' +
                'number int(20) )';
            con.query(mysql, function (err) {
                if (err) {
                    console.log(err);
                    con.end();
                    callback(err);
                }
            });
        }
    });
};

function addfaccourse(facname, ipaddress, uname, dbpassword,
    coursename, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            sql = 'INSERT INTO ' + facname + 'courses SET  ' +
                'name  = "' + coursename + '",' +
                'number = ' + number;

            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    console.log(facname, 'couse was successfuly added');
                    con.end();
                    callback(null);
                }

            });
        }

    });
};

function faccurrent_courses(facname, ipaddress, uname, dbpassword,
    coursename, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            i = 0;
            temp = [];
            temp1 = [];
            temp2 = [];

            sql = 'select name from ' + facname + 'courses ';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);

                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            temp.push(value[key2]);
                            // console.log(value);
                        }
                    }
                    sql = 'select number from ' + facname + 'courses ';
                    con.query(sql, function (err, result) {
                        if (err) {
                            con.end();
                            callback(err, null);
                        } else {
                            for (var key in result) {
                                var value = result[key];
                                for (var key2 in value) {
                                    temp1.push(value[key2]);
                                    // console.log(temp1);
                                }
                            }
                            console.log(temp.length);

                            for (i = 0; i < temp.length; ++i) {
                                temp2[temp[i]] = temp1[i];
                                //console.log(temp2);
                            }
                            con.end();
                            callback(null, temp2);
                        }

                    });

                }

            });

        }

    });
}


function checkifligilble(course, period,
    ipaddress, dbpassword, uname, callback) {
        var facname = course.split('.')[0];
        course = course.split('.')[1];
       // console.log(course);
    boardfunc.getscheduledperiod(period, facname,
        ipaddress, uname, dbpassword,
        function (err, scheduled) {
            if (err) {
                console.log(err);
            } else {
                var u = 0;
                console.log(scheduled);
                var temp = [];
                var temp1 = [];
                console.log(temp2);

                if (u > 0) {
                    callback(true);
                } else {
                    callback(false);
                }
                }   
                });
}

var a = [[58, 'BBB'], [12, 'AAA'], [28, 'CCC'], [18, 'DDD']];

//a.sort(sortFunction);

function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

console.log(a.sort(sortFunction));