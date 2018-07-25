var asyncloop = require('node-async-loop');
var lowtrack = 48;
var upptrack = 48;
var i = 0;
module.exports.fits = function fits(previouschoosed, classes, noRegistered) {
    return new Promise(function (resolve, reject) {
        fitslevel1(previouschoosed, classes, noRegistered).
        then(function (result) {
            fitslevel2(result, classes, noRegistered).
            then(function (results) {
                fitslevel3(results, classes, noRegistered).
                then(function (fits) {
                    resolve(fits);
                });
            });
        });
    });
};

var dropAll = function dropAll(uname, ipaddress, password) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        getfacs(ipaddress, uname, password).then(function (facs) {
            asyncloop(facs, function (facname, next) {
                droppFacSchedulAndCourses(ipaddress, uname, facname, password).
                then(function (outcome) {
                    if (i === facs.length - 1) {
                        resolve(outcome);
                    }
                    i++;
                    next();
                });
            });
        });
    });
};

module.exports.dropAll = dropAll;

var dropsingle = function dropsingleFac(ipaddress, uname, facname, password) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        droppFacSchedulAndCourses(ipaddress, uname, facname, password).
        then(function (outcome) {
            makemsqlconnection(ipaddress, uname, password).then(function (con) {
                var result = con.query('drop from faculties where name = "' + facname + '"');
                con.end();
                return result;
            }).then(function (result) {
                resolve(resolve);
            });
        });
    });
};
module.exports.dropsingleFac = dropsingle;

function droppFacSchedulAndCourses(ipaddress, uname, facname, password) {
    return new Promise(function (resolve, reject) {
        var conn = {};
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            var result = con.query('drop table ' + facname + 'courses;');
            conn = con;
            con.end();
            return result;
        }).then(function (result) {
            var result2 = conn.query('drop table ' + facname + 'scheduled')
            conn.end();
            return result2;
        }).then(function (result2) {
            resolve(result2);
        });
    });
}

module.exports.class_value = function class_value(classes, classs, callback) {
    return new Promise(function (resolve, reject) {
        asyncloop(classes, function (array, next) {
            if (array[0] == classs) {
                resolve(array[1]);
            }
            next();
        });
    });
};
module.exports.fitselse = function fitselse(previouschoosed, classes, noRegistered) {
    return new Promise(function (resolve, reject) {
        fitslevel1(previouschoosed, classes, noRegistered).
        then(function (result) {
            fitslevel2(result, classes, noRegistered).
            then(function (results) {
                var middlefits = results.fits.getmiddlefit();
                var bestfits = results.fits.getbestfit();
                if (middlefits[0] === undefined && bestfits[0] === undefined) {
                    fitslevel3else(results, classes, noRegistered).
                    then(function (fits) {
                        resolve(fits);
                    });
                } else {
                    resolve(results.fits);
                }
            });
        });
    });
};

var getfacs = function getfacs(ipaddress, universname, dbpassword) {
    var temp = [];
    var i = 0;
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, universname, dbpassword).
        then(function (con) {
            result = con.query('select name from faculties ');
            con.end();
            return result;
        }).then(function (result) {
            if (!result[0]) {
                resolve([]);
            } else {
                asyncloop(result, function (data, next) {
                    temp.push(data.name);
                    if (i === result.length - 1) {
                        resolve(temp);
                    }
                    i++;
                    next();
                });
            }
        });
    });
};

module.exports.getfacs = getfacs;
var getnoWeeks = function getnoWeeks(password, ipaddress, uname) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            result = con.query('select numWeeks from credentials where id = 1');
            con.end();
            return result;
        }).then(function (result) {
            asyncloop(result, function (element, next) {
                resolve(element.numWeeks);
            });
        }).catch(function (problem) {
            console.log(problem);
        })
    });
};

module.exports.getnoWeeks = getnoWeeks;
var faccurrent_courses = function faccurrent_courses(facname, ipaddress,
    uname, dbpassword) {
    return new Promise(function (resolve, reject) {
        var temp1 = [];
        var temp = [];
        var i = 0;
        makemsqlconnection(ipaddress, uname, dbpassword).
        then(function (con) {
            var result = con.query('select name from ' + facname + 'courses ');
            con.end();
            return result;
        }).then(function (result) {
            if (result[0] === undefined) {
                resolve('No course');
            } else {
                makemsqlconnection(ipaddress, uname, dbpassword).
                then(function (con) {
                    asyncloop(result, function (element, next) {
                        if (element) temp.push(element.name);
                        i++;
                        next();
                    });
                    var result2 = con.query('select number from ' + facname + 'courses ');
                    con.end();
                    return result2;
                }).then(function (result2) {
                    i = 0;
                    asyncloop(result2, function (element, next) {
                        temp1.push([temp[i], element.number]);
                        if (i === result2.length - 1) {
                            resolve(temp1);
                        }
                        i++;
                        next();
                    });
                });
            }
        });
    });
};
module.exports.faccurrent_courses = faccurrent_courses;

function spacefinder(noRegistered, value) {
    var space = (noRegistered - value) > 0 ? noRegistered - value : value - noRegistered;
    return space;
}

