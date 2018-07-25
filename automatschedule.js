var boardfunc = require('./boardfunc');
var createfunc = require('./createfunc');
var async = require('async');
var autofunc = require('./autofunc');
var ipaddress = 'localhost';
var uname = 'santers';
var dbpassword = 'santers1997';
var period = [];
var numweeks = [];
var asyncloop = require('node-async-loop');

var newperiod = null;
var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
var index = [];
var period = [];
var CLASSES = {
    'amphy-150A': 63,
    'amphy-150B': 63,
    'amphy-150C': 63,
    'amphy-150D': 63,
    'amphy-150E': 63,
    'amphy-600': 342,
    'amphy-750': 325,
    'CLBK1_100A': 84,
    'CLBK1_100B': 84,
    ' CLBK1_150A': 105,
    ' CLBK1_150B': 104,
    'CLBK1_50A': 30,
    'CLBK1_50B': 30,
    ' CLBK1_50C': 30,
    'CLBK1_50D': 30,
    'CLBK1_50E': 30,
    'CLBK1_50F': 30,
    'CLBK1_50G': 30,
    'CLBK1_50H': 30,
    'CLBK2_100A': 51,
    ' CLBK2_100B': 54,
    'CLBK2_150A': 84,
    ' CLBK2_150B': 84,
    'CLBK2_50A': 30,
    ' CLBK2_50B': 30,
    ' CLBK2_50C': 30,
    ' CLBK2_50D': 30,
    'CLBK2_50E': 30,
    ' CLBK2_50F': 30,
    ' CLBK2_50G': 30,
    'CLBK2_50H': 30,
    ' CV_ROOM1': 30,
    '  CV_ROOM2': 30,
    ' CV_ROOM3': 30,
    'CV_ROOM4': 30,
    'CV_ROOM5': 30,
    'CV_ROOM6': 30,
    ' G103': 39,
    'G105': 39,
    'G107': 39,
    'G108': 39,
    'G111': 39,
    'G112': 57,
    'G114': 57,
    'Rest1': 24,
    'Rest4': 74,
    'Rest5': 74,
    'Rest6': 78,
    'UBLKB': 162,
    'UBLKD': 78,
    'UBLKE': 78,
    'UBLKF': 78
};
autofunc.getnoWeeks(dbpassword, ipaddress, uname).
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
    newperiod = randomNoRepeats(index);
});

function getperiods(password, uname, ipaddress) {
    return new Promise(function (resolve, reject) {
        var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
        var index = [];
        var period = [];
        autofunc.getnoWeeks(dbpassword, ipaddress, uname).
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

function automaticschedler(ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        coursesetup(ipaddress, uname, password).
        then(function (courses) {
            console.log(courses);
            var samplecourses = courses;
            asyncloop(courses, function (course, next) {
                coursesplit(course).
                then(function (cours) {
                    console.log(cours);
                    schedule(null, newperiod(), cours.facname,
                        ipaddress, uname, password, cours.courses).
                    then(function (fits) {
                        if (i === courses.length - 1) resolve(fits);
                        i++;
                        next();
                    });
                });
            });
        });
    });
}

function takenewcourse(i, j, samplecourses) {
    return new Promise(function (resolve, reject) {
        if (j !== i) {
            var newcours = samplecourses.pop();
            j = i;
            resolve({
                'newcours': newcours,
                'i': i
            });
        } else {
            resolve(null);
        }
    });
}
automaticschedler('localhost', 'root', dbpassword).
then(function (courses) {
    console.log(courses);

});

function coursesplit(course) {
    return new Promise(function (resolve, reject) {
        if (course[0] == null) {} else {
            var coursename = course[0].split('.')[1];
            var coursevalue = course[1];
            var facname = course[0].split('.')[0];
            resolve({
                'coursename': coursename,
                'coursevalue': coursevalue,
                'facname': facname,
                'courses': course
            });
        }
    });

}

function spacefinder(noRegistered, value) {
    var space = (noRegistered - value) > 0 ? noRegistered - value : value - noRegistered;
    return space;
}

function sortdif25(middlespace) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        var temp = [];
        asyncloop(middlespace, function (space, next) {
            var spacer = spacefinder(25, space[1]);
            temp.push([space[0], spacer]);
            if (i === middlespace.length - 1) resolve(temp.sort(sortFunction));
            i++;
            next();
        });
    });
}


function determinebestmiddle(middlespace, middlefits, user, facname,
    password, ipaddress, classes, course, period) {
    return new Promise(function (resolve, reject) {
        getrecurrentelement(middlefits, classes, middlespace).
        then(function (middle) {
            sortdif25(middle).
            then(function (sortedspace) {
                var temp = course.coursename;
                autofunc.makechanges(facname, password, ipaddress, user, classes, sortedspace[0][0],
                    course.coursevalue, period, temp).
                then(function (changes) {
                    resolve(changes);
                });
            });
        });
    });

}

