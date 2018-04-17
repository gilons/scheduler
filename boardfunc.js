module.exports.fits = function fits(classes, noRegistered, callback) {
    var fits = new require('./classes').FITS;
    for (var key in classes) {
        var value = classes[key];
        if (value >= noRegistered) {
            if ((value - noRegistered) <= 10) {
                fits.takeNewbestfit(key);
                fits.takebestfitspace((value - noRegistered), key);
                fits.takebestclassvalue(value, key);
            } else if ((value - noRegistered) > 10) {
                fits.takeNewworsefit(key);
                fits.takeworsefitspace((value - noRegistered), key);
                fits.takeworseclassvalue(value, key);
            }
        }
        if (value < noRegistered) {
            fits.takeNewworsefit(key);
            fits.takeworsefitspace((noRegistered - value), key);
            fits.takeworseclassvalue(value, key);
        }
    }
    callback(fits);
};

module.exports.choose_class = function choose_class(host, user, password, classes, classs, course, tablename, coursename, callback) {
    var changes = require('./classes').INITIALS;
    var sql;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        for (var key in classes) {
            var valueglo = classes[key];
            var temp;
            var tempo;
            temo = null;
            if (key == classs) {
                if (valueglo >= course) {
                    if ((valueglo - course) <= 10) {
                        sql = 'delete from ' + tablename + ' where class_name = "' + key + '"';
                        con.query(sql, function (err, result) {
                            if (err) {
                                callback(err, null);
                            }
                            console.log('number of components deleted are ', result.affectedRows);

                            changes.takeinitialclassname(classs);
                            changes.takeinitialcoursename(coursename);
                            changes.takeinitialregistered(course);
                            changes.getindex(tablename);
                            changes.takeinitialspace(valueglo);
                            console.log("scheduled table successfuly updated ");
                            con.end();
                            tempo = null;
                            callback(null, changes);
                        });
                    }
                    if ((valueglo - course) > 10) {
                        temp = valueglo - course;
                        sql = 'update ' + tablename + ' set capacity1 = ' + temp + ' where class_name = "' + key + '"';
                        con.query(sql, function (err, result) {
                            if (err) {
                                callback(err, null);
                                con.end();
                            }
                            console.log(result.affectedRows + " records update");
                            changes.takeinitialclassname(classs);
                            changes.takeinitialcoursename(coursename);
                            changes.takeinitialregistered(course);
                            changes.getindex(tablename);
                            changes.takeinitialspace(valueglo);
                            console.log("scheduled table successfuly updated ");
                            tempo = null;
                            con.end();
                            callback(null, changes);
                        });

                    }

                }
                if (valueglo < course) {
                    temp = course - valueglo;
                    sql = 'delete from ' + tablename + ' where class_name = "' + classs + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                        changes.takeremainingstudent(temp);
                        console.log("course partly scheduled");
                        console.log("scheduled table successfuly updated ");
                        con.end();
                        changes.takeinitialclassname(classs);
                        changes.takeinitialcoursename(coursename);
                        changes.takeinitialregistered(course);
                        changes.getindex(tablename);
                        changes.takeinitialspace(valueglo);
                        tempo = null;
                        callback(null, changes);
                    });
                }
            }


        }

    });




};
module.exports.undoOut = function undoOut(user, password, host, changes, callback) {

    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log("undo function was successfuly connected");

        var tempo;
        tempo = null;
        var sql;
        var index;
        var name;
        var temp;
        temp = changes.getinitialclassname();
        temp1 = changes.getinitialspace();
        index = changes.giveindex();
        name = changes.getinitialcoursename();
        var temp2;
        temp2 = changes.getinitialregistered();
        console.log(index, temp1);
        sql = 'select capacity1 from ' + index + ' where class_name = "' + temp + '"';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    tempo = value[key2];
                    console.log(tempo);
                }
            }
            if (tempo == null) {
                sql = 'INSERT into ' + index + ' set class_name = "' + temp + '", capacity1 = ' + temp1 + '';
                con.query(sql, function (err, result) {
                    if (err) {
                        callback(err, null);
                        con.end();
                    }
                    console.log(index + " successfuly reverted");

                });
            }
            if (tempo != null) {

                sql = 'update ' + index + ' set capacity1 = ' + temp1 + ' where class_name = "' + temp + '" ';
                con.query(sql, function (err, result) {
                    if (err) {
                        callback(err, null);
                        con.end();
                    }
                    console.log(index + " successfuly reverted");
                });
            }
        });


    });
};

