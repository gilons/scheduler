module.exports.creatUser = function creatuser(name, password, callback) {
    var mysql = require('mysql');
    var empty = require('is-empty');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var file = require('fs');
            file.exists('password.txt', function (params) {
                if (params) {
                    console.log("exists");
                    file.readFile('password.txt', function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            if (!empty(data)) {
                                file.writeFile('password.txt', password, function (err) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        var sql = 'CREATE USER "' + name + '"@"%";';
                                        con.query(sql, function (err) {
                                            if (err) {
                                                con.end();
                                                callback(err);
                                            } else {
                                                sql = 'GRANT ALL PRIVILEGES ON *.* To "' + name + '"@"%" IDENTIFIED BY "' + password + '";';
                                                con.query(sql, function (err) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        sql = 'FLUSH PRIVILEGES';
                                                        con.query(sql, function (err) {
                                                            if (err) {
                                                                con.end();
                                                                callback(err);
                                                            } else {
                                                                console.log('user successfully added went succesfully');
                                                                con.end();
                                                                callback(null);
                                                            }

                                                        });
                                                    }

                                                });
                                            }

                                        });
                                    }

                                });
                            }
                        }

                    });

                }
            });
        }

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
        if (err) {
            callback(err);
        } else {
            console.log(3);
            var sql = 'CREATE DATABASE scheduler ';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    console.log('Scheduler successfully created');
                    con.end();
                    callback(null);
                }

            });
        }

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
        if (err) {
            callback(err);
        } else {
            sql = 'CREATE TABLE CLASSES (' +
                'class_name varchar(200) not null primary key ,' +
                'capacity1 int(64) ,' +
                'capacity2 int(64))';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
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
                                if (err1) {
                                    con.end();
                                    callback(err);
                                } else {
                                    con.end();
                                    console.log("fine!");
                                    callback(null);
                                }
                            }
                        });
                    }
                }


            });
        }

    });
};

module.exports.copie = function makecopies(password, number, callback) {
    var mysql = require('mysql');
    var formatter = require('sql-formatter');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
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
                    sql = ' CREATE TABLE ' + temp + ' AS SELECT class_name, capacity1, capacity2 FROM CLASSES';
                    sql = formatter.format(sql);
                    con.query(sql, function (err2) {
                        if (err2) {
                            con.end();
                            callback(err2);
                        } else {
                            j++;
                            console.log(j);
                            if (i == (j - (number * 18))) {
                                con.end();
                                console.log(temp + 'was successfuly created and populated');
                                callback(null);
                            } else {
                                console.log("OK!");
                            }
                        }

                    });
                }

            }
        }

    });
};
module.exports.createOthers = function createothers(password, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var sql = 'CREATE TABLE courses (' +
                'id int(20) not null auto_increment primary key ,' +
                'name varchar(20) ,' +
                'number int(20) )';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    sql = 'CREATE table scheduled ( ' +
                        'id int(20) auto_increment not null primary key ,' +
                        'course text , ' +
                        'period varchar(20) not null )';
                    con.query(sql, function (err) {
                        if (err) {
                            con.end();
                            callback(err);
                        } else {
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
                            var error;
                            for (var i = 0; i < number; i++) {

                                for (var key in index) {
                                    mysql = 'insert into scheduled set ' +
                                        'period = "' + i + index[key] + '"';
                                    con.query(mysql, function (err) {
                                        if (err) {
                                            console.log(err);
                                            error += err;
                                        } else {
                                            console.log("okay!");
                                        }
                                    });
                                }
                            }
                            if (error) {
                                con.end();
                                callback(error);
                            } else {
                                sql = 'CREATE TABLE done  ( ' +
                                    'id int(20) auto_increment not null primary key, ' +
                                    'course varchar(20)  ,' +
                                    'period varchar(20) ,' +
                                    'course_value int(20))';
                                con.query(sql, function (err) {
                                    if (err) {
                                        con.end();
                                        callback(err);
                                    } else {
                                        con.end();
                                        console.log("Other table successfuly connected");
                                        callback(null);
                                    }

                                });
                            }
                        }

                    });
                }

            });
        }

    });
};