function fitsadder(noRegistered, value, key, fits) {
    var space = spacefinder(noRegistered, value);
    if (space <= 10) {
        fits.takeNewbestfit(key);
        fits.takebestfitspace(space, key);
        fits.takebestclassvalue(value, key);
    } else {
        fits.takeNewworsefit(key);
        fits.takeworsefitspace((space), key);
        fits.takeworseclassvalue(value, key);
    }


}

function nobestnormiddle(noRegistered, value, key, fits) {
    var space = spacefinder(noRegistered, value);
    fits.takeNewworsefit(key);
    fits.takeworsefitspace((space), key);
    fits.takeworseclassvalue(value, key);

}

function nonebestfitadder(limit1, limit2, noRegistered, value, key, fit2) {
    var space = spacefinder(noRegistered, value);
    if (value >= limit1 && value <= limit2) {
        fit2.takemiddlefit(key);
        fit2.takemiddlefitspace((space), key);
        fit2.takemiddlefitclassvalue(value, key);

    } else {
        fit2.takeNewworsefit(key);
        fit2.takeworsefitspace((space), key);
        fit2.takeworseclassvalue(value, key);

    }
}

function findmatch(classs, match) {
    return new Promise(function (resolve, reject) {
        var status;
        scrap(classs).
        then(function (result1) {
            scrap(match).
            then(function (result2) {
                status = matcher(result1, result2, match, classs);
                resolve(status);
            });
        });
    });
}

function findclassmatch(classes, match) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        var i = 0;
        asyncloop(classes, function (array, next) {
            findmatch(array[0], match).then(function (status) {
                (status === true) ? temp.push(array[0]): null;
                if (i === classes.length - 1) {
                    resolve(temp);
                }
                i++;
            });
            next();
        });

    });
}
/* This function takes into account the previusclass choosed*/
function fitlevel1(fits, previouschoosed, classes, noRegistered) {
    if (!previouschoosed) {
        previouschoosed = 'none';
    }
    var borders = {};
    return new Promise(function (resolve, reject) {
        var i = 0;
        findclassmatch(classes, previouschoosed).
        then(function (result) {
            result = (!result[0]) ? ['none', 'none'] : result;
            lowerandupperadres(classes, result[result.length - 1], result[0]).then(function (boundries) {
                borders = boundries;
                asyncloop(classes, function (array, next) {
                    var value = array[1];
                    findmatch(array[0], previouschoosed).then(function (status) {
                        if (status === true) {
                            fitsadder(noRegistered, value, array[0], fits);
                        } else {
                            nobestnormiddle(noRegistered, value, array[0], fits);
                        }
                        i++;
                        if (i === classes.length - 1) {
                            resolve({
                                'prev': previouschoosed,
                                'borders': borders,
                                'fits': fits
                            });
                        }
                        next();
                    });
                });

            });
        });

    });
}

function fitsdestruction(fits) {
    return new Promise(function (resolve, reject) {
        fits.destructor();
        resolve(fits);
    });
}
/* This function handles the case there is no best fit for a given classchoosed previously */
function fitlevel1finder(fits, previouschoosed, classes, noRegistered) {
    return new Promise(function (resolve, reject) {
        fitsdestruction(fits).
        then(function (fits) {
            var i = 0;
            fitlevel1(fits, previouschoosed, classes, noRegistered).
            then(function (previousResult) {
                if (previousResult.prev === 'none') previousResult.fits.destructor();
                var bestfits = previousResult.fits.getbestfit();
                var middlefits = previousResult.fits.getmiddlefit();
                if (!bestfits[0] && !middlefits[0]) {
                    previousResult.fits.destructor();
                    asyncloop(classes, function (array, next) {
                        fitsadder(noRegistered, array[1], array[0], previousResult.fits);
                        if (i === classes.length - 1) {
                            resolve(previousResult);
                        }
                        i++;
                        next();
                    });
                } else {
                    resolve(previousResult);
                }
            });
        })
    });
}


function lowerandupperadres(classes, lower, upper) {
    return new Promise(function (resolve, reject) {
        findclass(classes, lower).then(function (loweraddress) {
            findclass(classes, upper).then(function (upperaddress) {
                resolve({
                    'lower': loweraddress,
                    'upper': upperaddress
                });
            });
        });

    });

}

function matcher(result1, result2, match, classs) {
    if (match[1]) {
        var status = (result1.join('') == result2.join('') || classs.substr(0, 3) === match[0].substr(0, 3)) ? true : false;
    } else {
        var status = (result1.join('') == result2.join('') || classs.substr(0, 3) === match.substr(0, 3)) ? true : false;
    }
    return status;
}

function findclass(classes, classs) {
    return new Promise(function (resolve, reject) {
        var temp;
        for (var i = 0; i < classes.length - 1; i++) {
            if (classes[i][0] == classs) {
                temp = i;
                break;
            }
        }
        resolve(temp);
    });
}

function insertarr(incoming, destination) {
    for (var key in incoming) {
        var value = incoming[key];
        destination.push(incoming[key]);
    }
}
/* This the function combiens the bestfitslevel function */
function fitslevel1(previousclass, classes, noRegistered) {
    var fits = require('./classes').FITS;
    i = 0;
    return new Promise(function (resolve, reject) {
        fitlevel1finder(fits, previousclass, classes, noRegistered).
        then(function (result) {
            resolve(result);
        });
    });
}

