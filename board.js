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
    "CV_ROOM1": [30, 45],
    "CV_ROOM2": [30, 45],
    "CV_ROOM3": [30, 45],
    "CV_ROOM4": [30, 45],
    "CV_ROOM5": [30, 45],
    "CV_ROOM6": [30, 45],
    "AMPHY_750": [325, 0],
    "AMPHY_600": [342, 0],
    "AMPHY_250": [110, 0],
    "AMPHY_150A": [63, 0],
    "AMPHY_150B": [63, 0],
    "AMPHY_150C": [63, 0],
    "AMPHY_150D": [63, 0],
    "AMPHY_150E": [63, 0],
    "CRBLK1_150A": [105, 140],
    "CRBLK1_150B": [104, 84],
    "CRBLK1_100A": [84, 63],
    "CRBLK1_100B": [84, 63],
    "CRBLK2_150A": [84, 0],
    "CRBLK2_150B": [84, 0],
    "CRBLK2_100A": [51, 0],
    "CRBLK2_100B": [54, 0],
    "CRBLK2_50A": [30, 0],
    "CRBLK2_50B": [30, 0],
    "CRBLK2_50C": [30, 0],
    "CRBLK2_50D": [30, 0],
    "CRBLK2_50E": [30, 0],
    "CRBLK2_50F": [30, 0],
    "CRBLK2_50G": [30, 0],
    "CRBLK2_50H": [30, 0],
    "CRBLK1_50A": [30, 0],
    "CRBLK1_50B": [30, 0],
    "CRBLK1_50C": [30, 0],
    "CRBLK1_50D": [30, 0],
    "CRBLK1_50E": [30, 0],
    "CRBLK1_50F": [30, 0],
    "CRBLK1_50G": [30, 0],
    "CRBLK1_50H": [30, 0],
    "REST1": [24, 0],
    "REST2": [36, 0],
    "REST3": [28, 0],
    "REST4": [74, 0],
    "REST5": [74, 0],
    "REST6": [78, 0],
    "REST7": [56, 0],
};
var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
var index = [];
var courses = [];
var td = "<td>";
var tdno = "/td";
var tr = "<tr>";
var trno = "</tr>";

var change = {};
var FACNAME = null;

var boardfunc = require('./boardfunc');
var createfunct = require('./createfunc');


day.forEach(element => {
    periods.forEach(value => {
        index.push(element.substr(0, 3) + '_' + value.substr(0, 2));
    });
});
/* please you will have to take note of putting the option to create the main class data base if it does not exist */
var express = require('express');
var handlebars = require('express3-handlebars');
path = require("path");
var autofunct = require('./autofunc');
var app = new express();
app.set('port', process.env.PORT || 3000);
var previousclass = null;
var nulloccurance = 0;
var changeMade = [];
var undoCount = 0;
var made = [];
//require('./templatengines')(app);
/* using just handlebars.create({
    defaultLayout: 'main'
}); makes the code to crashe for a reason i don't know. */
var fs = require('fs');
handlebars = handlebars.create({
    helpers: {
        additem: function (value) {
            return 'item' + value;
        },
        id1: function (context0, context1, context2) {
            return context0 + context1.substr(0, 3) + '_' + context2.substr(0, 2);
        },
        id2: function (context1, context2) {
            return 'course' + context1.substr(0, 3) + '_' + context2.substr(0, 2);
        },
        id3: function (context1, context2) {
            return 'class' + context1.substr(0, 3) + '_' + context2.substr(0, 2);
        },
        tojava: function (data) {
            return JSON.stringify(data);
        },
        add1: function (params) {
            return params + 1;
        },
        checkNoCourse: function (params) {
            return (params === 'No course') ? '' : params;
        }

    },
    defaultLayout: 'main'
});
app.use(require('body-parser')());
asyncloop = require('node-async-loop');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.use(function (request, response, next) {
    if (!response.locals.partials) response.locals.partials = {};
    response.locals.partials.courses = courses;
    next();
});