module.exports.createCredentials = function createcredential(password, user, noWeeks, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            var sql = 'CREATE TABLE credentials  ( ' +
                'id int(20) auto_increment not null PRIMARY KEY,' +
                'uname varchar(20) ,' +
                'ipaddress varchar(20),' +
                'numWeeks int(20) not null )';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
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
                    var ipaddress = address;
                    sql = 'INSERT INTO  credentials SET  ' +
                        'uname  = "' + user + '",' +
                        'ipaddress = "' + ipaddress + '",' +
                        'numWeeks =' + noWeeks;

                    con.query(sql, function (err) {
                        if (err) {
                            con.end();
                            callback(err, null);
                        } else {

                            console.log('credentials successfuly added');
                            con.end();
                            callback(null, address);
                        }
                    });
                }

            });
        }

    });
};
module.exports.getnoWeeks = function getnoWeeks(password, callback) {
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            var sql = 'select numWeeks from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


    });
};
module.exports.getdeparts = function getdeparts(facname, ipaddress, universname, dbpassword, callback) {
    var tempo = [];
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: universname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {

            var sql = 'select name from ' + facname + 'department ';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo.push(value[key2]);
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }

    });
};
module.exports.getfacs = function getfacs(ipaddress, universname, dbpassword, callback) {
    var tempo = [];
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: universname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            var sql = 'select name from faculties ';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            var value1 = value[key2];
                            tempo.push(value[key2]);
                            //console.log(tempo);
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


    });
};

module.exports.search = function search(element, data, callback) {
    var i = 0;

    for (var key in data) {
        var value = data[key];
        console.log(value);
        if (element == value) i++;
    }

    if (i == 0) {
        callback(false);
    } else {
        callback(true);
    }


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
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select dbpassword from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err,password);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


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
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select ipaddress from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


    });
};
module.exports.getfacname = function getfacname(password, callback) {
    var tempo = [];
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select facname from credentials';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo.push(value[key2]);
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }

    });
};
var getuname = function uname(password, callback) {
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select uname from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }
    });
};
module.exports.getuname = getuname;
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
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select ipaddress from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


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
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select user from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);
                }

            });
        }


    });
};
module.exports.getfaname = function getfanams(password, callback) {
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            sql = 'select facname from credentials where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            tempo = value[key2];
                        }
                    }
                    con.end();
                    callback(null, tempo);

                }
            });
        }


    });
};

module.exports.createdepCredentials = function createdepcredential(departname, ipaddress, dbpassword, uname, password, facname, noWeeks, callback) {
    var mysql = require('mysql');
    var empty = require('is-empty');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var file = require('fs');
            file.exists('password.txt', function (params) {
                if (params) {
                    console.log("exists");
                    file.readFile('password.txt', function (err, data) {
                        if (err) {
                            con.end();
                            callback(err);
                        } else {
                            if (!empty(data)) {
                                file.writeFile('password.txt', password, function (err) {
                                    if (err) {
                                        con.end();
                                        callback(err);
                                    } else {

                                        var sql = 'CREATE TABLE credentials  ( ' +
                                            'id int(20) auto_increment not null PRIMARY KEY,' +
                                            'departname varchar(20)  ,' +
                                            'facname varchar(20) ,' +
                                            'ipaddress varchar(20) ,' +
                                            'dbpassword varchar(20) ,' +
                                            'uname varchar(20),' +
                                            'numWeeks int(20) not null )';
                                        con.query(sql, function (err) {
                                            if (err) {
                                                con.end();
                                                callback(err);
                                            } else {
                                                sql = 'INSERT INTO  credentials SET  ' +
                                                    'departname  = "' + departname + '",' +
                                                    ' facname = "' + facname + '"' +
                                                    ' ,uname = "' + uname + '"' +
                                                    ', ipaddress = "' + ipaddress + '"' +
                                                    ', dbpassword = "' + dbpassword + '"' +
                                                    ', numWeeks = ' + noWeeks;

                                                con.query(sql, function (err) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log('credentials successfuly added');
                                                        con.end();
                                                        callback(null);
                                                    }

                                                });
                                            }

                                        });
                                    }
                                });
                            }
                        }
                    });
                }

            });
        }
    });
};