function fitlevel1_2(fits, previousclass, classes, noRegistered) {
    var fiter = fits;
    return new Promise(function (resolve, reject) {
        var middlefits = [];
        var bestfits = [];
        if (fiter) {
            var middlefits = fiter.getmiddlefit();
            var bestfits = fiter.getbestfit();
        }
        if (!bestfits[0] && !middlefits[0]) {
            fitlevel1finder(fiter, previousclass, classes, noRegistered).
            then(function (result) {
                fitslevel2(result, classes, noRegistered).
                then(function (fits) {
                    resolve(fits);
                });
            });
        } else {
            resolve(fits);
        }

    });
}

function rangeselector(noRegistered) {
    if ((noRegistered >= 250) && (noRegistered < 400)) {
        return {
            'lower': 80,
            'upper': 200
        };
    } else if ((noRegistered) >= 400) {
        return {
            'lower': 125,
            'upper': 1000
        };
    } else if (noRegistered >= 100 && noRegistered <= 249) {
        return {
            'lower': 51,
            'upper': 150
        };
    } else if (noRegistered <= 99) {
        return {
            'lower': 20,
            'upper': 79
        };
    }
}

function addlevel2fits(range, status, noRegistered, value, key, fit2) {
    (status === true) ? nonebestfitadder(range.lower, range.upper, noRegistered, value, key, fit2):
        nobestnormiddle(noRegistered, value, key, fit2);
}

/* The middlefitprccessor function takes in to account the previous class choosed */
function middlefitproccessor1(fit2, noRegistered, classes, previousclass) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        var bestfits = fit2.getbestfit();
        var middlefits = fit2.getmiddlefit();
        if (!bestfits[0] && !middlefits[0]) {
            fit2.destructor();
            range = rangeselector(noRegistered);
            asyncloop(classes, function (array, next) {
                findmatch(array[0], previousclass).then(function (status) {
                    addlevel2fits(range, status, noRegistered, array[1], array[0], fit2);
                    if (i === classes.length - 1) {
                        resolve(fit2);
                    }
                    i++;
                    next();
                });
            });

        } else {
            resolve(fit2);
        }
    });
}

/** This function doesnot take into account the previous classchoosed  */
function middleprocessor(fit2, noRegistered, classes) {
    return new Promise(function (resolve, reject) {
        var middlefit = fit2.getmiddlefit();
        var bestfits = fit2.getbestfit();
        if (!middlefit[0] && !bestfits[0]) {
            range = rangeselector(noRegistered);
            var i = 0;
            fit2.destructor();
            asyncloop(classes, function (array, next) {
                nonebestfitadder(range.lower, range.upper, noRegistered, array[1], array[0], fit2);
                if (i === classes.length - 1) {
                    resolve(fit2);
                }
                i++;
                next();
            });
        } else {
            resolve(fit2);
        }
    });
}

function fitslevel2(previousResult, classes, noRegistered) {
    return new Promise(function (resolve, reject) {
        middlefitproccessor1(previousResult.fits, noRegistered, classes, previousResult.prev).
        then(function (fits) {
            previousResult.fits = fits;
            resolve(previousResult);
        });
    });
}

function scrap(sreing) {
    var result = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < sreing.length; i++) {
            charselect(sreing[i], result);
        }
        resolve(result);
    });
}

function charselect(char1, arr) {
    if (char1 >= 'A' && char1 <= 'Z') {
        arr.push(char1);
    }
}

function arrtransform(array) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        var i = 0;
        for (var key in array) {
            temp.push([key, array[key]]);
            if (i === array.length - 1)
                resolve(temp);
        }
    });
}

function detboundaryclasses(borders, classes) {
    return new Promise(function (resolve, reject) {
        var upperarray = borders.upper;
        var lowerarray = borders.lower;
        if (borders.upper === undefined && borders.lower === undefined) {
            resolve({
                'lowerarray': 'none',
                'upperarray': 'none'
            });
        } else {
            resolve({
                'lowerarray': (!classes[lowerarray + 1]) ? 'none' : classes[lowerarray + 1],
                'upperarray': (!classes[upperarray - 1]) ? 'none' : classes[upperarray - 1]
            });
        }
    });
}



function fitslevel3(prevResult, classes, noRegistered) {
    var bestfits = prevResult.fits.getbestfit();
    var middlefits = prevResult.fits.getmiddlefit();
    return new Promise(function (resolve, reject) {
        if (!bestfits[0] && !middlefits[0]) {
            detboundaryclasses(prevResult.borders, classes).
            then(function (boundry) {
                fitlevel1_2(prevResult.fits, boundry.lowerarray, classes, noRegistered).
                then(function (previousResult) {
                    resolve(previousResult.fits);
                    fitlevel1_2(previousResult.fits, boundry.upperarray, classes, noRegistered).
                    then(function (previousResu) {
                        resolve(previousResu.fits);
                    });
                });
            });
        } else {
            resolve(prevResult.fits);
        }


    });
}

