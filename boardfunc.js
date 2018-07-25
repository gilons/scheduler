var lowtrack = 48;
var upptrack = 48;
var autofunc = require("./autofunc");
var asyncloop = require("node-async-loop");
module.exports.fits = function fits(previouschoosed, classes, noRegistered, callback) {
    console.log('*********************/*********');
    fitslevel1(previouschoosed, classes, noRegistered, function (uppertracker, lowertracker, fit) {
        console.log(fit);
        fitslevel2(classes, previouschoosed, noRegistered, fit, function (uppertracker, lowertracker, fit) {
            fitslevel3(uppertracker, lowertracker, previouschoosed, noRegistered, fit, classes, function (fits) {
                callback(fits);
            });
        });
    });
};

function fitsadder(noRegistered, value, key, fits) {
    var space = spacefinder(noRegistered, value);
    if (space <= 10) {
        fits.takeNewbestfit(key);
        fits.takebestfitspace((space), key);
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

function spacefinder(noRegistered, value) {
    var space = (noRegistered - value) > 0 ? noRegistered - value : value - noRegistered;
    return space;
}

function nonebestfitadder(limit1, limit2, noRegistered, value, key, fits) {
    var space = spacefinder(noRegistered, value);
    if (value >= limit1 && value <= limit2) {
        console.log(value);
        fits.takemiddlefit(key);
        fits.takemiddlefitspace(space, key);
        fits.takemiddlefitclassvalue(value, key);

    } else {
        fits.takeNewworsefit(key);
        fits.takeworsefitspace(space, key);
        fits.takeworseclassvalue(value, key);
    }
}
var uppertracker = 0;
var lowertracker = 0;
var i = 0;

function fitslevel1(previousclass, classes, noRegistered, callback) {
    //console.log("***************/***************");
    var fits = require('./classes').FITS;
    //  console.log(classes);
    fits.destructor();
    var uppertracker = 0;
    var lowertracker = 0;
    if (previousclass) {
        console.log("entered!");
        findclassmatch(classes, previousclass, function (result) {
            if (!result) {
                arrtransform(classes, function (array) {
                    for (var i = 0; i < array.length; i++) {
                        findmatch(array[i][0], previousclass, function (status) {
                            //console.log(array[i][0]);
                            if (status === true) {
                                fitsadder(noRegistered, array[i][1], array[i][0], fits);
                            } else {
                                nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                            }
                        });
                    }
                    //console.log(fits);
                    callback(uppertracker, lowertracker, fits);
                });
            } else {
                arrtransform(classes, function (array) {
                    console.log("entered!", result[0]);
                    findclass(array, result[0], function (upper) {
                        console.log("entered!", result[0]);
                        findclass(array, result[result.length - 1], function (lower) {
                            uppertracker = upper;
                            if ((lower == undefined || lower == 0) && (upper == undefined || upper == 0)) {} else {
                                upptrack = upper;
                                lowtrack = lower;
                            }
                            console.log(result[0]);
                            lowertracker = lower;
                            console.log(array.length);
                            for (var i = 0; i < array.length; i++) {
                                findmatch(array[i][0], previousclass, function (status) {
                                    //console.log('*********/*',previousclass);
                                    if (status === true) {
                                        // console.log('************',array[i][1]);
                                        fitsadder(noRegistered, array[i][1], array[i][0], fits);
                                    } else {
                                        nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                    }
                                });
                            }
                            callback(uppertracker, lowertracker, fits);
                        });
                    });
                });
            }

        });


    } else if (previousclass == null || previousclass == undefined) {
        //   console.log(classes);
        arrtransform(classes, function (array) {
            for (var i = 0; i < array.length - 1; i++) {
                fitsadder(noRegistered, array[i][1], array[i][0], fits);
            }
            //console.log(fits);
            callback(null, null, fits);
        });
    }
};

function insertarr(incoming, destination, callback) {
    for (var key in incoming) {
        var value = incoming[key];
        destination.push(incoming[key]);
    }
    callback();
}

function fitslevel3(upper, lower, previouschoosed, noRegistered, fits, classes, callback) {
    var bestfits = fits.getbestfit();
    var middlefits = fits.getmiddlefit();
    var bestfitstore = [];
    var middlefitstore = [];
    if (previouschoosed !== undefined &&
        bestfits[0] == undefined &&
        middlefits[0] == undefined) {
        arrtransform(classes, function (array) {

            if (upper == 0 && lower == 0) {
                console.log('********************************/***************');
                lower = lowtrack;
                upper = upper;
            }
            var test = array[lower + 1];
            if ((lower + 1) < array.length && (upper - 1) > 0) {
                fitslevel1(array[upper - 1][0], classes, noRegistered, function (uppertracker, lowertracker, fit) {
                    fitslevel2(classes, array[upper - 1][0], noRegistered, fit, function (trackerup, trackerdown, fit) {
                        var result1 = fit.getbestfit();
                        var result2 = fit.getmiddlefit();
                        insertarr(result1, bestfits, function () {
                            insertarr(result2, middlefits, function () {
                                fitslevel1(array[lower + 1][0], classes, noRegistered, function (uppertracker, lowertracker, fit) {
                                    fitslevel2(classes, array[lower + 1][0], noRegistered, fit, function (trackerup, trackerdow, fit) {
                                        if (bestfits[0] == undefined && middlefits[0] == undefined) {
                                            fitslevel1(null, classes, noRegistered, function (trackerup, trackerdown, fit) {
                                                fitslevel2(classes, null, noRegistered, fit, function (trackerup, trackerdown, fit) {
                                                    var result1 = fit.getbestfit();
                                                    var result2 = fit.getmiddlefit();
                                                    insertarr(result1, bestfits, function () {
                                                        insertarr(result2, middlefits, function () {
                                                            fits.destructor();
                                                            if (bestfits[0] != undefined) {
                                                                for (var i = 0; i < array.length; i++) {
                                                                    for (var key in bestfits) {
                                                                        value = bestfits[key];
                                                                        if (value == array[i][0]) {
                                                                            fits.takeNewbestfit(array[i][0]);
                                                                            fits.takebestfitspace((array[i][1] - noRegistered), array[i][0]);
                                                                            fits.takebestclassvalue(array[i][1], array[i][0]);
                                                                        } else {
                                                                            if (bestfits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                                                if (array[i][1] > noRegistered) {
                                                                                    fits.takeNewworsefit(array[i][0]);
                                                                                    fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                                    fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                                } else {
                                                                                    fits.takeNewworsefit(array[i][0]);
                                                                                    fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                                                    fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                                }

                                                                            }
                                                                        }

                                                                    }
                                                                }
                                                            } else {
                                                                for (var key in middlefits) {
                                                                    value = middlefits[key];
                                                                    //   console.log(value);
                                                                    for (var i = 0; i < array.length; i++) {
                                                                        if (value === array[i][0]) {
                                                                            fits.takemiddlefit(array[i][0]);
                                                                            fits.takemiddlefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                            fits.takemiddlefitclassvalue(array[i][1], array[i][0]);
                                                                        } else if (array[i][0] !== value) {
                                                                            if (middlefits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                                                //console.log(array[i][0]);
                                                                                if (array[i][1] > noRegistered) {
                                                                                    fits.takeNewworsefit(array[i][0]);
                                                                                    fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                                    fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                                } else {
                                                                                    fits.takeNewworsefit(array[i][0]);
                                                                                    fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                                                    fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    });

                                                });
                                            });
                                        } else {
                                            var result1 = fit.getbestfit();
                                            var result2 = fit.getmiddlefit();
                                            insertarr(result1, bestfits, function () {
                                                insertarr(result2, middlefits, function () {
                                                    fits.destructor();
                                                    if (bestfits[0] != undefined) {
                                                        for (var i = 0; i < array.length; i++) {
                                                            for (var key in bestfits) {
                                                                value = bestfits[key];
                                                                if (value == array[i][0]) {
                                                                    fits.takeNewbestfit(array[i][0]);
                                                                    fits.takebestfitspace((array[i][1] - noRegistered), array[i][0]);
                                                                    fits.takebestclassvalue(array[i][1], array[i][0]);
                                                                } else {
                                                                    if (bestfits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                                        if (array[i][1] > noRegistered) {
                                                                            fits.takeNewworsefit(array[i][0]);
                                                                            fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                            fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                        } else {
                                                                            fits.takeNewworsefit(array[i][0]);
                                                                            fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                                            fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                        }

                                                                    }
                                                                }

                                                            }
                                                        }
                                                    } else {
                                                        for (var key in middlefits) {
                                                            value = middlefits[key];
                                                            //   console.log(value);
                                                            for (var i = 0; i < array.length; i++) {
                                                                if (value === array[i][0]) {
                                                                    fits.takemiddlefit(array[i][0]);
                                                                    fits.takemiddlefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                    fits.takemiddlefitclassvalue(array[i][1], array[i][0]);
                                                                } else if (array[i][0] !== value) {
                                                                    if (middlefits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                                        //console.log(array[i][0]);
                                                                        if (array[i][1] > noRegistered) {
                                                                            fits.takeNewworsefit(array[i][0]);
                                                                            fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                                            fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                        } else {
                                                                            fits.takeNewworsefit(array[i][0]);
                                                                            fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                                            fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                    callback(fits);
                });
            } else if ((array[upper - 1] !== null || array[upper - 1] !== undefined) &&
                (array[lower + 1] == null || array[lower + 1] == undefined)) {
                console.log(array[upper - 1]);
                fitslevel1(array[upper - 1][0], classes, noRegistered, function (uppertracker, lowertracker, fit) {
                    fitslevel2(classes, array[upper - 1][0], noRegistered, fit, function (trackerup, trackerdow, fit) {

                        // console.log(fit);
                        var result1 = fit.getbestfit();
                        var result2 = fit.getmiddlefit();
                        insertarr(result1, bestfits, function () {
                            insertarr(result2, middlefits, function () {
                                fits.destructor();
                                if (bestfits[0] != undefined) {
                                    for (var i = 0; i < array.length; i++) {
                                        for (var key in bestfits) {
                                            value = bestfits[key];
                                            if (value == array[i][0]) {
                                                fits.takeNewbestfit(array[i][0]);
                                                fits.takebestfitspace((array[i][1] - noRegistered), array[i][0]);
                                                fits.takebestclassvalue(array[i][1], array[i][0]);
                                            } else {
                                                if (bestfits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                    if (array[i][1] > noRegistered) {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    } else {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    }

                                                }
                                            }

                                        }
                                    }
                                } else {
                                    for (var key in middlefits) {
                                        value = middlefits[key];
                                        //   console.log(value);
                                        for (var i = 0; i < array.length; i++) {
                                            if (value === array[i][0]) {
                                                fits.takemiddlefit(array[i][0]);
                                                fits.takemiddlefitspace((array[i][1] - noRegistered), array[i][0]);
                                                fits.takemiddlefitclassvalue(array[i][1], array[i][0]);
                                            } else if (array[i][0] !== value) {
                                                if (middlefits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                    //console.log(array[i][0]);
                                                    if (array[i][1] > noRegistered) {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    } else {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    });
                    callback(fits);
                });
            } else if ((array[upper - 1] == null || array[upper - 1] == undefined) &&
                (array[lower + 1] !== null || array[lower + 1] !== undefined)) {
                fitslevel1(array[lower + 1][0], classes, noRegistered, function (uppertracker, lowertracker, fit) {
                    fitslevel2(classes, array[lower + 1][0], noRegistered, fit, function (trackerup, trackerdow, fit) {
                        // console.log(fit);
                        var result1 = fit.getbestfit();
                        var result2 = fit.getmiddlefit();
                        insertarr(result1, bestfits, function () {
                            insertarr(result2, middlefitstore, function () {
                                fits.destructor();
                                if (bestfits[0] != undefined) {
                                    for (var i = 0; i < array.length; i++) {
                                        for (var key in bestfits) {
                                            value = bestfits[key];
                                            if (value == array[i][0]) {
                                                fits.takeNewbestfit(array[i][0]);
                                                fits.takebestfitspace((array[i][1] - noRegistered), array[i][0]);
                                                fits.takebestclassvalue(array[i][1], array[i][0]);
                                            } else {
                                                if (bestfits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                    if (array[i][1] > noRegistered) {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    } else {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    }

                                                }
                                            }

                                        }
                                    }
                                } else {
                                    for (var key in middlefits) {
                                        value = middlefits[key];
                                        //   console.log(value);
                                        for (var i = 0; i < array.length; i++) {
                                            if (value === array[i][0]) {
                                                fits.takemiddlefit(array[i][0]);
                                                fits.takemiddlefitspace((array[i][1] - noRegistered), array[i][0]);
                                                fits.takemiddlefitclassvalue(array[i][1], array[i][0]);
                                            } else if (array[i][0] !== value) {
                                                if (middlefits.indexOf(array[i][0]) == -1 && fits.getworsefit().indexOf(array[i][0]) == -1) {
                                                    //console.log(array[i][0]);
                                                    if (array[i][1] > noRegistered) {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((array[i][1] - noRegistered), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    } else {
                                                        fits.takeNewworsefit(array[i][0]);
                                                        fits.takeworsefitspace((noRegistered - array[i][1]), array[i][0]);
                                                        fits.takeworseclassvalue(array[i][1], array[i][0]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        });

                    });
                    callback(fits);
                });
            }

        });
    } else {
        callback(fits);
    }
}



function fitslevel2(classes, previousclass, noRegistered, fits, callback) {
    var bestfits = fits.getbestfit();
    var middlefit = fits.getmiddlefit();
    if (bestfits[0] === null || bestfits[0] == undefined) {
        fits.destructor();
        if (previousclass != null || previousclass != undefined) {
            var uppertracker = 0;
            var lowertracker = 0;
            if (noRegistered >= 250 && noRegistered < 400) {
                console.log("entered!");
                findclassmatch(classes, previousclass, function (result) {
                    if (result == null || result == [] || result[0] == undefined) {
                        arrtransform(classes, function (array) {
                            for (var i = 0; i < array.length - 1; i++) {
                                findmatch(array[i][0], previousclass, function (status) {
                                    if (status === true) {
                                        fitsadder(noRegistered, array[i][1], array[i][0], fits);
                                    } else {
                                        nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                    }
                                });
                            }
                            callback(uppertracker, lowertracker, fits);
                        });
                    } else {
                        arrtransform(classes, function (array) {
                            console.log("entered!", result[0]);
                            findclass(array, result[0], function (upper) {
                                console.log("entered!", result[0]);
                                findclass(array, result[result.length - 1], function (lower) {
                                    uppertracker = upper;
                                    lowertracker = lower;
                                    if ((lower == undefined || lower == 0) &&
                                        (upper == undefined || upper == 0)) {} else {
                                        upptrack = upper;
                                        lowtrack = lower;
                                    }
                                    for (var i = 0; i < array.length - 1; i++) {
                                        findmatch(array[i][0], previousclass, function (status) {
                                            if (status === true) {
                                                console.log("ERRRRRRRRRRRRRR*", array[i][0]);
                                                nonebestfitadder(100, 250, noRegistered, array[i][1], array[i][0], fits);
                                            } else {
                                                nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                            }
                                        });
                                    }
                                });
                            });
                            callback(uppertracker, lowertracker, fits);
                        });
                    }
                });


            } else if (noRegistered >= 400) {
                console.log("entered!");
                findclassmatch(classes, previousclass, function (result) {
                    if (result == null || result == [] || result[0] == undefined) {
                        arrtransform(classes, function (array) {
                            for (var i = 0; i < array.length - 1; i++) {
                                findmatch(array[i][0], previousclass, function (status) {
                                    if (status === true) {
                                        fitsadder(noRegistered, array[i][1], array[i][0], fits);
                                    } else {
                                        nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                    }
                                });
                            }
                            callback(uppertracker, lowertracker, fits);
                        });
                    } else {
                        arrtransform(classes, function (array) {
                            console.log("entered!", result[0]);
                            findclass(array, result[0], function (upper) {
                                console.log("entered!", result[0]);
                                findclass(array, result[result.length - 1], function (lower) {
                                    uppertracker = upper;
                                    lowertracker = lower;
                                    if ((lower == undefined || lower == 0) &&
                                        (upper == undefined || upper == 0)) {} else {
                                        upptrack = upper;
                                        lowtrack = lower;
                                    }
                                    for (var i = 0; i < array.length - 1; i++) {
                                        findmatch(array[i][0], previousclass, function (status) {
                                            if (status === true) {
                                                nonebestfitadder(200, 1000, noRegistered, array[i][1], array[i][0], fits);
                                            } else {
                                                nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                            }
                                        });
                                    }
                                });
                            });
                            callback(uppertracker, lowertracker, fits);
                        });
                    }

                });
            } else if (noRegistered >= 100 && noRegistered <= 249) {
                console.log("entered!");
                findclassmatch(classes, previousclass, function (result) {
                    if (result == null || result == [] || result[0] == undefined) {
                        arrtransform(classes, function (array) {
                            for (var i = 0; i < array.length - 1; i++) {
                                findmatch(array[i][0], previousclass, function (status) {
                                    if (status === true) {
                                        fitsadder(noRegistered, array[i][1], array[i][0], fits);
                                    } else {
                                        nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                    }
                                });
                            }
                            callback(uppertracker, lowertracker, fits);
                        });
                    } else {
                        arrtransform(classes, function (array) {
                            findclass(array, result[0], function (upper) {
                                findclass(array, result[result.length - 1], function (lower) {
                                    uppertracker = upper;
                                    console.log(uppertracker);
                                    if ((lower == undefined || lower == 0) &&
                                        (upper == undefined || upper == 0)) {} else {
                                        upptrack = upper;
                                        lowtrack = lower;
                                    }
                                    lowtrack = lower;
                                    for (var i = 0; i < array.length - 1; i++) {
                                        findmatch(array[i][0], previousclass, function (status) {
                                            if (status === true) {
                                                nonebestfitadder(50, 150, noRegistered, array[i][1], array[i][0], fits);
                                            } else {
                                                nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                            }
                                        });
                                    }
                                });
                            });
                            callback(uppertracker, lowertracker, fits);
                        });
                    }

                });
            } else if (noRegistered <= 99) {
                console.log("entered!");
                findclassmatch(classes, previousclass, function (result) {
                    if (result == null || result == [] || result[0] == undefined) {
                        arrtransform(classes, function (array) {
                            for (var i = 0; i < array.length - 1; i++) {
                                findmatch(array[i][0], previousclass, function (status) {
                                    if (status === true) {
                                        fitsadder(noRegistered, array[i][1], array[i][0], fits);
                                    } else {
                                        nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                    }
                                });
                            }
                            callback(uppertracker, lowertracker, fits);
                        });
                    } else {
                        arrtransform(classes, function (array) {
                            findclass(array, result[0], function (upper) {
                                console.log("entered!", result[0]);
                                findclass(array, result[result.length - 1], function (lower) {
                                    uppertracker = upper;
                                    lowertracker = lower;
                                    if ((lower == undefined || lower == 0) &&
                                        (upper == undefined || upper == 0)) {} else {
                                        upptrack = upper;
                                        lowtrack = lower;
                                    }
                                    for (var i = 0; i < array.length - 1; i++) {
                                        findmatch(array[i][0], previousclass, function (status) {
                                            if (status === true) {
                                                nonebestfitadder(20, 79, noRegistered, array[i][1], array[i][0], fits);
                                            } else {
                                                nobestnormiddle(noRegistered, array[i][1], array[i][0], fits);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                        callback(uppertracker, lowertracker, fits);
                    }

                });
            }
        } else {
            console.log(noRegistered);
            if ((noRegistered >= 250) && (noRegistered < 400)) {
                arrtransform(classes, function (array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        nonebestfitadder(81, 200, noRegistered, array[i][1], array[i][0], fits);
                    }
                });
            } else if ((noRegistered) >= 400) {
                arrtransform(classes, function (array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        nonebestfitadder(125, 1000, noRegistered, array[i][1], array[i][0], fits);
                    }
                });
            } else if (noRegistered >= 100 && noRegistered <= 249) {
                arrtransform(classes, function (array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        nonebestfitadder(51, 150, noRegistered, array[i][1], array[i][0], fits);
                    }
                });
            } else if (noRegistered <= 99) {
                arrtransform(classes, function (array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        nonebestfitadder(20, 79, noRegistered, array[i][1], array[i][0], fits);
                    }
                });
            }
            callback(null, null, fits);
        }
    } else {
        //  console.log(fits);
        callback(null, null, fits);
    }
};

function scrap(sreing, callback) {
    var result = [];
    var j = 0;
    for (i = 0; i < sreing.length; i++) {
        if (sreing[i] >= "0" && sreing[i] <= "9") {
            // console.log("integer!");
        } else if ((sreing[i] >= 'a' && sreing[i] <= 'z') || (sreing[i] >= 'A' && sreing[i] <= 'Z')) {
            result[j] = sreing[i];
            j++;
        }
    }
    callback(result.join(''));
}

function arrtransform(array, callback) {
    var temp = [];
    for (var key in array) {
        temp.push([key, array[key]]);
        //  console.log(temp);
    }

    callback(temp);
}

function findclass(classes, classs, callback) {
    var temp;
    for (var i = 0; i < classes.length - 1; i++) {
        if (classes[i][0] == classs) {
            temp = i;
            break;

        }
    }
    callback(temp);
    console.log("found!");
}

function findclassmatch(classes, match, callback) {
    var temp = [];
    for (var key in classes) {
        var value = classes[key];
        scrap(key, function (result1) {
            scrap(match, function (result2) {
                if ((result1 == result2) || (key.substr(0, 3) == match.substr(0, 3))) {
                    temp.push(key);
                }
            });
        });
    }
    callback(temp);
}

function findmatch(classs, match, callback) {
    var temp;
    scrap(classs, function (result1) {
        scrap(match, function (result2) {
            if ((result1 == result2) || (classs.substr(0, 4) === match.substr(0, 4))) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}


module.exports.choose_class = function choose_class(host, user, password, classes,
    classs, course, tablename, coursename, callback) {
    var changes = require('./classes').INITIALS;
    var sql;
    var mysql = require('mysql');
    var valueglobal = null;
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "scheduler"
    });
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
        } else {
            var valueglo = null;
            //   console.log(classes);
            console.log('connected');
            for (var key in classes) {
                valueglo = classes[key];
                var temp;
                var tempo;
                tempo = null;
                if (key == classs) {
                    if (valueglo >= course) {
                        if (((valueglo - course) <= 10) && ((valueglo - course) >= 0) ||
                            ((course - valueglo) <= 5 && (course - valueglo) >= 0)) {
                            valueglobal = valueglo;
                            sql = 'delete from ' + tablename + ' where class_name = "' + key + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(valueglo, '*************/***************55');
                                    console.log('number of components deleted are ', result.affectedRows);
                                    console.log(valueglobal, '*****************//*****************');

                                    changes.takeinitialclassname(classs);
                                    changes.takeinitialcoursename(coursename);
                                    changes.takeinitialregistered(course);
                                    changes.getindex(tablename);
                                    changes.takeinitialspace(valueglobal);
                                    console.log("scheduled table successfuly updated ");
                                    con.end();
                                    tempo = null;
                                    callback(null, changes);
                                }

                            });
                        }
                        if ((valueglo - course) > 10) {
                            temp = valueglo - course;
                            valueglobal = valueglo;
                            sql = 'update ' + tablename + ' set capacity1 = ' + temp + ' where class_name = "' + key + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                } else {
                                    console.log(result.affectedRows + " records update");
                                    changes.takeinitialclassname(classs);
                                    changes.takeinitialcoursename(coursename);
                                    changes.takeinitialregistered(course);
                                    changes.getindex(tablename);
                                    changes.takeinitialspace(valueglobal);
                                    console.log("scheduled table successfuly updated ");
                                    tempo = null;
                                    con.end();
                                    callback(null, changes);
                                }
                            });
                        }

                    }
                    if (valueglo < course) {

                        if (((valueglo - course) <= 10) && ((valueglo - course) >= 0) ||
                            ((course - valueglo) <= 5 && (course - valueglo) >= 0)) {
                            valueglobal = valueglo;
                            sql = 'delete from ' + tablename + ' where class_name = "' + key + '"';
                            console.log("yoyooyooooyooyoooyooyooooo", valueglo);
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(valueglo, '*************/***************55');
                                    console.log('number of components deleted are ', result.affectedRows);
                                    console.log(valueglobal, '*****************//*****************');

                                    changes.takeinitialclassname(classs);
                                    changes.takeinitialcoursename(coursename);
                                    changes.takeinitialregistered(course);
                                    changes.getindex(tablename);
                                    changes.takeinitialspace(valueglobal);
                                    console.log("scheduled table successfuly updated ");
                                    con.end();
                                    tempo = null;
                                    callback(null, changes);
                                }

                            });
                        } else {
                            temp = course - valueglo;
                            valueglobal = valueglo;
                            sql = 'delete from ' + tablename + ' where class_name = "' + classs + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                } else {
                                    changes.takeremainingstudent(temp);
                                    console.log("course partly scheduled");
                                    console.log("scheduled table successfuly updated ");
                                    changes.takeinitialclassname(classs);
                                    changes.takeinitialcoursename(coursename);
                                    changes.takeinitialregistered(course);
                                    changes.getindex(tablename);
                                    changes.takeinitialspace(valueglobal);
                                    tempo = null;
                                    con.end();
                                    callback(null, changes);

                                }
                            });
                        }


                    }
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
            con.end();
            callback(err, null);
        } else {
            console.log("undo function was successfuly connected");

            var tempo;
            tempo = null;
            var sql;
            var index;
            var name;
            var temp;
            if (changes != {} || changes != null) {
                temp = changes.getinitialclassname();
                temp1 = changes.getinitialspace();
                index = changes.giveindex();
                name = changes.getinitialcoursename();
                var temp2;
                temp2 = changes.getinitialregistered();
                console.log(index, temp1);
                sql = 'select capacity1 from `' + index + '` where class_name = "' + temp + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        con.end();
                        callback(err);
                    } else {
                        for (var key in result) {
                            var value = result[key];
                            for (var key2 in value) {
                                tempo = value[key2];
                                console.log(tempo);
                            }
                        }
                        if (tempo == null || tempo == undefined) {
                            console.log('*/**************/****************/*************************');
                            sql = 'INSERT into `' + index + '` set class_name = "' + temp + '", capacity1 = ' + temp1 + ' , capacity2 = ' + 0;
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    con.end();
                                    console.log(index + " successfuly reverted");
                                    callback(null);
                                }
                            });
                        }
                        if (tempo != null || tempo != undefined) {

                            sql = 'update ' + index + ' set capacity1 = ' + temp1 + ' where class_name = "' + temp + '" ';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);

                                } else {
                                    con.end();
                                    callback(null);
                                    console.log(index + " successfuly reverted");
                                }
                            });
                        }
                    }

                });
            }
        }
    });
};

module.exports.current_classes = function current_classes(classname, ipaddress, dbpassword, universname, callback) {
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
            console.log('connected');
            i = 0;
            temp = [];
            temp1 = [];
            temp2 = [];
            sql = 'select class_name from ' + classname + ' ';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);

                } else {
                    for (var key in result) {
                        var value = result[key];

                        for (var key2 in value) {
                            temp.push(value[key2]);
                        }
                        //   console.log(temp);
                    }
                    sql = 'select capacity1 from ' + classname + '';
                    con.query(sql, function (err, result) {
                        if (err) {
                            con.end();
                            callback(err, null);

                        } else {
                            for (var key in result) {
                                var value = result[key];
                                for (var key2 in value) {
                                    temp1.push(value[key2]);
                                }
                            }
                            //  console.log(temp1);
                            for (i = 0; i < temp.length + 1; i++) {
                                temp2[temp[i]] = temp1[i];
                            }
                            // console.log(temp2);
                            con.end();
                            callback(null, temp2);
                        }

                    });
                }
            });
        }
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
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            i = 0;
            temp = [];
            temp1 = [];
            temp2 = [];

            sql = 'select name from courses ';
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
                    sql = 'select number from courses ';
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

};
module.exports.faccurrent_courses = function faccurrent_courses(facname, ipaddress,
    uname, dbpassword, callback) {
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

            var sql = 'select name from ' + facname + 'courses ';
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

module.exports.classtable_existence = function classtable_existence(incoming, present, callback) {
    u = 0;
    for (i = 0; i < incoming.length; ++i) {
        for (j = 0; j <= present.length - 1; ++j) {
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
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            sql = 'select number from courses where name = "' + name + '"';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end(err);
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        for (var key2 in value) {
                            temp = value[key2];
                        }
                    }
                    con.end();
                    callback(null, temp);
                }
            });
        }
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
            con.end();
            callback(err, null);

        } else {
            console.log('connected');
            sql = 'show tables;';
            con.query(sql, function (err, result) {
                if (err) {
                    con.end();
                    callback(err, null);
                } else {
                    for (var key in result) {
                        var value = result[key];
                        i++;
                        for (var key1 in value) {
                            var value1 = value[key1];
                            temp.push(value1);

                        }
                    }
                    con.end();
                    callback(null, temp);
                }
            });
        }
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
            con.end();
            callback(err);
        } else {
            console.log('connected');
            for (var key in classes) {
                var valueglo = classes[key];
                var sql;
                var temp;
                var tempo;
                temo = null;
                var tempschedule = coursename + '-' + classs;
                //  console.log(tempschedule, "*************");
                if (key == classs) {
                    if (valueglo >= course) {
                        if (((valueglo - course) <= 10) && ((valueglo - course) >= 0) ||
                            ((course - valueglo) <= 5 && (course - valueglo) >= 0)) {
                            sql = 'delete from courses where name = "' + coursename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log('number of affected rows is ' + result.affectedRows);
                                    sql = 'select course from scheduled where period = "' + tablename + '"';
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
                                            if (tempo != null || tempo != undefined) {
                                                console.log(tempo, "++++++++++");
                                                var cour = tempo + '<br/>' + tempschedule;
                                                sql = 'update scheduled set course = "' + cour + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);

                                                    } else {
                                                        console.log("scheduled table successfuly updated ");
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                            if (tempo == null || tempo == undefined) {
                                                console.log('***************************************/************', tempo, tablename);
                                                sql = 'update scheduled set course ="' + tempschedule + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log('new course successfuly scheduled');
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                            });
                        }
                        if ((valueglo - course) > 10) {
                            temp = valueglo - course;
                            sql = 'delete from courses where name = "' + coursename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log('number of affected rows is ' + result.affectedRows);
                                    sql = 'select course from scheduled where period = "' + tablename + '"';
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
                                            if (tempo != null || tempo != undefined) {
                                                var cour = tempo + '<br/>' + tempschedule;
                                                console.log(cour);
                                                sql = 'update scheduled set course = "' + cour + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log("scheduled table successfuly updated ");
                                                        tempo = null;
                                                        con.end();
                                                        callback(null);
                                                    }
                                                });
                                            }
                                            if (tempo == null || tempo == undefined) {
                                                console.log(tempschedule, "666666666666");
                                                sql = 'update scheduled set course = "' + tempschedule + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        tempo = null;
                                                        console.log('new course successfuly scheduled');
                                                        con.end();
                                                        callback(null);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                            });
                        }

                    }
                    if (valueglo < course) {
                        if (((valueglo - course) <= 10) && ((valueglo - course) >= 0) ||
                            ((course - valueglo) <= 5 && (course - valueglo) >= 0)) {
                            sql = 'delete from courses where name = "' + coursename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log('number of affected rows is ' + result.affectedRows);
                                    sql = 'select course from scheduled where period = "' + tablename + '"';
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
                                            if (tempo != null || tempo != undefined) {
                                                console.log(tempo, "++++++++++");
                                                var cour = tempo + '<br/>' + tempschedule;
                                                sql = 'update scheduled set course = "' + cour + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);

                                                    } else {
                                                        console.log("scheduled table successfuly updated ");
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                            if (tempo == null || tempo == undefined) {
                                                console.log('***************************************/************', tempo, tablename);
                                                sql = 'update scheduled set course ="' + tempschedule + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log('new course successfuly scheduled');
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                            });
                        } else {
                            temp = course - valueglo;
                            sql = 'update courses set  number = "' + temp + '" where name = "' + coursename + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log("courses table successfuly updated");
                                    sql = 'select course from scheduled where period = "' + tablename + '"';
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
                                            if (tempo != null || tempo != undefined) {
                                                cour = tempo + '<br/>' + tempschedule;
                                                console.log(cour);
                                                sql = 'update scheduled set course = "' + cour + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log("scheduled table successfuly updated ");
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                            if (tempo == null || tempo == undefined) {
                                                console.log(tempschedule, "666666666666");
                                                sql = 'update scheduled set course = "' + tempschedule + '" where period = "' + tablename + '" ';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log('new course successfuly scheduled');
                                                        con.end();
                                                        tempo = null;
                                                        callback(null);
                                                    }
                                                });
                                            }
                                        }

                                    });
                                }

                            });
                        }
                    }

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
            con.end();
            callback(err);
        } else {
            console.log("undo function was successfuly connected");
            console.log(changes);
            var tempo;
            tempo = null;
            var sql;
            var index;
            var name;
            var temp;
            if (changes === null || changes === {}) {
                console.log("nothing was initialy done!");
            } else {
                temp = changes.getinitialclassname();
                temp1 = changes.getinitialspace();
                index = changes.giveindex();
                name = changes.getinitialcoursename();
                var temp2;
                temp2 = changes.getinitialregistered();
                var tempschedule = name + '-' + temp;
                console.log(index, "+++++++++++++++++++++");

                sql = 'select number from courses where name = "' + name + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        con.end();
                        callback(err);
                    } else {
                        console.log('selection ok!');
                        for (var key in result) {
                            var value = result[key];
                            for (var key2 in value) {
                                tempo = value[key2];
                            }
                        }
                        if (tempo == null || tempo == undefined) {
                            sql = 'INSERT into courses set name = "' + name + '",number ="' + temp2 + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log("courses table was successfuly updated");
                                    sql = 'select course from scheduled where period = "' + index + '"';
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
                                            if (tempo.length == tempschedule.length) {
                                                sql = 'update scheduled set course = null where period = "' + index + '"';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);

                                                    } else {
                                                        console.log("scheduled table successfuly reverted");
                                                        con.end();
                                                        callback(null);
                                                        tempo = null;
                                                    }

                                                });
                                            }
                                            if (tempo.length != tempschedule.length) {
                                                var tempname = '<br/>' + tempschedule;
                                                tempo = tempo.replace(tempname, '');
                                                sql = 'update scheduled set course = "' + tempo + '" where period = "' + index + '"';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log("scheduled table successfuly updated");
                                                        con.end();
                                                        callback(null);
                                                        tempo = null;
                                                    }
                                                });
                                            }
                                        }

                                    });
                                }

                            });
                        }
                        if (tempo != null || tempo != undefined) {
                            sql = 'update courses set number = ' + temp2 + ' where name = "' + name + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err);
                                } else {
                                    console.log("courses table was successfuly updated");
                                    tempo = null;
                                    temp = changes.getinitialclassname();
                                    temp2 = changes.getinitialspace();
                                    index = changes.giveindex();
                                    sql = 'select course from scheduled where period = "' + index + '"';
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
                                            if (tempo.length == tempschedule.length) {
                                                sql = 'update scheduled set course = null where period = "' + index + '"';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log("scheduled table successfuly reverted");
                                                        con.end();
                                                        callback(null);
                                                    }

                                                });
                                            }
                                            if (tempo.length != tempschedule.length) {
                                                name = '<br/>' + tempschedule;
                                                tempo = tempo.replace(name, '');
                                                sql = 'update scheduled set course = "' + tempo + '" where period = "' + index + '"';
                                                con.query(sql, function (err, result) {
                                                    if (err) {
                                                        con.end();
                                                        callback(err);
                                                    } else {
                                                        console.log("scheduled table successfuly updated");
                                                        con.end();
                                                        callback(null);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }

                });
            }
        }
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
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            i = 0;
            temp = [];
            temp1 = [];
            temp2 = [];

            sql = 'select period from scheduled ';
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
                    sql = 'select course from scheduled ';
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

                            for (i = 0; i < temp.length; i++) {
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

};

module.exports.submitfaculty = function submitfaculty(password, user, host, facname, origine, callback) {
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
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            for (var key in origine) {
                var valueglo = origine[key];
                sql = 'select course from ' + faname + 'scheduled where period = "' + key + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        con.end();
                        callback(err);
                    } else {
                        for (var key1 in result) {
                            var value = result[key1];
                            for (var key2 in value) {
                                tempo = value[key2];
                            }
                        }
                        if (tempo == null || tempo == undefined) {
                            sql = 'INSERT into ' + faname + 'scheduled set course = "' + valueglo + '" , period = "' + key + '" ';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                }
                            });
                        }
                        if (tempo != null || tempo != undefined) {
                            tempo += '<br/>' + valueglo;
                            sql = 'update ' + faname + 'sheduled set course = "' + tempo + '" where period = "' + key + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                }

                            });
                        }
                    }

                });
            }
        }

    });
};