module.exports.createfaccredential = function createfaccredential(facname, password, uname, ipaddress, dbpassword, noweeks, callback) {
    var mysql = require('mysql');
    var empty = require('is-empty');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var file = require('fs');
            file.exists('password.txt', function (params) {
                if (params) {
                    console.log("exists");
                    file.readFile('password.txt', function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            if (!empty(data)) {
                                file.writeFile('password.txt', password, function (err) {
                                    if (err) {
                                        con.end();
                                        callback(err);
                                    } else {
                                        var sql = 'CREATE TABLE credentials  ( ' +
                                            'id int(20) auto_increment not null PRIMARY KEY,' +
                                            'facname varchar(20) ,' +
                                            'ipaddress varchar(20) ,' +
                                            'dbpassword varchar(20) ,' +
                                            'uname varchar(20),' +
                                            'numWeeks int(20) not null )';
                                        con.query(sql, function (err) {
                                            if (err) {
                                                con.end();
                                                callback(err);
                                            } else {
                                                sql = 'INSERT INTO  credentials SET  ' +
                                                    'facname  = "' + facname + '",' +
                                                    'ipaddress = "' + ipaddress + '",' +
                                                    'uname = "' + uname + '",' +
                                                    'dbpassword = "' + dbpassword + '",' +
                                                    'numWeeks =' + noweeks;

                                                con.query(sql, function (err) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log('credentials successfuly added');
                                                        con.end();
                                                        callback(null);
                                                    }

                                                });
                                            }

                                        });
                                    }
                                });
                            }
                        }
                    });

                }

            });
        }
    });
};

module.exports.createfactable = function createfactable(password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var sql = 'CREATE TABLE faculties  ( ' +
                'id int(20) auto_increment not null PRIMARY KEY,' +
                'name varchar(20) )';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    con.end();
                    callback(null);
                }


            });
        }

    });

};
module.exports.addfac = function addfac(password, facname, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            sql = 'INSERT INTO  faculties SET  ' +
                'name  = "' + facname + '"';

            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    console.log('faculty was successfuly added');
                    con.end();
                    callback(null);
                }

            });
        }

    });
};

module.exports.facheck = function facheck(facname, uname, ipaddress, dbpassword, callback) {
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
            var tenp = [];
            var i = 0;
            var sql = 'select name from faculties';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
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
                                con.end();
                                callback(null);

                            }

                        } else {
                            if (i == (temp.length - 1)) {
                                con.end();
                                callback(err);

                            }
                        }

                    });
                }

            });
        }

    });
};

module.exports.departmentcheck = function departmentcheck(facname, depname, uname, ipaddress, dbpassword, callback) {
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
            var tenp = [];
            var i = 0;
            var sql = 'select name from ' + facname + 'department where id = 1';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
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
                                con.end();
                                callback(null);

                            }

                        } else {
                            if (i == (temp.length - 1)) {
                                con.end();
                                callback(err);

                            }
                        }

                    });
                }

            });
        }

    });
};
module.exports.createdeparttable = function createdeparttable(facname, dbpassword, uname, ipaddress, callback) {
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
            var sql = 'CREATE TABLE ' + facname + 'department  ( ' +
                'id int(20) auto_increment not null PRIMARY KEY,' +
                'name varchar(20) )';
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    con.end();
                    console.log("yo!");
                    callback(null);
                }

            });
        }

    });

};

module.exports.adddepart = function adddepart(departname, facname, uname, ipaddress, dbpassword, callback) {
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
            sql = 'INSERT INTO  ' + facname + 'department SET  ' +
                'name  = "' + departname + '"';

            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    console.log('department was successfuly added');
                    con.end();
                    callback(null);
                }

            });
        }

    });
};


module.exports.addcourse = function addcourse(password, coursename, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            sql = 'INSERT INTO  courses SET  ' +
                'name  = "' + coursename + '",' +
                'number = ' + number;

            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    console.log('couse was successfuly added');
                    con.end();
                    callback(null);
                }

            });
        }

    });
};
module.exports.addfaccourse = function addfaccourse(facname, ipaddress, uname, dbpassword,
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
            console.log(sql);
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

module.exports.addhall = function addhall(period, ipaddress, uname, dbpassword,
    classname, capacity, callback) {
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
            sql = 'INSERT INTO `' + period + '` SET  ' +
                'class_name  = "' + classname + '",' +
                'capacity1 = ' + capacity[0] + ' ,' +
                'capacity2 = ' + capacity[1];
            console.log(sql);
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    con.end();
                    callback(null);
                }

            });
        }

    });
};