function fitslevel3else(prevResult, classes, noRegistered) {
    var bestfits = prevResult.fits.getbestfit();
    var middlefits = prevResult.fits.getmiddlefit();
    return new Promise(function (resolve, reject) {
        if (!bestfits[0] && !middlefits[0]) {
            detboundaryclasses(prevResult.borders, classes).
            then(function (boundry) {
                fitlevel1_2(prevResult.fits, boundry.lowerarray, classes, noRegistered).
                then(function (previousResult) {
                    var middlefits = previousResult.fits.getmiddlefit();
                    var bestfits = previousResult.fits.getbestfit();
                    if (middlefits[0] === undefined && bestfits[0] === undefined) {
                        fitlevel1_2(previousResult.fits, boundry.upperarray, classes, noRegistered).
                        then(function (previousResu) {
                            middleprocessor(previousResu.fits, noRegistered, classes).
                            then(function (fits) {
                                resolve(fits);
                            });
                        });
                    } else {
                        resolve(previousResult.fits);
                    }
                });
            });

        } else {
            resolve(prevResult.fits);
        }


    });
}

function addtooccured(occured, element, status) {
    occurancescheck(occured, element).
    then(function (status) {
        (status == false) ? occured.push(element): null;
    });
}
module.exports.course_value =
    function course_value(ipaddress, uname, coursename, facname, password) {
        return new Promise(function (resolve, reject) {
            makemsqlconnection(ipaddress, uname, password).
            then(function (con) {
                result = con.query('select number from ' + facname + 'courses where name = "' + coursename + '"');
                con.end();
                return result;
            }).then(function (result) {
                console.log(result);
                if (result[0] === undefined) {
                    resolve(null);
                } else {
                    asyncloop(result, function (arry, next) {
                        resolve(arry.number);
                    });
                }
            });
        });
    };

var makemsqlconnection = function makemsqlconnection(ipaddress, uname, password) {
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    return new Promise(function (resolve, rejedct) {
        var mysql = require('promise-mysql');
        var con = mysql.createConnection({
            host: ipaddress,
            user: uname,
            password: password,
            database: 'scheduler'
        });
        resolve(con);
    });
};

module.exports.makemsqlconnection = makemsqlconnection;

function updateclass(space, ipaddress, uname, password, period, capacity, classname, noRegistered) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password)
            .then(function (con) {
                var sql = determineoperation(space, period, capacity, classname, noRegistered);
                var result1 = con.query(sql);
                con.end();
                resolve(result1);
            });
    });
}

function determineoperation(space, period, capacity, classname, noRegistered) {
    var others = noRegistered - capacity;
    sql = (space <= 10 || others > 10) ? 'delete from ' + period + ' where class_name = "' +
        classname + '"' : 'update ' + period + ' set capacity1 = ' +
        space + ' where class_name = "' + classname + '"';
    return sql;
}


/*current_classes('0Mon_08', 'locahost', 'santers1997', 'santers').
then(function (classes) {
    choose_class('localhost', 'santers',
        'santers1997', classes, 'amphy-250', 58, '0Mon_08', 'EEF356').
    then(function (change) {
        console.log(change);
    });
});*/

function savechanges(changes, space, capacity, period, noRegistered, coursename, class_name) {
    return new Promise(function (resolve, reject) {
        (space) ? changes.takeremainingstudent(space): changes.takeremainingstudent(null);
        changes.takeinitialclassname(class_name);
        changes.takeinitialcoursename(coursename);
        changes.takeinitialregistered(noRegistered);
        changes.getindex(period);
        changes.takeinitialspace(capacity);
        resolve(changes);
    });
}

/*module.exports.choose_class =*/
function choose_class(host, user, password, classes,
    classname, course, period, coursename) {
    return new Promise(function (resolve, reject) {
        var changes = require('./classes').INITIALS;
        asyncloop(classes, function (array, next) {
            var space = spacefinder(course, array[1]);
            valueglo = array[1];
            var temp;
            var tempo;
            tempo = null;
            if (array[0] == classname) {
                updateclass(space, host, user, password, period, array[1], classname, course).
                then(function (result) {
                    savechanges(changes, space, array[1], period,
                        course, coursename, array[0]).
                    then(function (change) {
                        resolve(change);
                    });
                });
            }
            next();
        });
    });
};

function updateschedule(facname, user, ipaddress, password, period, newvalue) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, user, password)
            .then(function (con) {
                determineOpOnSchedule(facname, user, ipaddress, password, period, newvalue).then(function (sql) {
                    var result1 = con.query(sql);
                    con.end();
                    resolve(result1);
                });
            });
    });
}

function determineOpOnSchedule(facname, user, ipaddress, password, period, newvalue) {
    return new Promise(function (resolve, reject) {
        getscheduledperiodlocalfunc(period, facname, ipaddress, user, password).
        then(function (result) {
            var sql = (result) ? 'update ' + facname + 'scheduled set course ="' + result + '<br/>' +
                newvalue + '" where period = "' + period + '" ' : 'update ' + facname +
                'scheduled set course ="' + newvalue + '" where period = "' + period + '" ';
            resolve(sql);
        });
    });
}