function schedule(previouschoosed, period, facname, ipaddress, uname, password, newcourse) {
    return new Promise(function (resolve, reject) {
        if (newcourse[1] > 0) {
            coursesplit(newcourse).
            then(function (course) {
                // console.log(course);
                autofunc.current_classes('CLASSES', ipaddress, password, uname).
                then(function (classes) {
                    levelcheck(course.coursename, ipaddress, uname, password, facname, period).
                    then(function (status) {
                        if (status === true) {
                            schedule(null, newperiod(), facname, ipaddress, uname, password, course.courses);
                            console.log('Failed!');
                        } else {
                            autofunc.fitselse(previouschoosed, classes, course.coursevalue).
                            then(function (fits) {
                                var bestfits = fits.getbestfit();
                                var bestfitspace = fits.getbestfitspace();
                                var middlefits = fits.getmiddlefit();
                                var middleclasssvalue = fits.getmiddlefitclassvalue();
                                var bestclassvalue = fits.getbestclassvalue();
                                var middlefitspace = fits.getmiddlefitspace();
                                if (bestfits[0]) {

                                    arrtransform(bestfitspace).
                                    then(function (bestspace) {
                                        bestspace = bestspace.sort(sortFunction);
                                        console.log('bestfits');
                                        console.log(bestfits,course.coursename,course.coursevalue);
                                        resolve();
                                     /*   autofunc.makechanges(facname, password,
                                            ipaddress, uname, classes, bestspace[0][0],
                                            course.coursevalue, period, course.coursename).
                                        then(function (changes) {
                                            resolve(changes);
                                        });*/
                                    });

                                } else if (middlefits[0]) {
                                    arrtransform(middlefitspace).
                                    then(function (middlespace) {
                                        console.log('middlefits');
                                        console.log(middlefits,course.coursename,course.coursevalue);
                                       /* determinebestmiddle(middlespace, middlefits, uname, facname,
                                            password, ipaddress, classes, course, period).
                                        then(function (changes) {
                                            console.log(newcourse[1] - changes.getinitialspace(),'***********');
                                            newcourse[1] = newcourse[1] - changes.getinitialspace();
                                            nolevecheckschedule(changes.getinitialclassname(), period, facname,
                                                ipaddress, uname, password, newcourse);
                                       });*/
                                       resolve();
                                    });
                                } else {
                                    schedule(null, newperiod(), facname, ipaddress, uname, password, newcourse);
                                }
                            });
                        }
                    });
                });
            });
        } else {

            resolve('fine!');

        }
    });
}

function nolevecheckschedule(previouschoosed, period, facname, ipaddress, uname, password, newcourse) {
    return new Promise(function (resolve, reject) {

        if (newcourse[1] > 0) {
            coursesplit(newcourse).
            then(function (course) {
                autofunc.current_classes(period, ipaddress, password, uname).
                then(function (classes) {
                    autofunc.fitselse(previouschoosed, classes, course.coursevalue).
                    then(function (fits) {
                        console.log(fits);
                        var bestfits = fits.getbestfit();
                        var bestfitspace = fits.getbestfitspace();
                        var middlefits = fits.getmiddlefit();
                        var middlefitspace = fits.getmiddlefitspace();
                        if (bestfits[0]) {
                            arrtransform(bestfitspace).
                            then(function (bestspace) {
                                bestspace = bestspace.sort(sortFunction);
                                console.log('bestfits');
                                autofunc.makechanges(facname, password,
                                    ipaddress, uname, classes, bestspace[0][0],
                                    course.coursevalue, period, course.coursename).
                                then(function (changes) {
                                    resolve(bestfitspace);
                                });
                            });

                        } else if (middlefits[0]) {
                            arrtransform(middlefitspace).
                            then(function (middlespace) {
                                determinebestmiddle(middlespace, middlefits, uname, facname,
                                    password, ipaddress, classes, course, period).
                                then(function (changes) {
                                    console.log(newcourse[1] - changes.getinitialspace(), '***********');
                                    newcourse[1] = newcourse[1] - changes.getinitialspace();
                                    nolevecheckschedule(changes.getinitialclassname(), period, facname,
                                        ipaddress, uname, password, newcourse);
                                });
                            });
                        } else {
                            schedule(null, newperiod(), facname, ipaddress, uname, password, newcourse);
                        }
                    });

                });
            });
        } else {
            resolve('fine!');
        }
    });
}


function addlable(arr, lable) {
    for (var i = 0; i < arr.length; i++) {
        arr[i][0] = lable + '.' + arr[i][0];
    }

}

function addelements(incom, dest, callback) {
    for (var i = 0; i < incom.length; i++) {
        dest.push(incom[i]);
    }
    callback(dest);
}