module.exports.getfacscheduled = function getfacscheduled(facname, dbpassword, ipaddress, uname, callback) {
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
            //   console.log('connected');
            i = 0;
            temp = [];
            temp1 = [];
            temp2 = [];

            sql = 'select period from ' + facname + 'scheduled ';
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
                    sql = 'select course from ' + facname + 'scheduled ';
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
                            //   console.log(temp.length);

                            for (i = 0; i < temp.length - 1; ++i) {
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
};

module.exports.submitunivers = function submitunivers(origine, ipaddress, uname, dbpassword, callback) {
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
            con.end();
            callback(err, null);
        } else {
            console.log('connected');
            for (var key in origine) {
                var valueglo = origine[key];
                sql = 'select course from scheduled where period = "' + key + '"';
                con.query(sql, function (err, result) {
                    if (err) {
                        con.end();
                        callback(err);
                    } else {
                        for (var key1 in result) {
                            var value = result[key1];
                            for (var key2 in value) {
                                tempo = value[key2];
                            }
                        }
                        if (tempo == null || tempo == undefined) {
                            sql = 'update scheduled set course = "' + valueglo + '" where  period = "' + key + '" ';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                }
                            });
                        }
                        if (tempo != null || tempo != undefined) {
                            tempo += '<br/>' + valueglo;
                            sql = 'update sheduled set course = "' + tempo + '" where period = "' + key + '"';
                            con.query(sql, function (err, result) {
                                if (err) {
                                    con.end();
                                    callback(err, null);
                                }

                            });
                        }
                    }
                });
            }
        }

    });
};