function determineOpOncourse(capacity, noRegistered, facname, coursename) {
    var other = capacity - noRegistered;
    var space = spacefinder(noRegistered, capacity);
    var sql = (space <= 10 || other > 10) ? 'delete from ' + facname + 'courses where name = "' + coursename + '"' :
        'update ' + facname + 'courses set  number = "' + -other + '" where name = "' + coursename + '"';
    return sql;
}

function updatecourses(capacity, noRegistered, facname,
    coursename, ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password)
            .then(function (con) {
                var sql = determineOpOncourse(capacity, noRegistered, facname, coursename);
                var result1 = con.query(sql);
                con.end();
                resolve(result1);
            });
    });
}

function localchanges(facname, password, ipaddress, user,
    classes, classname, course, period, coursename) {
    return new Promise(function (resolve, reject) {
        asyncloop(classes, function (array, next) {
            if (classname === array[0]) {
                var newvalue = coursename + '-' + array[0];
                updatecourses(array[1], course, facname, coursename, ipaddress, user, password).
                then(function (result) {
                    updateschedule(facname, user, ipaddress, password, period, newvalue).
                    then(function (result2) {
                        resolve(result2);
                    });
                });
            }
            next();
        });
    });
};

module.exports.makechanges = function makechanges(facname, password, ipaddress, user,
    classes, classname, course, period, coursename) {
    return new Promise(function (resolve, reject) {
        localchanges(facname, password, ipaddress,
            user, classes, classname, course, period, coursename).
        then(function (params) {
            choose_class(ipaddress, user, password, classes,
                classname, course, period, coursename).
            then(function (changes) {
                resolve(changes);
            });
        });
    });

}
module.exports.current_classes = function current_classes(period, ipaddress,
    dbpassword, universname) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        var temp1 = [];
        var temp2 = [];
        var tempo = [];
        var conn = {};
        var mysql = require('promise-mysql');
        mysql.createConnection({
                host: ipaddress,
                user: universname,
                password: dbpassword,
                database: "scheduler"
            }).then(function (con) {
                conn = con;
                var sql = 'select class_name from ' + period + ' ';
                var result1 = con.query(sql);
                return result1;
            }).then(function (result1) {
                name_fetcher(result1, temp1).then(function (arr) {
                    return arr;
                });
            })
            .then(function (result2) {
                var sql = 'select capacity1 from ' + period + '';
                var outcome = conn.query(sql);
                conn.end();
                return outcome;
            }).then(function (outcome) {
                capacity_fetcher(outcome, temp1, temp2).
                then(function (temp2) {
                    resolve(temp2);
                });
            });
    });
};
module.exports.getfacscheduled = function getfacscheduled(facname, ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        var temp1 = [];
        var conn = {};
        var temp2 = [];
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            var result = con.query('select period from ' + facname + 'scheduled ');
            conn = con;
            return result;
        }).then(function (result) {
            period_fetcher(result, temp1).then(function (arr) {
                return arr;
            });
        }).then(function (arr) {
            var result = conn.query('select course from ' + facname + 'scheduled ');
            conn.end();
            return result;
        }).then(function (result) {
            course_fetcher(result, temp1, temp2).then(function (array) {
                resolve(array);
            });
        });
    });
}

function period_fetcher(result1, temp1) {
    return new Promise(function (resolve, reject) {
        asyncloop(result1, function (resul1, next) {
            asyncloop(resul1, function (resu, next1) {
                temp1.push(resu.value);
                next1();
            });
            next();
        });
        resolve(temp1);
    });
}

function course_fetcher(result1, temp1, temp2) {
    var i = 0;
    console.log('/***************************************');
    return new Promise(function (resolve, reject) {
        asyncloop(result1, function (resul1, next) {
            asyncloop(resul1, function (resu, next1) {
                if (resu.value === null) {
                    resu.value = '';
                }
                temp2.push([temp1[i], resu.value]);
                i++;
                next1();
            });
            next();
        });
        resolve(temp2);
    });
}

function name_fetcher(result1, temp1) {
    return new Promise(function (resolve, reject) {
        asyncloop(result1, function (resul1, next) {
            asyncloop(resul1, function (resu, next1) {
                temp1.push(resu.value);
                next1();
            });
            next();
        });
        resolve(temp1);
    });
}

function capacity_fetcher(result1, temp1, temp2) {
    var i = 0;

    return new Promise(function (resolve, reject) {
        asyncloop(result1, function (resul1, next) {
            asyncloop(resul1, function (resu, next1) {
                temp2.push([temp1[i], resu.value]);
                i++;
                next1();
            });
            next();
        });
        resolve(temp2);
    });
}

var getscheduledperiod = function getscheduledperiod(period,
    facname, ipaddress, uname, dbpassword) {
    var mysql = require('promise-mysql');
    return new Promise(function (resolve, reject) {
        mysql.createConnection({
            host: ipaddress,
            user: uname,
            password: dbpassword,
            database: "scheduler"
        }).then(function (con) {
            var sql = 'select course from `' + facname + 'scheduled` where `period` = "' + period + '"';
            var result = con.query(sql);
            con.end();
            return result;
        }).then(function (result) {
            if (!result[0]) {
                resolve(null);
            } else {
                asyncloop(result, function (resul, next) {
                    resolve(resul.course);
                });
            }
        });
    });
};
module.exports.getscheduledperiod = getscheduledperiod;