function replacePreviousFacvalue(Fac, callback) {
    var fs = require('fs');
    fs.readFile('previousfac.txt',
        function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var previousFac = data.toString();
                fs.writeFile('previousfac.txt',Fac,function (err){
                    callback(err);

                });
            }
        });
}
app.get('/doitalone', function (request, response) {
    fs.readFile("password.txt", function (err, pass) {
        if (err) {
            console.log(err);
        } else {
            var password = pass.toString();
            console.log(password);
            createfunct.getuname(password, function (err, uname) {
                if (err) console.log(err);
                createfunct.getipaddress(password,
                    function (err, ipaddress) {
                        if (err) console.log(err);
                        fs.readFile('password.txt', function (err, params) {
                            if (err) console.log(err);
                            var dbpassword = params.toString();
                            fs.readFile('previousfac.txt', function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    FACNAME = data.toString();
                                    autofunct.getfacscheduled(FACNAME, ipaddress, uname, dbpassword).
                                    then(function (schedule) {
                                        console.log(schedule, '************************************');
                                        createfunct.getnoWeeks(password, function (err, week) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                autofunct.getfacs(ipaddress, uname, dbpassword).
                                                then(function (facs) {
                                                    console.log(week);
                                                    var weeks = [];
                                                    for (var i = 0; i < week; i++) {
                                                        weeks[i] = i;
                                                    }
                                                    console.log(schedule);
                                                    response.render('doitalone', {
                                                        day: day,
                                                        periods: periods,
                                                        scheduled: schedule,
                                                        week: weeks,
                                                        facname: FACNAME,
                                                        facs: facs
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        });

                    });
            });
        }
    });
});
app.get('/schedule', function (request, response) {

    fs.readFile("password.txt", function (err, pass) {
        if (err) {
            console.log(err);
        } else {
            var password = pass.toString();
            console.log(password);
            createfunct.getfacname(password, function (err, facname) {
                if (err) console.log(err);
                createfunct.getuname(password, function (err, uname) {
                    if (err) console.log(err);
                    createfunct.getipaddress(password,
                        function (err, ipaddress) {
                            if (err) console.log(err);
                            createfunct.getdbpassword(password, function (err, dbpassword) {
                                console.log(err);
                                autofunct.getfacscheduled(facname[0], ipaddress, uname, dbpassword).
                                then(function (schedule) {
                                    createfunct.getnoWeeks(password, function (err, week) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(week);
                                            var weeks = [];
                                            for (var i = 0; i < week; i++) {
                                                weeks[i] = i;
                                            }
                                            console.log(schedule);
                                            response.render('test', {
                                                day: day,
                                                periods: periods,
                                                scheduled: schedule,
                                                week: weeks
                                            });
                                        }
                                    });
                                });
                            });

                        });
                });

            });
        }
    });
});

function insertresult(result, fit, classes) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        asyncloop(fit, function (value, next) {
            autofunct.class_value(classes, value).then(function (val) {
                result.push([value, val]);
                i++;
                if (i === fit.length - 1) {
                    resolve();
                }
                next();
            });
        })
    });
}

function arrtransform(array) {
    var temp = [];
    var i = 0;
    for (var key in array) {
        temp.push([key, array[key]]);
    }
    return temp;
}

function comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}

function dcomparator(a, b) {
    if (a[2] > b[2]) return -1;
    if (a[2] < b[2]) return 1;
    return 0;
}

function createglobalarray(middleclassvalue, middlespace) {
    var temp = [];
    for (var i = 0; i < middleclassvalue.length; i++) {
        temp[i] = [middleclassvalue[i][0], middleclassvalue[i][1], middlespace[i][1]];
    }
    return temp;
}

function sortdif25(middlespace) {
    console.log(middlespace);
    var i = 0;
    var temp = [];
    asyncloop(middlespace, function (space, next) {
        var spacer = spacefinder(31, space[2]);
        temp.push([space[0], space[1], spacer]);
        if (i === middlespace.length - 1)
            i++;
        next();
    });
    return temp.sort(dsortFunction);
}

function spacefinder(noRegistered, value) {
    var space = (noRegistered - value) > 0 ? noRegistered - value : value - noRegistered;
    return space;
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function dsortFunction(a, b) {
    if (a[2] === b[2]) {
        return 0;
    } else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}

function sortdbest(bestspace, noRegistered) {
    var i = 0;
    var temp = [];
    asyncloop(bestspace, function (space, next) {
        var spacer = spacefinder(noRegistered, space[1]);
        temp.push([space[0], space[1], spacer]);
        if (i === bestspace.length - 1)
            i++;
        next();
    });
    return temp.sort(dsortFunction);
}

function findfits(previousclass, origine, course, classs, callback) {
    var schedule = [];
    fs.readFile("password.txt", function (err, pass) {
        var password = pass.toJSON();
        createfunct.getdbpassword(password, function (err, dbpassword) {
            if(err) dbpassword = password;
            createfunct.getipaddress(password, function (err, ipaddress) {
                if (err) console.log(err);
                console.log("++++++++++++++++++++++++++++++++++++++",ipaddress);
                createfunct.getuname(password, function (err, universname) {
                    if (err) {
                        callback(err, null);
                    } else {
                        getfacname(password, origine, function (facname) {
                            autofunct.course_value(ipaddress, universname, course, facname, dbpassword).
                            then(function (class_value) {
                                autofunct.current_classes(classs, ipaddress, dbpassword,
                                    universname).then(function (classes) {
                                    autofunct.fitselse(previousclass, classes, class_value).
                                    then(function (fits) {
                                        var fit = [];
                                        var middlefit = [];
                                        fit = fits.getbestfit();
                                        middlefit = fits.getmiddlefit();
                                        var result = [];
                                        var bestfitarraylimit = fit.length;
                                        var middlespace = fits.getmiddlefitspace();
                                        middlespace = arrtransform(middlespace);
                                        var middleclassvalue = fits.getmiddlefitclassvalue();
                                        var bestfitclassvalue = fits.getbestclassvalue();
                                        var worsefitclassvalue = fits.getworseclassvalue();
                                        bestfitclassvalue = arrtransform(bestfitclassvalue);
                                        middleclassvalue = arrtransform(middleclassvalue);
                                        if (middleclassvalue[0]) {
                                            middleclassvalue = (sortdif25(createglobalarray(middleclassvalue, middlespace)));
                                        }
                                        if (bestfitclassvalue[0]) bestfitclassvalue =
                                            sortdbest(bestfitclassvalue, class_value);
                                        result.push(bestfitclassvalue);
                                        result.push(middleclassvalue);
                                        result.push(sortdif25(arrtransform(worsefitclassvalue)));
                                        var mifflefitsarraylimit = bestfitarraylimit + middlefit.length - 1;
                                        var worsefit = fits.getworsefit();
                                        result.push(fit);
                                        result.push(middlefit);
                                        result.push(worsefit);
                                        autofunct.course_value(ipaddress, universname, course, facname, dbpassword).
                                        then(function (corse) {
                                            autofunct.getfacscheduled(facname, ipaddress, universname, dbpassword).
                                            then(function (scheduled) {
                                                result.push(["bestfitlimit", bestfitarraylimit]);
                                                result.push(["middlefitlimit", mifflefitsarraylimit]);
                                                result.push([course, corse]);
                                                result.push(scheduled);
                                                callback(null, result);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    });
}

function addtomade(changes) {
    return new Promise(function (resolve, reject) {
        var temp = {
            initialclassname: changes.getinitialclassname(),
            initialspace: changes.getinitialspace(),
            initialcoursename: changes.getinitialcoursename(),
            initialregistered: changes.getinitialregistered(),
            index: changes.getindex(),
            remainingstudent: changes.getremainingsutdent()
        };
        made[undoCount] = temp;
        resolve();
    });
}

function makechanges(receiver, origine, callback) {
    fs.readFile("password.txt", function (err, pass) {
        if (err) {
            callback(err, null);
        } else {
            var password = pass.toString();
            createfunct.getdbpassword(password, function (err, dbpassword) {
                if (err) dbpassword = password;
                createfunct.getipaddress(password, function (err, ipaddress) {
                    if (err) {
                        callback(err, null);
                    } else {
                        createfunct.getuname(password, function (err, universname) {
                            if (err) {
                                callback(err, null);
                            } else {
                                getfacname(password, origine, function (facname) {
                                    autofunct.course_value(ipaddress, universname, receiver[1], facname, dbpassword).
                                    then(function name(course_value) {
                                        autofunct.current_classes(receiver[0], ipaddress,
                                            dbpassword, universname).then(function (classes) {
                                            autofunct.makechanges(facname, dbpassword,
                                                ipaddress, universname, classes, receiver[2], course_value,
                                                receiver[0], receiver[1]).then(function (changes) {
                                                addtomade(changes).then(function () {
                                                    callback(null, changes);
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}
app.get('/', function (requuest, response) {
    response.render('entry', null);
});
app.get("/department", function (request, response) {
    fs.readFile("password.txt", function (err, password) {
        if (err) {
            console.log(err);
        } else {
            var courses = {};
            var i = 0;
            boardfunc.current_course(password, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        courses[i] = {
                            name: key,
                            value: value
                        };
                        i++;
                    }
                    console.log(courses);
                    response.render("department", {
                        course: courses
                    });
                }
            });
        }
    });


});
app.get("/create", function (request, response) {
    var password;
    //response.sendFile(path.join(__dirname+'/create.html'));
    fs.readFile("password.txt", function (err, data) {
        password = data.toString();
        createfunct.getipaddress(password, function (err, ipaddress) {
            if (err) {
                console.log(err);
            } else {
                createfunct.getuname(password, function (err, uname) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getnoWeeks(password, function (err, noweeks) {
                            if (err) {
                                console.log(err);
                            } else {
                                boardfunc.collectfacschedule(ipaddress, password, uname).
                                then(function (scheduled) {
                                    boardfunc.collectfacCourses(ipaddress, password, uname).
                                    then(function (collection) {
                                        boardfunc.getperiods(password, uname, ipaddress).
                                        then(function (period) {
                                            var weeks = [];
                                            for (var i = 0; i < noweeks; i++) {
                                                weeks[i] = i;
                                            }
                                            console.log('giless!!');
                                            var keyword = ipaddress + '-' + uname + '-' + noweeks + '-' + password;
                                            if (!collection) {
                                                response.render("create", {
                                                    facs: result,
                                                    keyword: keyword,
                                                    collection: null,
                                                    scheduled: scheduled,
                                                    week: weeks,
                                                    periods: periods,
                                                    day: day,
                                                    period: period
                                                });
                                            } else {
                                                autofunct.getfacs(ipaddress, uname, password).then(function (result) {
                                                    response.render("create", {
                                                        facs: result,
                                                        keyword: keyword,
                                                        collection: collection,
                                                        scheduled: scheduled,
                                                        week: weeks,
                                                        periods: periods,
                                                        day: day,
                                                        period: period
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});
app.get("/faculty", function (request, response) {
    var password;
    //response.sendFile(path.join(__dirname+'/create.html'));
    fs.readFile("password.txt", function (err, data) {
        password = data.toString();
        createfunct.getfaname(password, function (err, facname) {
            if (err) {
                console.log(err);
            } else {
                createfunct.getipaddress(password, function (err, ipaddress) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getuname(password, function (err, universname) {
                            if (err) {
                                console.log(err);
                            } else {
                                createfunct.getnoWeeks(password, function (err, noweeks) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        createfunct.getdbpassword(password, function (err, dbpassword) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                createfunct.getdeparts(facname, ipaddress, universname, dbpassword, function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        autofunct.faccurrent_courses(facname, ipaddress, universname, dbpassword).
                                                        then(function (results) {
                                                            var i = 0;
                                                            asyncloop(results, function (course, next) {
                                                                console.log(course);
                                                                if (course.value) {} else {
                                                                    courses[i] = {
                                                                        name: course[0],
                                                                        value: course[1]
                                                                    };
                                                                }
                                                                i++;
                                                                next();
                                                            });
                                                            var scheduledObject = [];
                                                            autofunct.getfacscheduled(facname, ipaddress, universname, dbpassword).
                                                            then(function (scheduled) {
                                                                boardfunc.getperiods(dbpassword, universname, ipaddress).
                                                                then(function (period) {
                                                                    var weeks = [];
                                                                    for (var i = 0; i < noweeks; i++) {
                                                                        weeks[i] = i;
                                                                    }
                                                                    var keyword = ipaddress + '-' + universname + '-' + noweeks + '-' + dbpassword + '-' + facname;
                                                                    response.render("faculty", {
                                                                        facs: result,
                                                                        keyword: keyword,
                                                                        course: courses,
                                                                        scheduled: scheduled,
                                                                        week: weeks,
                                                                        periods: periods,
                                                                        day: day,
                                                                        facname: facname,
                                                                        period: period
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});

app.post("/depcreate", function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var temp = request.body.value;
        var tempo;
        console.log(tempo);
        createfunct.getuname(temp[1], function (err, universname) {
            if (err) {
                response.send("no");
            } else {
                createfunct.getdbpassword(temp[1], function (err, dbpassword) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getipaddress(temp[1], function (err, ipaddress) {
                            if (err) {
                                console.log(err);
                            } else {
                                createfunct.getfaname(temp[1], function (err, facname) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        createfunct.getdeparts(facname, ipaddress, universname, dbpassword, function (err, departs) {
                                            if (err) {
                                                console.log(err);
                                                response.send("something went wrong");
                                            } else {
                                                createfunct.search(temp[0], departs, function (status) {
                                                    if (status == true) {
                                                        response.send("Department Already exist!");
                                                    } else {
                                                        createfunct.adddepart(temp[0], facname, universname, ipaddress, dbpassword, function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log("faculty successfuly added");
                                                                response.send(tempo[0]);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

app.post("/faccreate", function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var temp = request.body.value;
        var tempo;
        console.log(temp);
        console.log(temp[1]);
        console.log(temp[0]);
        console.log(temp[2]);
        console.log(temp[3]);
        tempo += temp[0] + '-' + temp[1] + '-';
        if (temp[temp.length - 1] === 'fac') {
            createfunct.getuname(temp[1],
                function (err, universname) {
                    if (err) {
                        response.send("no");
                    } else {
                        console.log(universname);
                        tempo += universname + '-';
                        createfunct.getipaddress(temp[1],
                            function (err, ipaddress) {
                                if (err) {
                                    response.send("no");
                                } else {
                                    console.log(ipaddress);
                                    tempo += ipaddress;
                                    createfunct.getfacs(ipaddress, universname, temp[1],
                                        function (err, result) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(result);
                                                createfunct.search(temp[0], result,
                                                    function (status) {
                                                        if (status == true) {
                                                            console.log(status);
                                                            response.send("Faculty already exist!");
                                                        } else {
                                                            createfunct.addfac(temp[1], temp[0],
                                                                function (err) {
                                                                    if (err) {
                                                                        console.log("no");
                                                                    } else {
                                                                        createfunct.getnoWeeks(temp[1],
                                                                            function (err, noweeks) {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    createfunct.createFacsheduled(temp[1], temp[0],
                                                                                        noweeks,
                                                                                        function (err) {
                                                                                            if (err) {
                                                                                                console.log(err);
                                                                                            } else {
                                                                                                createfunct.createfaccourses(temp[0], ipaddress,
                                                                                                    universname, temp[1],
                                                                                                    function (err) {
                                                                                                        if (err) {
                                                                                                            console.log(err);
                                                                                                        } else {
                                                                                                            createfunct.createdeparttable(temp[0], temp[1], universname, ipaddress,
                                                                                                                function (err) {
                                                                                                                    if (err) {
                                                                                                                        console.log(err);
                                                                                                                    } else {
                                                                                                                        console.log(temp[0]);
                                                                                                                        response.send(temp[0]);
                                                                                                                    }
                                                                                                                });
                                                                                                        }
                                                                                                    });
                                                                                            }
                                                                                        });
                                                                                }
                                                                            });
                                                                    }
                                                                });
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                });
        } else {
            fs.readFile('password.txt', function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var password = data.toString();
                    createfunct.getuname(password, function (err, uname) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(uname);
                            createfunct.getipaddress(password, function (err, ipaddress) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    autofunct.getfacs(ipaddress, uname, password).
                                    then(function (facs) {
                                        var existence = facs.indexOf(temp[0]);
                                        if (existence <= -1) {
                                            response.send('noFac');
                                        } else {
                                            createfunct.addfaccourse(temp[0], ipaddress, uname, password,
                                                temp[2], temp[1],
                                                function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        response.send('noFac');
                                                    } else {
                                                        replacePreviousFacvalue(temp[0], function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                response.send([temp[2], temp[1], temp[0]]);
                                                            }
                                                        });
                                                    }
                                                });
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
app.post('/receiver', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var receiver = [];
        var classs;
        var course;
        console.log("body :" + JSON.stringify(request.body));
        receiver = request.body.value;
        var origine = request.body.origine;
        classs = receiver[0];
        course = receiver[1];
        console.log(course);
        findfits(null, origine, course, classs, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                response.send(result);
            }
        });


    } else {
        console.log("none ajax request");
    }

});

function comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}

function getfacname(password, origine, callback) {
    if (origine) {
        fs.readFile('previousfac.txt', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var facname = data.toString();
                callback(facname);
            }
        });
    } else {
        createfunct.getfacname(password, function (err, facname) {
            if (err) {
                console.log(err);
            } else {
                callback(facname[0]);
            }
        });
    }
};

app.post('/receiver2', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var receiver;
        var classs;
        var i = 0;
        var result = [];
        console.log("body :" + JSON.stringify(request.body));
        var temp = request.body;
        for (var key in temp) {
            console.log(temp[key]);
            receiver = temp[key];
        }
        classs = receiver[0];
        //console.log(receiver);
        fs.readFile("password.txt", function (err, pass) {
            if (err) {
                console.log(err);
            } else {
                var password = pass.toString();
                createfunct.getipaddress(password, function (err, ipaddress) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getdbpassword(password, function (err, dbpassword) {
                            if (err)
                                dbpassword = password;
                            createfunct.getuname(password, function (err, uname) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    getfacname(password, request.body.origine, function (facname) {

                                        autofunct.faccurrent_courses(facname,
                                            ipaddress, uname, dbpassword).then(function (courses) {
                                            asyncloop(courses, function (course, next) {
                                                autofunct.checkIfligible(course[0], ipaddress, uname,
                                                    dbpassword, facname, temp.avalue).then(function (status) {
                                                    if (status === false) {
                                                        result.push(course);
                                                    }
                                                    if (i === courses.length - 1) {
                                                        undoCount = 0;
                                                        changeMade = [];
                                                        made = [];
                                                        result = result.sort(comparator);
                                                        response.send(result);
                                                    }
                                                    i++;
                                                });
                                                next();
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    }
});
app.post('/receive', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var temp = request.body;
        var receiver = [];
        receiver[0] = temp.value[0];
        receiver[1] = temp.value[1];
        receiver[2] = temp.value[2];
        previousclass = receiver[2];

        makechanges(receiver, request.body.origine, function (err, changes) {
            if (err) {
                console.log(err);
            } else {
                change = changes;
                change.index = receiver[0];
                made[undoCount].index = receiver[0];
                changeMade[undoCount] = changes;
                console.log(undoCount, 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
                console.log(made);
                findfits(previousclass, request.body.origine, receiver[1], receiver[0],
                    function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            undoCount++;
                            response.send(result);
                        }
                    });
            }
        });
    }
});
app.post("/create", function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var temp = null;
        var receiver = request.body;
        for (var key in receiver) {
            temp = receiver[key];
        }
        console.log(temp);
        if (temp[3] == "create") {
            createfunct.creatUser(temp[1], temp[2], function (err) {
                if (err) {
                    response.send("no");
                } else {
                    createfunct.createScheduler(temp[2], function (err) {
                        if (err) {
                            console.log(err);
                        }
                        createfunct.createCredentials(temp[2], temp[1], temp[0], function (err, ipaddress) {
                            if (err) {
                                console.log(err);
                            } else {
                                createfunct.createTables(CLASSES, temp[0], temp[2], function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        createfunct.copie(temp[2], temp[0], function (err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                createfunct.createOthers(temp[2], temp[0], function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log("Every thing is Good");
                                                        var tempglo = ipaddress + "-" + temp[1] + "-" +
                                                            temp[0] + "-" + temp[2];
                                                        response.send(tempglo);
                                                    }

                                                });
                                            }

                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        } else if (temp[3] == "department") {
            var cred = temp[1].split("-"); //cred stands for credentials
            var ipaddress = cred[0];
            var dbpassword = cred[3];
            var facname = cred[4];
            var universname = cred[1];
            var noweeks = cred[2];

            var mysql = require('mysql');
            var con1 = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: temp[2],
                database: "scheduler"
            });
            con1.connect(function (err) {
                if (err) {
                    response.send(err);
                    console.log(err);
                } else {
                    var con = mysql.createConnection({
                        host: ipaddress,
                        user: universname,
                        password: dbpassword,
                        database: "scheduler"
                    });

                    con.connect(function (err) {
                        if (err) {
                            console.log(err);
                            response.send("no");
                            con.end();
                        } else {
                            createfunct.getdeparts(facname, ipaddress, universname, dbpassword, function (err, result) {
                                createfunct.search(temp[0], result, function (status) {
                                    if (status == false) {
                                        response.send("Please Check your department name and retry");
                                    } else {
                                        createfunct.createScheduler(temp[2], function (err) {
                                            if (err) {
                                                console.log(err);
                                                response.send("Please check your dbpassword");
                                            } else {
                                                createfunct.createdepCredentials(temp[0], ipaddress, dbpassword, universname, temp[2], facname, noweeks, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        createfunct.createOthers(temp[2], function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log("every thing is good!");
                                                                response.send(true);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }

                                });
                            });
                        }

                    });
                }
            });


        } else if (temp[3] == "faculty") {
            var cred = temp[1].split("-");
            var ipaddress = cred[0];
            var dbpassword = cred[3];
            var universname = cred[1];
            var noweeks = cred[2];


            var mysql = require('mysql');
            var con1 = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: temp[2]
            });
            con1.connect(function (err) {
                if (err) {
                    con1.end();
                    response.send("no");
                    console.log(err);
                } else {
                    con1.end();
                    var con = mysql.createConnection({
                        host: ipaddress,
                        user: universname,
                        password: dbpassword,
                        database: "scheduler"
                    });
                    con.connect(function (err) {
                        if (err) {
                            response.send("no");
                            con.end();
                        } else {
                            fs.writeFile("password.txt",temp[2],function(err){
                                if(err) console.log(err);
                            createfunct.getfacs(ipaddress, universname,
                                dbpassword,
                                function (err, result) {
                                    if (err) {
                                        response.send("Sory we encounter an a  poblem during the processing of your infomation");
                                        console.log(err);
                                        con.end();
                                    } else {
                                        createfunct.search(temp[0], result, function (status) {
                                            if (status == true) {
                                                createfunct.createScheduler(temp[2],function (err){
                                                    if(err) console.log(err);
                                                createfunct.getfacname(temp[2], function (err, facname) {
                                                    if (err && !facname) {
                                                        console.log(facname, '***********************');
                                                        createfunct.createfaccredential(temp[0], temp[2], universname,
                                                            ipaddress, dbpassword, noweeks,
                                                            function (err, password) {
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    createfunct.createOthers(temp[2], noweeks, function (err) {
                                                                        if (err) {
                                                                            callback(err);
                                                                        } else {
                                                                            response.send("yes");
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                    } else {
                                                        response.send("yes");
                                                    }
                                                });
                                            });
                                            } else {
                                                response.send("no");
                                            }
                                        });

                                    }
                                });
                            });
                        }
                    });
                }
            });

        } else if (temp[3] == "univers") {
            var cred = temp[1].split("-");
            var ipaddress = cred[0];
            var dbpassword = cred[3];
            var universname = cred[1];
            var noweeks = cred[2];
            var mysql = require('mysql');
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: temp[2]
            });
            con.connect(function (err) {
                if (err) {
                    response.send("no");
                    con.end();
                } else {
                    con.end();
                    createfunct.getuname(temp[2], function (err, name) {
                        if (err) {
                            response.send("no");
                        } else {
                            if (name == temp[0]) {
                                createfunct.createfactable(temp[2], function (err) {
                                    if (err) {
                                        response.send("yes");
                                        console.log(err);
                                    } else {
                                        response.send("yes");
                                    }

                                });
                            }

                        }
                    });

                }

            });

        } else {

        }
    }

});

app.post("/addcourses", function (request, response) {
    if (request.xhr || req.headers.accept.indexOf('json') > -1) {
        var temp = request.body.value;
        var tempo;
        console.log(temp);
        console.log(temp[1]);
        console.log(temp[0]);
        var fs = require('fs');
        fs.readFile("password.txt", function (err, password) {
            if (err) {
                response.send("no");
                console.log(err);
            } else {
                createfunct.addcourse(password, temp[0], temp[1], function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        response.send(temp);
                        createfunct.getdbpassword(password, function (err, dbpassword) {
                            if (err) {
                                console.log(err);
                            } else {
                                createfunct.getfacname(password, function (err, facname) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        createfunct.getipaddress(password, function (err, ipaddress) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                createfunct.getuname(password, function (err, uname) {
                                                    createfunct.addfaccourse(facname, ipaddress, uname,
                                                        dbpassword, temp[0], temp[1],
                                                        function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log('ok!!');
                                                            }
                                                        });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
app.post('/drop', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var password;
        console.log(request.body);
        var req = request.body;
        fs.readFile("password.txt", function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var password = data.toString();
                if (req[req.length - 1] === 'dropFac') {
                    console.log('ENTERED!!!!');
                    createfunct.getipaddress(password, function (err, ipaddress) {
                        if (err) {
                            console.log(err);
                        } else {
                            createfunct.getuname(password, function (err, uname) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    autofunct.dropFaccourses(ipaddress, password, uname, req[0]).
                                    then(function (outcome) {
                                        response.send('dropFac');
                                    });
                                }
                            });
                        }
                    });
                } else if (req[req.length - 1] === 'drop') {
                    console.log('***********************************************');
                    createfunct.getuname(password, function (err, uname) {
                        if (err) {
                            console.log(err);
                        } else {
                            createfunct.getipaddress(password, function (err, ipaddress) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    createfunct.getdbpassword(password, function (err, dbpassword) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            createfunct.getfacname(password, function (err, facname) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    autofunct.dropFaccourses(ipaddress, dbpassword, uname, facname).
                                                    then(function (result) {
                                                        autofunct.faccurrent_courses(facname, ipaddress, uname, dbpassword).
                                                        then(function (course) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log(result);
                                                                console.log(course,'-------------------------------------------------');
                                                                response.send(course);
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    createfunct.getipaddress(password, function (err, ipaddress) {
                        console.log('DROP FACs ENTERED!!!');
                        if (err) {
                            console.log(err);
                        } else {
                            createfunct.getuname(password, function (err, uname) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    autofunct.dropAll(uname, ipaddress, password).then(function (result) {
                                        autofunct.dropfacs(ipaddress, password, uname).
                                        then(function (outcome) {
                                            response.send();
                                            console.log(outcome);
                                        });
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

app.listen(app.get('port'), function () {
    console.log('the server is running under port' + app.get('port') + ' ,thanks');
});
app.post("/undo", function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var receiver;
        receiver = [];
        var classs;
        var course;
        receiver = request.body.value;
        undoCount--;
        console.log(receiver);
        fs.readFile("password.txt", function (err, pass) {
            if (err) {
                console.log(err);
            } else {
                var password = pass.toString();
                createfunct.getdbpassword(password, function (err, dbpassword) {
                    if (err) dbpassword = password;
                    createfunct.getuname(password, function (err, universname) {
                        if (err) {
                            console.log(err);
                        } else {
                            getfacname(password, request.body.origine, function (facname) {
                                createfunct.getipaddress(password, function (err, ipaddress) {
                                    autofunct.undo(ipaddress, universname, dbpassword, facname,
                                        made[undoCount]).
                                    then(function (err) {
                                        console.log('yesss!!******************');
                                        console.log(undoCount, 'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU', made);
                                        if (undoCount === 0) {
                                            previousclass = null;
                                        }
                                        findfits(previousclass, request.body.origine, receiver[1], receiver[0],
                                            function (err, results) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    response.send(results);
                                                }
                                            });
                                    });
                                });
                            });
                        }
                    });
                });
            }
        });
    }
});

app.post('/dropthis', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        console.log('sess');
        var courseid = request.body.value;
        console.log(courseid);
        fs.readFile('password.txt', function (err, password) {
            if (err) {
                console.log(err);
            } else {
                password = password.toString();
                createfunct.getuname(password, function (err, uname) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getipaddress(password, function (err, ipaddress) {
                            autofunct.dropCourse(courseid.split('.')[1], courseid.split('.')[0],
                                ipaddress, uname, password).
                            then(function (params) {
                                response.send();
                            });
                        });
                    }
                });
            }
        });
    }
});

app.post('/dropsingle', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        console.log('giles');
        console.log(request.body.value);
        var facname = request.body.value;

        fs.readFile('password.txt', function (err, password) {
            if (err) {
                console.log(err);
            } else {
                password = password.toString();
                createfunct.getuname(password, function (err, uname) {
                    if (err) {
                        console.log(err);
                    } else {
                        createfunct.getipaddress(password, function (err, ipaddress) {
                            if (err) {
                                console.log(err);
                            } else {
                                autofunct.dropsingleFac(ipaddress, uname, facname, password).
                                then(function (outcome) {
                                    console.log(outcome);
                                    response.send();
                                });
                            }

                        });
                    }
                });
            }
        });
    }
});

app.post('/dropthiscourse', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        var coursename = request.body.value;
        console.log(coursename);
        fs.readFile("password.txt", function (err, password) {
            if (err) {
                console.log(err);
            } else {
                createfunct.getdbpassword(password, function (err, dbpassword) {
                    if (err) {
                        dbpassword = password
                    }
                        createfunct.getfacname(password, function (err, facname) {
                            if (err) {
                                console.log(err);
                            } else {
                                createfunct.getipaddress(password, function (err, ipaddress) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        createfunct.getuname(password, function (err, uname) {
                                            autofunct.dropCourse(coursename, facname, ipaddress, uname, dbpassword).
                                            then(function name(params) {
                                                response.send();
                                            });
                                        });
                                    }
                                });
                            }

                        });
                });
            }
        });
    }
});


app.post('/changefac', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        console.log(request.body.value);
        replacePreviousFacvalue(request.body.value, function (err) {
            if (err) {
                console.log(err);
            } else {
                response.send();
            }
        });
    }
});

app.post('/addtoscheduled', function (request, response) {
    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
        fs.readFile('scheduled.json', function (err, data) {
            fs.readFile('password.txt', function (err, data2) {
                if (err) {
                    console.log(err);
                } else {
                    if (request.body.globaldid.course) {
                        var password = data2.toString();
                        createfunct.getfacname(password, function (err, facname) {
                            if (err) {
                                console.log(err);
                                fs.readFile('previousfac.txt', function (err, datar) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var facname = datar.toString();
                                        request.body.globaldid.facname = facname;
                                        var newdata = JSON.parse(data);
                                        newdata[request.body.globaldid.course] = request.body.globaldid;
                                        console.log(newdata);
                                        fs.writeFile('scheduled.json', JSON.stringify(newdata, null, 4), function (err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log('done!');
                                            }
                                        });
                                    }
                                });
                            } else {
                                request.body.globaldid.facname = facname[0];
                                console.log(facname,"iiiiiiiiiiiiiiii")
                                var newdata = JSON.parse(data);
                                newdata[request.body.globaldid.course] = request.body.globaldid;
                                console.log(newdata);
                                fs.writeFile('scheduled.json', JSON.stringify(newdata, null, 4), function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('done!');
                                    }
                                });
                            }
                        });

                    }
                }
            });
        });
    }
});



app.post('/undoglobal', function (request, response) {
    var origine = request.body.value
    console.log(origine)
    fs.readFile('password.txt', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var password = data.toString();
            console.log(password);
            createfunct.getdbpassword(password, function (err, dbpassword) {
                if(err){
                    dbpassword = password
                }
                createfunct.getuname(password, function (err, uname) {
                    if (err) {
                        console.log(err);
                    } else {
                        fs.readFile('scheduled.json', function (err, data) {
                            var globaldid = JSON.parse(data);
                            createfunct.getipaddress(password, function (err, ipaddress) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (Object.keys(globaldid).length <= 0) {
                                       response.send();
                                    } else {
                                        if (origine === 'facs') {
                                            autofunct.undoglobal(ipaddress, dbpassword, uname, globaldid).
                                            then(function () {
                                                console.log('done!!!!');
                                                response.send();
                                            });
                                        } else {
                                            
                                            fs.readFile('previousfac.txt', function (err, datas) {
                                                if (err) {

                                                } else {
                                                    var newglobaldid = {};
                                                    var i = 0;
                                                    var facname = datas.toString();
                                                    asyncloop(globaldid, function (item, next) {
                                                        var tempfac = item.value.facname;
                                                        if (facname == tempfac || facname == tempfac[0]) {
                                                            newglobaldid[item.value.course] = item.value;
                                                        }
                                                        if (i === Object.keys(globaldid).length - 1) {
                                                            console.log(tempfac, facname, i, '******************');
                                                            if(Object.keys(newglobaldid).length > 0){
                                                                autofunct.undoglobal(ipaddress, dbpassword, uname, newglobaldid).
                                                            then(function () {
                                                                response.send();
                                                            });
                                                            }else{
                                                                response.send();
                                                            }
                                                        }
                                                        i++;
                                                        next();
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});

function oblectify(array, callback) {
    var temp = {};
    for (var i = 0; i < array.length; i++) {
        temp[array[i][0]] = array[i][1];
        if (i === array.length - 1) {
            callback(temp);
        }
    }
}

app.post('/changescheduled', function (request, response) {
    facname = request.body.value;
    console.log(facname);
    fs.readFile('password.txt', function (err, data) {
        var password = data.toString();
        createfunct.getipaddress(password, function (err, ipaddress) {
            createfunct.getuname(password, function (err, uname) {
                createfunct.getdbpassword(password, function (err, dbpassword) {
                    autofunct.getfacscheduled(facname, ipaddress, uname, password).
                    then(function (scheduled) {
                        oblectify(scheduled, function (schedule) {
                            response.send(schedule);
                            console.log(schedule);
                        });
                    });
                });
            });
        });
    });
});

app.post('/dropworkspace', function (request, response) {
    createfunct.dropWorkspace(function (err, result) {
        if (err) {
            console.log(err);
            response.send('no');
        } else {
            response.send('yes');
        }
    });
});