module.exports.createfaccourses = function createfaccourses(facname, ipaddress, uname, dbpassword, callback) {
    var mysql = require('mysql');
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
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
            var sql = 'CREATE TABLE ' + facname + 'courses (' +
                'id int(20) not null auto_increment primary key ,' +
                'name varchar(20) ,' +
                'number int(20) )';
            con.query(sql, function (err) {
                if (err) {
                    console.log(err);
                    con.end();
                    callback(err);
                } else {
                    con.end();
                    callback(null);
                }
            });
        }
    });
};
module.exports.dropcourses = function dropcouses(password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            var sql = "drop table courses";
            con.query(sql, function (err) {
                if (err) {
                    con.end();
                    callback(err);
                } else {
                    sql = 'create table courses (' +
                        'id int auto_increment not null primary key,' +
                        ' name varchar(100),' +
                        'number int(20))';
                    con.query(sql, function (err) {
                        if (err) {
                            con.end();
                            callback(err);
                        } else {
                            con.end();
                            callback(null);
                            console.log("courses where droped successfuly!");
                        }
                    });
                }
            });
        }
    });

};
module.exports.createFacsheduledEXT = function createFacsheduledEXT(ipaddress,uname,password, facname, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            mysql = 'create table ' + facname + 'scheduled (' +
                'id int(20) auto_increment not null primary key' +
                ', course text ' +
                ', period varchar(50))';
            con.query(mysql, function (err) {
                if (err) {
                    con.end();
                    console.log(err);
                    callback(err);
                } else {
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
                    var error;
                    for (var i = 0; i < number; i++) {

                        for (var key in index) {
                            mysql = 'insert into ' + facname + 'scheduled set ' +
                                'period = "' + i + index[key] + '"';
                            con.query(mysql, function (err) {
                                if (err) {
                                    console.log(err);
                                    error += err;
                                } else {
                                    console.log("okay!");
                                }
                            });
                        }
                    }
                    if (error) {
                        con.end();
                        callback(error);
                    } else {
                        con.end();
                        callback(null);
                    }
                }
            });
        }
    });
};
module.exports.createFacsheduled = function createFacsheduled(password, facname, number, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err);
        } else {
            mysql = 'create table ' + facname + 'scheduled (' +
                'id int(20) auto_increment not null primary key' +
                ', course text ' +
                ', period varchar(50))';
            con.query(mysql, function (err) {
                if (err) {
                    con.end();
                    console.log(err);
                    callback(err);
                } else {
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
                    var error;
                    for (var i = 0; i < number; i++) {

                        for (var key in index) {
                            mysql = 'insert into ' + facname + 'scheduled set ' +
                                'period = "' + i + index[key] + '"';
                            con.query(mysql, function (err) {
                                if (err) {
                                    console.log(err);
                                    error += err;
                                } else {
                                    console.log("okay!");
                                }
                            });
                        }
                    }
                    if (error) {
                        con.end();
                        callback(error);
                    } else {
                        con.end();
                        callback(null);
                    }
                }
            });
        }
    });
};



var dropWorkspace = function dropWorkspace(callback) {
    var fs = require('fs');
    fs.readFile('password.txt', function (err, data) {
        if (err || data === null) {
            callback(err, null);
        } else {
            getuname(data.toString(), function (err, uname) {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
            var mysql = require('mysql');
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: data.toString(),
                database: "scheduler"
            });
            var sql = 'drop database scheduler;';
            con.query(sql, function (err) {
                if (err) {
                    console.log(err);
                    con.end();
                    callback(err,null);
                } else {
                            var sql = 'drop user ' + uname + '';
                            con.query(sql,function (err,res) {
                                con.end();
                                callback(null,res);
                            });                            
                        }
                    });
                }
            });
        }

    });
};
module.exports.dropWorkspace = dropWorkspace;