function getscheduledperiodlocalfunc(period,
    facname, ipaddress, uname, dbpassword) {
    var mysql = require('promise-mysql');
    return new Promise(function (resolve, reject) {
        mysql.createConnection({
            host: ipaddress,
            user: uname,
            password: dbpassword,
            database: "scheduler"
        }).then(function (con) {
            var sql = 'select course from `' + facname + 'scheduled` where `period` = "' + period + '"';
            var result = con.query(sql);
            con.end();
            return result;
        }).then(function (result) {
            asyncloop(result, function (resul, next) {
                resolve(resul.course);
            });
        });
    });

}

function determineclassExistence(ipaddress, password, uname, class_name, period) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).then(function (con) {
            var result = con.query('select capacity1 from `' + period + '` where class_name = "' + class_name + '"');

            con.end();
            return result;
        }).then(function (result) {
            console.log(result, '**********************************/*');
            if (result[0] === undefined) {
                resolve(null);
            } else {
                asyncloop(result, function (arry, next) {
                    resolve(arry.capacity1);
                });
            }
        });
    });
}

function determineUndoOutOpperation(ipaddress, period, password, uname, class_name, class_value) {
    return new Promise(function (resolve, reject) {
        determineclassExistence(ipaddress, password, uname, class_name, period).
        then(function (result) {
            var sql = (result) ? 'update ' + period + ' set capacity1 = ' + class_value +
                ' where class_name = "' + class_name + '" ' : 'INSERT into `' + period + '` set class_name = "' +
                class_name + '", capacity1 = ' + class_value + ' , capacity2 = ' + 0;

            resolve(sql);
        });
    });
}

function undoOut(ipaddress, uname, password, class_name, class_value, period) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            determineUndoOutOpperation(ipaddress, period, password,
                uname, class_name, class_value).
            then(function (operation) {
                var result = con.query(operation);
                con.end();
                return result;
            }).then(function (outcome) {
                resolve(outcome);
            });
        });
    });

}



function detCourseExitence(ipaddress, uname, facname, password, coursename) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            var result = con.query('select number from ' + facname + 'courses where name = "' + coursename + '"');
            con.end();
            return result;
        }).then(function (result) {
            console.log(result);
            if (result[0] === undefined) {
                resolve(null);
            } else {
                asyncloop(result, function (arry, next) {
                    resolve(arry.number);
                });
            }
        });
    });
}

function detUndoOperationOnCourse(ipaddress, uname, facname, password, coursename, course_value) {
    return new Promise(function (resolve, reject) {
        detCourseExitence(ipaddress, uname, facname, password, coursename).
        then(function name(result) {
            var sql = (result) ? 'update ' + facname + 'courses set number = ' + course_value + ' where name = "' + coursename + '"' :
                'INSERT into ' + facname + 'courses set name = "' + coursename + '",number ="' + course_value + '"';
            resolve(sql);
        });
    });
}

function undoCouse(ipaddress, uname, facname, password, coursename, course_value) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            detUndoOperationOnCourse(ipaddress, uname, facname, password, coursename, course_value).
            then(function (operation) {
                var result = con.query(operation);
                con.end();
                return result;
            }).then(function (outcome) {
                resolve(outcome);
            });
        });
    });

}

function scheduledExitence(ipaddress, uname, password, facname, period) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            var result = con.query('select course from ' + facname + 'scheduled where period = "' + period + '"');
            con.end();
            return result;
        }).then(function (result) {
            asyncloop(result, function (arry, next) {
                resolve(arry.course);
            });
        });
    });
}

function dTermineScheduleUndoOpera(ipaddress, uname, password, facname, period, tempschedule) {
    return new Promise(function (resolve, reject) {
        scheduledExitence(ipaddress, uname, password, facname, period).
        then(function (scheduled) {
            var schedule;
            var tempname = '<br/>' + tempschedule;
            if (scheduled) {
                schedule = scheduled.replace(tempname, '');
            } else {
                schedule = null;
            }
            var sql = (tempschedule.length === scheduled.length) ? 'update ' + facname +
                'scheduled set course = null where period = "' + period + '"' : 'update ' +
                facname + 'scheduled set course = "' +
                schedule + '" where period = "' + period + '"';
            resolve(sql);
        });
    });
}


function undoSchedule(ipaddress, uname, password, facname, period, tempschedule) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            dTermineScheduleUndoOpera(ipaddress, uname, password, facname, period, tempschedule).
            then(function (operation) {
                console.log(operation)
                var result = con.query(operation);
                con.end();
                return result;
            }).then(function (outcome) {
                resolve(outcome);
            });
        });
    });
}

function dropfacscheduled(facname, ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            var sql = 'drop table ' + facname + 'scheduled';
            var result = con.query(sql);
            con.end();
            return result;
        }).then(function (results) {
            var createfunc = require('./createfunc');
            var fs = require('fs');
            fs.readFile('password.txt', function (err, data) {
                createfunc.getnoWeeks(data.toString(), function (err, noweeks) {
                    console.log(noweeks)
                    createfunc.createFacsheduledEXT(ipaddress,uname,password, facname, noweeks,
                        function (outcome) {
                            resolve();
                        });
                });
            });
        });
    });
}