module.exports.class_value = function class_value(classes, classs, callback) {
    for (var key in classes) {
        var value = classes[key];
        if (key == classs) {
            callback(value);
        }
    }
};
module.exports.getscheduledperiod = function getscheduledperiod(period,
    facname, ipaddress, uname, dbpassword, callback) {
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
            con.end();
            callback(err, null);
        } else {
            var sql = 'select course from `' + facname + 'scheduled` where `period` = "' + period + '"';
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

var getperiods = function getperiods(password, uname, ipaddress) {
    return new Promise(function (resolve, reject) {
        var day = ['Monday', 'Tuseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var periods = ['08:00-11:00', '11:30-14:30', '15:00-18:00'];
        var index = [];
        var period = [];
        var numweeks = [];
        autofunc.getnoWeeks(password, ipaddress, uname).
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
};

function checkperiod(scheduled, period) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        asyncloop(scheduled, function (schedu, next) {
            if (schedu[0] === period) {
                resolve(i);
            }
            i++;
            next();
        });
    });
}
module.exports.getperiods = getperiods;
var collectfacCourses = function collectfacCourses(ipaddress, password, uname) {
    return new Promise(function (resolve, reject) {
        var createfunc = require('./createfunc');
        var i = 0;
        var autofunc = require('./autofunc');
        autofunc.getfacs(ipaddress, uname, password).
        then(function (facs) {
            if (!facs[0]) {
                resolve([]);
            } else {
                var collection = [];
                var asyncloop = require('node-async-loop');
                asyncloop(facs, function (facname, next) {
                    autofunc.faccurrent_courses(facname, ipaddress, uname, password).
                    then(function (result) {
                        if (result === 'No course') result = [];
                        collection.push([facname, result]);
                        if (i === facs.length - 1) {
                            resolve(collection);
                        }
                        i++;
                        next();
                    });
                });
            }
        });
    });
};

module.exports.collectfacCourses = collectfacCourses;

var collectfacschedule = function collectfacscheduled(ipaddress, password, uname) {
    return new Promise(function (resolve, reject) {
        var temp = [];
        var i = 0;
        var j = 0;
        getperiods(password, uname, ipaddress).then(function (periods) {
            asyncloop(periods, function (period, next) {
                temp[i] = [period, ''];
                i++;
                if (i === periods.length - 1) {
                    autofunc.getfacs(ipaddress, uname, password).
                    then(function (facs) {
                        if (facs[0] === undefined) {
                            resolve([]);
                        } else {
                            asyncloop(facs, function (fac, next) {
                                autofunc.getfacscheduled(fac, ipaddress, uname, password).
                                then(function (scheduled) {
                                    var i = 0;
                                    asyncloop(scheduled,
                                        function (schedu, next) {
                                            var tempschedu = (schedu[1] === '') ? '' : schedu[1] + '<br>';
                                            checkperiod(temp, schedu[0]).
                                            then(function (index) {
                                                    temp[index][1] += tempschedu;
                                                    console.log(j,"\t\t",facs.length-1);
                                                    if ((i === scheduled.length - 1)) {
                                                        console.log(temp);
                                                        resolve(temp);
                                                    }
                                                    i++;
                                                    next();
                                            });
                                        });     
                                });
                                next();
                            });
                        }
                    });
                }
                next();
            });
        });
    });
};
module.exports.collectfacschedule = collectfacschedule;