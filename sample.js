var fs = require('fs');

fs.readFile('CLASSES.json', function (err, data) {
    var tempdata = JSON.parse(data);
    tempdata.sans = [47, 0];
    fs.writeFile('CLASSES.json', JSON.stringify(tempdata, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
    });
});

const createfunc = require('./createfunc');

function undoglobal(ipaddress, dbpassword, uname, globaldid) {
    return new Promise(function (resolve, reject) {
        const fs = require('fs');
        fs.readFile('CLASSES.json', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var originalClasses = JSON.parse(data);
                fs.readFile('scheduled.json', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var globaldid = JSON.parse(data);
                        console.log(originalClasses);
                        const asyncloop = require('node-async-loop');
                        var j = 0;
                        asyncloop(globaldid, function (item, next) {
                            var classes = item.value.classes;
                            var i = 0;
                            asyncloop(classes, function (classs, next2) {
                                var capacities = originalClasses[classs];
                                console.log(classs, capacities, item.value.period, '************');
                                createfunc.addhall(item.value.period, ipaddress, uname, dbpassword, classs, capacities,
                                    function (err) {
                                        if (i === classes.length - 1) {
                                            createfunc.addfaccourse(item.value.facname[0], ipaddress, uname, dbpassword, item.value.course,
                                                item.value.course_values,
                                                function (errr) {
                                                    console.log('cool!');
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        if (j === Object.keys(globaldid).length - 1) {
                                                            globaldid = {}
                                                            fs.writeFile('scheduled.json', JSON.stringify(globaldid, null, 4),
                                                                function (err) {
                                                                    console.log(err);
                                                                    resolve();
                                                                });
                                                        }
                                                        j++;
                                                        next();
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

}



fs.readFile('scheduled.json', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var globaldid = JSON.parse(data);
        undoglobal('localhost', 'santers1997', 'santers', globaldid).
        then(function () {
            console.log('good!!!');
        });
    }
});