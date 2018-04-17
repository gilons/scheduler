

module.exports.creatUser = function creatuser(name, password, callback) {
    var mysql = require('mysql');
    var empty = require('is-empty');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password
    });
    con.connect(function (err) {
            if (err) callback(err);
            var file = require ('fs');
        file.exists('password.txt', function (params) {
            if (params) {
                console.log("exists");
                file.readFile('password.txt', function (err, data) {
                        if (err) {
                            callback(err);
                        }
                        if (!empty(data)) {
                            file.writeFile('password.txt', password, function (err) {
                                if (err) {
                                    callback(err);
                                    con.end();
                                }
                                var sql = 'CREATE USER "'+name+'"@"%";';
                                con.query(sql, function (err) {
                                    if (err) callback(err);
                                    sql = 'GRANT ALL PRIVILEGES ON *.* To "'+name+'"@"%" IDENTIFIED BY "'+password+'";';
                                    con.query(sql, function (err) {
                                        if (err) callback(err);
                                        sql = 'FLUSH PRIVILEGES';
                                        con.query(sql, function (err) {
                                            if (err) {
                                                callback(err);
                                                con.end();
                                            }
                                            console.log('user successfully added went succesfully');
                                            con.end();
                                            callback(null);
                                        });
                                    });
                                });
                            });
                        }
                    });

                    }
        });
    });
};

module.exports.createScheduler = function createsheduler(password, callback) {
    var mysql = require('mysql');
    console.log(1);
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password
    });
    console.log(2);
    con.connect(function (err) {
        if (err) callback(err);
        console.log(3);
        var sql = 'CREATE DATABASE scheduler ';
        con.query(sql, function (err) {
            if (err) {
                callback(err);
                con.end();
            }
            console.log('Scheduler successfully created');
            con.end();
            callback(null);
        });
    });
};
module.exports.createTables = function createtables(CLASSES, number, password, callback) {
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
                        con.end();
                        console.log("fine!");
                        callback(null);
                        
                    }

                });
            }

        });
    });
}

module.exports.copie = function makecopies(password, number, callback) {
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
        var j = number;
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
                    if (i == (j - (number * 18))) {
                        con.end();
                        console.log(temp + 'was successfuly created and populated');
                        callback(null);
                    }
                    console.log("OK!");
                });
            }

        }
    });
};
module.exports.ceateOthers = function createothers(password, callback) {
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
                    con.end();
                    console.log("Other table successfuly connected");
                    callback(null);
                   
                });
            });
        });
    });
};

module.exports.createCredentials = function createcredential(password,ipaddress, user, noWeeks, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if(err) callback(err,null);
        var sql = 'CREATE TABLE credentials  ( ' +
            'id int(20) auto_increment not null PRIMARY KEY,' +
            'user varchar(20) ,'+
            'ipaddress varchar(20),' +
            'numWeeks int(20) not null )';
        con.query(sql, function (err) {
            if (err) callback(err,null);
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
                'ipaddress = "' + ipaddress + '",' +
                'numWeeks =' + noWeeks;

            con.query(sql, function (err) {
                if (err) callback(err,null);
                console.log('credentials successfuly added');
                con.end();
                callback(null,address);
            });
        });
    });
};
module.exports.getnoWeeks = function getnoWeeks(password,callback) {      
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
};
module.exports.getdbpassword = function getdbpassword(password, callback) {
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

        sql = 'select dbpassword from credentials where id = 1';
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
};
function getipaddress(password, callback) {
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

        sql = 'select ipaddress from credentials where id = 1';
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
};
module.exports.getfacname = function getfacname(password, callback) {
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

        sql = 'select facname from credentials where id = 1';
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
};
module.exports.getuname = function uname(password, callback) {
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

        sql = 'select uname from credentials where id = 1';
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
};
module.exports.getipaddress = function getipaddress(password, callback) {
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

        sql = 'select ipaddress from credentials where id = 1';
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
};
module.exports.getuser = function getuser(password, callback) {
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

        sql = 'select user from credentials where id = 1';
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
};
module.exports.getkeyword = function getkeyword(password, callback) {
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

        sql = 'select keyword from credentials where id = 1';
        con.query(sql, function (err, result) {
            if (err) callback(err,null);
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
};

module.exports.createdepCredentials = function createdepcredential(departname,ipaddress,dbpassword,uname,password, facname, noWeeks, callback) {
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
            'facname varchar(20) ,' +
            'ipaddress varchar(20) ,' +
            'dbpassword varchar(20) ,' +
            'uname varchar(20),' +
            'numWeeks int(20) not null )';
        con.query(sql, function (err) {
            if (err) callback(err);
            sql = 'INSERT INTO  credentials SET  ' +
                'user  = "' + departname + '",' +
                'facname = "' + facname + '"'+ 
                'uname = "' + uname + '"' + 
                'ipaddress = "' + ipaddress + '"' + 
                'dbpassword = "' + dbpassword + '"' + 
                'numWeeks = "' + noWeeks + '"';
                
            con.query(sql, function (err) {
                if (err) callback(err);
                console.log('credentials successfuly added');
                con.end();
                callback(null);
            });
        });
    });
};