function localundo(ipaddress, uname, password, facname, period,
    coursename, coursevalue, tempschedule) {
    return new Promise(function (resolve, reject) {
        undoCouse(ipaddress, uname, facname, password, coursename, coursevalue).
        then(function (outcome) {
            undoSchedule(ipaddress, uname, password, facname, period, tempschedule).
            then(function (outcome2) {
                resolve(outcome2);
            });
        });
    });
}


module.exports.undo = function undo(ipaddress, uname, password, facname, changes) {
    return new Promise(function (resolve, reject) {
        console.log("undo function was successfuly connected");
        console.log('yeahhhhhhh***********************************');
        console.log(changes);
        if (!changes.initialclassname) {
            console.log("nothing was initialy done!");
        } else {
            var classname = changes.initialclassname;
            var space = changes.initialspace;
            var period = changes.index;
            var coursename = changes.initialcoursename;
            var coursevalue = changes.initialregistered;
            var tempschedule = coursename + '-' + classname;

            undoOut(ipaddress, uname, password, classname, space, period).
            then(function (outcome1) {
                console.log(outcome1);
                localundo(ipaddress, uname, password, facname, period, coursename,
                    coursevalue, tempschedule).then(function (outcome2) {
                    resolve(outcome2);
                });
            });
        }
    });
};


function getperiods(password, uname, ipaddress) {
    return new Promise(function (resolve, reject) {
        var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
        var index = [];
        var period = [];
        var numweeks = [];
        getnoWeeks(password, ipaddress, uname).
        then(function (result) {
            for (var i = 0; i < result; i++) {
                numweeks.push(i);
            }
            numweeks.forEach(function (num) {
                day.forEach(element => {
                    periods.forEach(value => {
                        index.push(num + element.substr(0, 3) + '_' + value.substr(0, 2));
                    });
                });
            });
            resolve(index);
        });
    });
}

/* This functiion collects all the periods in a particular day from the periods array */
function getsDayScheduledCourses(day, periods) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        var result = [];
        asyncloop(periods, function (period, next) {
            var tempday = period.substr(0, 4);
            if (day === tempday) {
                result.push(period);
            }
            if (i === periods.length - 1) {
                resolve(result);
            }
            i++;
            next();
        });
    });
}
/* This function collects all the scheduled courses on a particular day */
function collectDayScheduledCourses(day, periods, ipaddress, uname, password, facname) {
    var tempstring = '';
    var i = 0;
    return new Promise(function (resolve, reject) {
        getsDayScheduledCourses(day, periods).then(function (dayarr) {
            asyncloop(dayarr, function (period, next) {
                getscheduledperiod(period, facname, ipaddress, uname, password).then(function (result) {
                    tempstring += result + '<br/>';
                    if (i === dayarr.length - 1) {

                        resolve(tempstring);
                    }
                    i++;
                    next();
                });
            });
        });
    });
}

function check(element1, element2) {
    return new Promise(function (resolve, reject) {
        scrapnum(element1)
            .then(function (code1) {
                scrapnum(element2)
                    .then(function (code2) {
                        (code1[0] === code2[0]) ? resolve(true): resolve(false);
                    });
            });
    });
}

/* This function checks if a particular level have a course being scheduled on a particular period */
function levelcheckperiod(currentcourse, ipaddress, uname, password, facname, period) {
    var arr = [];
    var i = 0;
    var j = 0;
    var course = [];
    return new Promise(function (resolve, reject) {
        var temp;
        getscheduledperiod(period, facname,
            ipaddress, uname, password).
        then(function name(scheduled) {

            if (scheduled) {
                arr = scheduled.split('<br/>');
                asyncloop(arr, function (scheduler, next) {
                    course.push(scheduler.split('-'));
                    check(course[i][0], currentcourse)
                        .then(function (status) {
                            status2 = checkifScheduled(course[i][0], currentcourse);
                            if (!(status === false && status2 === false)) j++;
                            if (i === arr.length - 1)(j == 0) ? resolve(false) : resolve(true);
                            i++;
                            next();
                        });
                });
            } else {
                resolve(false);
            }
        });

    });

}

function checkifScheduled(course1, course2) {
    return (course1 === course2) ? true : false;
}

function occurancescheck(occured, element) {
    return new Promise(function (resolve, reject) {
        var occurance = occured.indexOf(element);
        if (occurance > -1) {
            resolve(true);
        } else {
            occured.push(element);
            resolve(false);
        }
    });
}

/*This function checks wether a particular level has more than two courses a day */
function getUnicCouseday(ipaddress, uname, password, facname, day) {
    var arr = [];
    var occured = [];
    var i = 0;
    var j = 0;
    var course = [];
    return new Promise(function (resolve, reject) {
        var temp;
        getperiods(password, uname, ipaddress).then(function (periods) {
            collectDayScheduledCourses(day, periods, ipaddress, uname, password, facname).
            then(function name(scheduled) {
                if (scheduled) {
                    arr = scheduled.split('<br/>');
                    asyncloop(arr, function (scheduler, next) {
                        course.push(scheduler.split('-'));
                        var tempcourse = course[i][0];
                        occurancescheck(occured, course[i][0]).
                        then(function (occuranceStatus) {
                            console.log(occured);
                            if (i === arr.length - 1) {
                                resolve(occured);
                            }
                            i++;
                            next();
                        });
                    });
                } else {
                    resolve([]);
                }
            });
        });
    });
}