module.exports.current_classes = function current_classes(classname, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "santers1997",
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        i = 0;
        temp = [];
        temp1 = [];
        temp2 = [];
        sql = 'select class_name from ' + classname + ' ';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];

                for (var key2 in value) {
                    temp.push(value[key2]);
                }
            }
            sql = 'select capacity1 from ' + classname + '';
            con.query(sql, function (err, result) {
                if (err) {
                    callback(err, null);
                    con.end();
                }
                for (var key in result) {
                    var value = result[key];
                    for (var key2 in value) {
                        temp1.push(value[key2]);
                    }
                }
                for (i = 1; i < temp.length; ++i) {
                    temp2[temp[i]] = temp1[i];
                }
                con.end();
                callback(null, temp2);

            });


        });

    });


};

module.exports.current_course = function current_course(password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        i = 0;
        temp = [];
        temp1 = [];
        temp2 = [];

        sql = 'select course_name from courses ';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp.push(value[key2]);
                    // console.log(value);
                }
            }
            sql = 'select number from courses ';
            con.query(sql, function (err, result) {
                if (err) {
                    callback(err, null);
                    con.end();
                }
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
            });

        });

    });

};

module.exports.classtable_existence = function classtable_existence(incoming, present, callback) {
    u = 0;
    for (i = 0; i < incoming.length; ++i) {
        for (j = 1; j <= present.length; ++j) {
            if (present[j] === incoming[i]) {
                ++u;
            }
        }
    }
    if (u != null) {
        callback(false);
    }
    callback(true);
};

module.exports.course_value = function course_value(name, password, callback) {
    sql = null;
    temp = null;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        sql = 'select number from courses where course_name = "' + name + '"';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end(err);
            }
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp = value[key2];
                }

            }

            callback(null, temp);
        });
        con.end();
    });

};
module.exports.getclass_names = function getclass_names(host, user, password, callback) {
    var sql;
    i = 0;
    var temp = [];
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        sql = 'show tables;';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];
                i++;
                for (var key1 in value) {
                    var value1 = value[key1];
                    temp.push(value1);

                }
            }
            callback(null, temp);
            con.end();
        });

    });


};