module.exports.createfaccredential = function createfaccredential(facname,password, uname,ipaddress,dbpassword,noweeks, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err, null);
        var sql = 'CREATE TABLE credentials  ( ' +
            'id int(20) auto_increment not null PRIMARY KEY,' +
            'user varchar(20) ,' +
            'ipaddress varchar(20) ,' +
            'dbpassword varchar(20) ,' +
            'uname varchar(20),' +
            'numWeeks int(20) not null )';
        con.query(sql, function (err) {
            if (err) callback(err, null);
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
                'user  = "' + facname + '",' +
                'ipaddress = "' + ipaddress + '",' +
                'uname = "' + uname + '",' +
                'dbpassword = "' + dbpassword + '",' +
                'numWeeks =' + noWeeks;

            con.query(sql, function (err) {
                if (err) callback(err, null);
                console.log('credentials successfuly added');
                con.end();
                callback(null, address);
            });
        });
    });
};

module.exports.createfactable = function createfactable(password,callback){
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err);
        var sql = 'CREATE TABLE faculties  ( ' +
            'id int(20) auto_increment not null PRIMARY KEY,' +
            'name varchar(20) )';
        con.query(sql, function (err) {
            if (err) {
                callback(err);
                con.end();
            }
            callback("yes");
            con.end();

        });
    });

};
module.exports.addfac = function addfac(password) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err, null);
        sql = 'INSERT INTO  faculties SET  ' +
            'name  = "' + facname + '"' ;

        con.query(sql, function (err) {
            if (err) callback("no");
            console.log('faculty was successfuly added');
            con.end();
            callback("yes");
        });
    });
};

module.exports.facheck = function facheck(facname,uname,ipaddress,dbpassword,callback){
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host:ipaddress,
        user:uname,
        password:dbpassword,
        database:"scheduler"
    });

    con.connect(function (err) {
        if(err) callback("no");
        var tenp = [];
        var i = 0;
      var  sql = 'select name from faculties';
        con.query(sql, function (err, result) {
            if (err) callback("no");
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp.push(value[key2]);
                    // console.log(value);
                }

            }
            temp.forEach(element => {
                i++;
                if(element == facname) {
                    if (i == (temp.length - 1)) {
                        callback("yes");
                        con.end();
                    } 

                } else {
                    if (i == (temp.length - 1)) {
                        callback("no");
                        con.end();
                    } 
                }
                
            });
        });
    });
};

module.exports.departmentcheck = function departmentcheck(facname,depname, uname, ipaddress, dbpassword, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });

    con.connect(function (err) {
        if (err) callback("no");
        var tenp = [];
        var i = 0;
        var sql = 'select name from '+facname+'department where id = 1';
        con.query(sql, function (err, result) {
            if (err) callback("no");
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp.push(value[key2]);
                    // console.log(value);
                }

            }
            temp.forEach(element => {
                i++;
                if (element == facname) {
                    if (i == (temp.length - 1)) {
                        callback("yes");
                        con.end();
                    }

                } else {
                    if (i == (temp.length - 1)) {
                        callback("no");
                        con.end();
                    }
                }

            });
        });
    });
};
module.exports.createdeparttable = function createdeparttable(facname,dbpassword,uname,ipaddress, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err);
        var sql = 'CREATE TABLE '+ facname +'department  ( ' +
            'id int(20) auto_increment not null PRIMARY KEY,' +
            'name varchar(20) )';
        con.query(sql, function (err) {
            if (err) callback(err, null);
            callback("yes");
        });
    });

};

module.exports.adddepart  = function adddepart(departname,facname,uname,ipaddress,dbpassword,callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) callback(err, null);
        sql = 'INSERT INTO  '+facname+'department SET  ' +
            'name  = "' + departname + '"';

        con.query(sql, function (err) {
            if (err) callback("no");
            console.log('department was successfuly added');
            con.end();
            callback("yes");
        });
    });
};