function arrtransform(array) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        for (var key in array) {
            temp.push([key, array[key]]);
        }
        resolve(temp);
    });

}
function addtocourss(courses,course) {
    return new Promise(function(resolve, reject) {
        var i = 0;
        asyncloop(course, function (cour, next) {
            courses.push(cour);
            if(i === course.length - 1){
                resolve();
            }
            i++;
            next();
        });
    });
}
function coursesetup(ipaddress, uname, password) {
    return new Promise(function (resolve, reject) {
        autofunc.getfacs(ipaddress, uname, password).
        then(function (facnames) {
            var i = 0;
           var  result = [];
            asyncloop(facnames,function (facname,next) {
                 autofunc.faccurrent_courses(facname, ipaddress, uname, password).then(function (courses) {
                     if(courses === 'No course'){}else{
                         addlable(courses, facname);
                         addtocourss(result, courses).
                         then(function () {
                         });
                     }
                      if (i === facnames.length - 1) {
                          result.sort(comparator);
                          resolve(result);
                      }
                     i++;
                     next();
                 });
            });
        });
    });
}



function shuffle(o) { //try this shuffle function
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function scrapnum(sreing) {
    var result1 = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < sreing.length - 1; i++) {
            numselect(sreing[i], result1);

        }
        resolve(result1);
    });
}


function numselect(element, arr) {
    if (element >= '0' && element <= '9') arr.push(element);
}

function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}
B = 5; //max size of 'cache'
N = 0;

function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) {
            copy = array.slice(0);
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}

function comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}

 var levelcheck = function levelcheck(currentcourse, ipaddress, uname, password, facname, period) {
    var arr = [];
    var i = 0;
    var j = 0;
    var course = [];
    return new Promise(function (resolve, reject) {
        var temp;
        autofunc.getscheduledperiod(period, facname,
            ipaddress, uname, dbpassword).
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
module.exports.levelcheck = levelcheck;

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

function scrap(sreing) {
    var result = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < sreing.length; i++) {
            charselect(sreing[i], result);
        }
        resolve(result);
    });
}


var classes = [
    'CV_ROOM2',
    'CV_ROOM3',
    'CV_ROOM4',
    'CV_ROOM5',
    'CV_ROOM6',
    'CV_ROOM1',
    'CLBK1_100A',
    'CLBK1_100B',
    'CLBK1_150A',
    'CLBK1_150B',
    'CLBK1_50A',
    'CLBK1_50B',
    'CLBK1_50C',
    'CLBK1_50D',
    'CLBK1_50E',
    'CLBK1_50F',
    'CLBK1_50G',
    'CLBK1_50H',
    'CLBK2_100A',
    'CLBK2_100B',
    'CLBK2_150A',
    'CLBK2_150B',
    'CLBK2_50A',
    'CLBK2_50B',
    'CLBK2_50C',
    'CLBK2_50D',
    'CLBK2_50E',
    'CLBK2_50F',
    'CLBK2_50G',
    'CLBK2_50H'
];
/*arrtransform(CLASSES).
then(function (classs) {
    getrecurrentelement(classes, classs).
    then(function (result) {
        console.log(result);
    });
});*/


function selectmostoccuring(arr, element) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        var i = 0;
        asyncloop(arr, function (array, next) {
            if (array[0].substr(0, 2).toUpperCase() === element) temp.push(array);

            if (i === arr.length - 1) resolve(temp.sort(comparator));
            i++;
            next();
        });

    });
}

function getrecurrentelement(array, classes, middlefitspace) {
    var occured = {
        'gilse': 0
    };
    return new Promise(function (resolve, reject) {
        var i = 0;
        asyncloop(array, function (element, next) {
            scrap(element).
            then(function (elem) {
                occurancescheck(occured, elem.join('')).
                then(function (result) {
                    if (result.status === true) {
                        occured[elem.join('').substr(0, 2)]++;
                    } else {
                        occured[elem.join('').substr(0, 2)] = 1;
                    }
                    if (i === array.length - 1) {
                        arrtransform(occured).
                        then(function (arr) {
                            arr = arr.sort(comparator);
                            selectmostoccuring(middlefitspace, arr[0][0]).
                            then(function (result) {
                                resolve(result);
                            });
                        });
                    }
                    i++;
                });
            });
            next();
        });
    });
}

function charselect(char1, arr) {
    char1 = char1.toUpperCase();
    if (char1 >= 'A' && char1 <= 'Z') {
        arr.push(char1);
    }
}

function checkifScheduled(course1, course2) {
    return (course1 === course2) ? true : false;
}

function occurancescheck(occured, element) {
    // console.log(occured)
    return new Promise((resolve, reject) => {
        var i = 0;
        var value;
        var occurancecount = 0;
        for (var key in occured) {
            if (key === element.substr(0, 2)) {
                occurancecount++;
            } else {
                occured[element.substr(0, 2)] = 0;
            }
        }
        (occurancecount > 0) ? resolve({
            'status': true,
            'occured': occured
        }): resolve({
            'status': false,
            'occured': occured
        });


    });
}

testarray = ['giles', 'santers', 'gillons', 'nieus'];

/*occurancescheck(testarray, 'gillons', function (status) {
    if (status === true) {
        console.log('had already occured!');
    } else {
        testarray.push('gillons');
        console.log(testarray);
    }
});*/



function schedule_course(course, callback) {

}