module.exports.localchanges = function localchanges(password, classes, classs, course, tablename, coursename, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err);
        }

        console.log('connected');
        for (var key in classes) {
            var valueglo = classes[key];
            var sql;
            var temp;
            var tempo;
            temo = null;
            if (key == classs) {
                if (valueglo >= course) {
                    if ((valueglo - course) <= 10) {
                        sql = 'delete from courses where course_name = "' + coursename + '"';
                        con.query(sql, function (err, result) {
                            if (err) {
                                callback(err);
                                con.end();
                            }
                            console.log('number of affected rows is ' + result.affectedRows);
                            sql = 'select course from scheduled where period = "' + tablename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err);
                                }
                                for (var key in result) {
                                    var value = result[key];
                                    for (var key2 in value) {
                                        tempo = value[key2];
                                    }
                                }
                                if (tempo != null) {
                                    coursename = tempo + '<br/>' + coursename;
                                    sql = 'update scheduled set course = "' + coursename + '" where period = "' + tablename + '" ';
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            callback(err);
                                            con.end();
                                        }
                                        console.log("scheduled table successfuly updated ");
                                        con.end();
                                        tempo = null;
                                        callback(null);
                                    });
                                }
                                if (tempo == null) {
                                    sql = 'INSERT into scheduled set course = "' + coursename + '" , period = "' + tablename + '" ';
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            callback(err);
                                            con.end();
                                        }

                                        console.log('new course successfuly scheduled');
                                        con.end();
                                        tempo = null;
                                        callback(null);
                                    });
                                }

                            });
                        });
                    }
                    if ((valueglo - course) > 10) {
                        temp = valueglo - course;
                        sql = 'delete from courses where course_name = "' + coursename + '"';
                        con.query(sql, function (err, result) {
                            if (err) {
                                callback(err);
                                con.end();
                            }
                            console.log('number of affected rows is ' + result.affectedRows);
                            sql = 'select course from scheduled where period = "' + tablename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err);
                                    con.end();
                                }
                                for (var key in result) {
                                    var value = result[key];
                                    for (var key2 in value) {
                                        tempo = value[key2];
                                    }
                                }
                                if (tempo != null) {
                                    coursename = tempo + '<br/>' + coursename;
                                    sql = 'update scheduled set course = "' + coursename + '" where period = "' + tablename + '" ';
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            callback(err);
                                            con.end();
                                        }
                                        console.log("scheduled table successfuly updated ");
                                        tempo = null;
                                        con.end();
                                        callback(null);
                                    });
                                }
                                if (tempo == null) {
                                    sql = 'INSERT into scheduled set course = "' + coursename + '" , period = "' + tablename + '" ';
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            callback(err);
                                            con.end();
                                        }
                                        tempo = null;
                                        console.log('new course successfuly scheduled');
                                        con.end();
                                        callback(null);
                                    });
                                }

                            });
                        });
                    }

                }
                if (valueglo < course) {
                    temp = course - valueglo;
                    sql = 'update courses set  number = "' + temp + '" where course_name = "' + coursename + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                        console.log("courses table successfuly updated");
                        sql = 'select course from scheduled where period = "' + tablename + '"';
                        con.query(sql, function (err, result) {
                            if (err) {
                                callback(err, null);
                                con.end();
                            }
                            for (var key in result) {
                                var value = result[key];
                                for (var key2 in value) {
                                    tempo = value[key2];
                                }
                            }
                            if (tempo != null) {
                                coursename = tempo + '<br/>' + coursename;
                                sql = 'update scheduled set course = "' + coursename + '" where period = "' + tablename + '" ';
                                con.query(sql, function (err, result) {
                                    if (err) {
                                        callback(err, null);
                                        con.end();
                                    }
                                    console.log("scheduled table successfuly updated ");
                                    con.end();
                                    tempo = null;
                                    callback(null, changes);
                                });
                            }
                            if (tempo == null) {
                                sql = 'INSERT into scheduled set course = "' + coursename + '" , period = "' + tablename + '" ';
                                con.query(sql, function (err, result) {
                                    if (err) {
                                        callback(err, null);
                                        con.end();
                                    }
                                    console.log('new course successfuly scheduled');
                                    con.end();

                                    tempo = null;
                                    callback(null, changes);
                                });
                            }
                        });
                    });

                }

            }
        }
    });

};

module.exports.localundo = function localundo(password, changes, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log("undo function was successfuly connected");

        var tempo;
        tempo = null;
        var sql;
        var index;
        var name;
        var temp;
        temp = changes.getinitialclassname();
        temp1 = changes.getinitialspace();
        index = changes.giveindex();
        name = changes.getinitialcoursename();
        var temp2;
        temp2 = changes.getinitialregistered();
        console.log(index, temp1);

        sql = 'select number from courses where course_name = "' + name + '"';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            console.log('selection ok!');
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    tempo = value[key2];
                }
            }
            if (tempo == null) {
                sql = 'INSERT into courses set course_name = "' + name + '",number ="' + temp2 + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        callback(err, null);
                        con.end();
                    }
                    console.log("courses table was successfuly updated");
                    sql = 'select course from scheduled where period = "' + index + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                        for (var key in result) {
                            var value = result[key];
                            for (var key2 in value) {
                                tempo = value[key2];
                            }
                        }
                        if (tempo.length == name.length) {
                            sql = 'delete from scheduled where course = "' + name + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err, null);
                                    con.end();
                                }
                                console.log("scheduled table successfuly reverted");
                                con.end();
                                callback(null, "successful!");
                                tempo = null;
                            });
                        }
                        if (tempo.length != name.length) {
                            var tempname = '<br/>' + name;
                            tempo = tempo.relace(tempname, '');
                            sql = 'update scheduled set course = "' + tempo + '" where period = "' + index + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err, null);
                                    con.end();
                                }
                                console.log("scheduled table successfuly updated");
                                con.end();
                                callback(null, "successful!");
                                tempo = null;

                            });
                        }
                    });
                });
            }
            if (tempo != null) {
                sql = 'update courses set number = ' + temp2 + ' where course_name = "' + name + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        callback(err, null);
                        con.end();
                    }
                    console.log("courses table was successfuly updated");
                    tempo = null;
                    temp = changes.getinitialclassname();
                    temp2 = changes.getinitialspace();
                    index = changes.giveindex();
                    sql = 'select course from scheduled where period = "' + index + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                        for (var key in result) {
                            var value = result[key];

                            for (var key2 in value) {
                                tempo = value[key2];
                            }
                        }
                        if (tempo.length == name.length) {
                            sql = 'delete from scheduled where course = "' + name + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err, null);
                                    con.end();
                                }
                                console.log("scheduled table successfuly reverted");
                                con.end();
                                callback(null, "successful!");
                            });
                        }
                        if (tempo.length != name.length) {
                            name = '<br/>' + name;
                            tempo = tempo.relace(name, '');
                            sql = 'update scheduled set course = "' + tempo + '" where period = "' + index + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    callback(err, null);
                                    con.end();
                                }
                                console.log("scheduled table successfuly updated");
                                con.end();
                                callback(null, "successful!");

                            });
                        }
                    });
                });
            }
        });

    });
};