function levelCheckDay(currentcourse, ipaddress, uname, password, facname, day) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        var j = 0;
        getUnicCouseday(ipaddress, uname, password, facname, day).
        then(function (courses) {
            if (courses[0]) {
                asyncloop(courses, function (course, next) {
                    check(course, currentcourse).
                    then(function (status) {
                        var status2 = checkifScheduled(course, currentcourse);
                        if (!(status === false && status2 === false)) {
                            j++;
                        }
                        if (i === courses.length - 1) {
                            (j < 2) ? resolve(false): resolve(true);
                        }
                        i++;
                        next();
                    });
                });
            } else {
                resolve(false);
            }
        });
    });
}

function scrapnum(sreing) {
    var result1 = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < sreing.length; i++) {
            numselect(sreing[i], result1);
        }
        resolve(result1);
    });
}

function numselect(element, arr) {
    if (element >= '0' && element <= '9') arr.push(element);
}

var checkIfligible = function checkIfligible(coursename, ipaddress, uname, password, facname, period) {
    return new Promise(function (resolve, reject) {
        levelCheckDay(coursename, ipaddress, uname, password, facname, period.substr(0, 4)).then(function (status1) {
            levelcheckperiod(coursename, ipaddress, uname, password, facname, period).
            then(function (status2) {
                (status1 === false && status2 === false) ? resolve(false): resolve(true);
            });
        });
    });
};
module.exports.checkIfligible = checkIfligible;

var dropfacs = function dropfacs(ipadress, password, uname) {
    return new Promise(function (resolve, reject) {
        var conn = {};
        makemsqlconnection(ipadress, uname, password).
        then(function (con) {
            var result = con.query('drop table faculties');
            con.end();
            return result;
        }).then(function (result) {
            var createfunc = require('./createfunc');
            createfunc.createfactable(password, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    resolve('every thing went just fine!');
                }
            });
        });
    });
};

module.exports.dropfacs = dropfacs;
var dropFaccourses = function dropFaccourses(ipadress, password, uname, facname) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipadress, uname, password).then(function (con) {
            var result = con.query('drop table ' + facname + 'courses');
            con.end();
            return result;
        }).then(function (result) {
            console.log(result);
            var createfunc = require('./createfunc');
            createfunc.createfaccourses(facname, ipadress, uname, password,
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(err);
                    }
                });
        });
    });

};

module.exports.dropFaccourses = dropFaccourses;

var dropCourse = function dropCourse(coursename, facname, ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        makemsqlconnection(ipaddress, uname, password).
        then(function (con) {
            result = con.query('delete from ' + facname + 'courses where name ="' + coursename + '";');
            con.end();
            return result;
        }).then(function (result) {
            console.log("+++++++++++++++++++++++++++++++++++++++++++++");
            resolve(result);
        });
    });

};

module.exports.dropCourse = dropCourse;

var undoglobal = function undoglobal(ipaddress, dbpassword, uname, globaldid) {
    console.log(globaldid, "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
    return new Promise(function (resolve, reject) {
        const fs = require('fs');
        const createfunc = require('./createfunc');
        fs.readFile('scheduled.json', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var globaldidbig = JSON.parse(data);
                console.log(globaldid);
                fs.readFile('CLASSES.json', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var originalClasses = JSON.parse(data);
                        const asyncloop = require('node-async-loop');
                        var j = 0;
                        asyncloop(globaldid, function (item, next) {
                            console.log(item.value);
                            var classes = item.value.classes;
                            console.log(classes);
                            var i = 0;
                            console.log(classes);
                            asyncloop(classes, function (classs, next2) {
                                var capacities = originalClasses[classs];
                                console.log(classs, capacities, item.value.period, '************');
                                createfunc.addhall(item.value.period, ipaddress, uname, dbpassword, classs, capacities,
                                    function (err) {
                                        if (i === classes.length - 1) {
                                            createfunc.addfaccourse(item.value.facname, ipaddress, uname, dbpassword, item.value.course,
                                                item.value.course_values,
                                                function (errr) {
                                                    console.log('cool!');
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        dropfacscheduled(item.value.facname, ipaddress, uname, dbpassword).
                                                        then(function () {
                                                            var r = 0;
                                                            if (j === Object.keys(globaldid).length - 1) {
                                                                asyncloop(globaldid, function (item, next) {
                                                                    delete globaldidbig[item.key];
                                                                    if (r === Object.keys(globaldid).length - 1) {
                                                                        fs.writeFile('scheduled.json', JSON.stringify(globaldidbig, null, 4),
                                                                            function (err) {
                                                                                console.log(err);
                                                                                resolve();
                                                                            });
                                                                    }
                                                                    r++;
                                                                    next();
                                                                });
                                                            }
                                                            j++;
                                                            next();
                                                        });
                                                    }
                                                });
                                        }
                                        i++;
                                        next2();
                                    });
                            });
                        });
                    }
                });
            }
        });
    });

};



module.exports.undoglobal = undoglobal;