module.exports.getdepartscheduled = function getdepartscheduled(password, callback) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        i = 0;
        temp = [];
        temp1 = [];
        temp2 = [];

        sql = 'select period from scheduled ';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp.push(value[key2]);
                    // console.log(value);
                }
            }
            sql = 'select course from scheduled ';
            con.query(sql, function (err, result) {
                if (err) {
                    callback(err, null);
                    con.end();
                }
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
            });

        });

    });

};

module.exports.submitfaculty = function submitfaculty(password,user,host,facname,origine, callback) {
    var sql;
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        for(var key in origine){
            var valueglo = origine[key];
            sql = 'select course from '+faname+'scheduled where period = "'+key+'"';
            con.query(sql,function (err,result) {
                if (err) {
                    callback(err);
                    con.end();
                }
                for (var key1 in result) {
                    var value = result[key1];
                    for (var key2 in value) {
                        tempo = value[key2];
                    }
                }
                if(tempo == null){
                    sql = 'INSERT into '+faname+'scheduled set course = "' + valueglo + '" , period = "' +key+ '" ';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                    });
                }
                if(tempo != null){
                    tempo+= '<br/>'+valueglo;
                    sql = 'update '+faname+'sheduled set course = "' + tempo + '" where period = "' + key + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }

                    });
                }
            });
        }
    });
};

module.exports.getfacscheduled = function getfacscheduled(ipaddress,uname,dbpassword,facname,callback)   {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        i = 0;
        temp = [];
        temp1 = [];
        temp2 = [];

        sql = 'select period from '+facname+'scheduled ';
        con.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                con.end();
            }
            for (var key in result) {
                var value = result[key];
                for (var key2 in value) {
                    temp.push(value[key2]);
                    // console.log(value);
                }
            }
            sql = 'select course from '+facname+'scheduled ';
            con.query(sql, function (err, result) {
                if (err) {
                    callback(err, null);
                    con.end();
                }
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
            });

        });

    });
};

module.exports.submitunivers = function submitunivers(origine,ipaddress,uname,dbpassword,callback) {
    var sql;
    var tempo;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: ipaddress,
        user: uname,
        password: dbpassword,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            callback(err, null);
            con.end();
        }
        console.log('connected');
        for (var key in origine) {
            var valueglo = origine[key];
            sql = 'select course from scheduled where period = "' + key + '"';
            con.query(sql, function (err, result) {
                if (err) {
                    callback(err);
                    con.end();
                }
                for (var key1 in result) {
                    var value = result[key1];
                    for (var key2 in value) {
                        tempo = value[key2];
                    }
                }
                if (tempo == null) {
                    sql = 'INSERT into scheduled set course = "' + valueglo + '" , period = "' + key + '" ';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }
                    });
                }
                if (tempo != null) {
                    tempo += '<br/>' + valueglo;
                    sql = 'update sheduled set course = "' + tempo + '" where period = "' + key + '"';
                    con.query(sql, function (err, result) {
                        if (err) {
                            callback(err, null);
                            con.end();
                        }

                    });
                }
            });
        }
    });
};

