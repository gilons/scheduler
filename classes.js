var FITS = {
    bestfit: [],
    bestfitspace: [],
    bestclassvalue: [],
    worsefit: [],
    worsefitspace: [],
    worseclassvalue: [],


    takeNewbestfit: function (classname) {
        this.bestfit.push(classname);
    },

    getbestfit: function () {
        return this.bestfit;
    },

    takebestfitspace: function (availabespace, key) {
        this.bestfitspace[key] = availabespace;
    },

    takebestclassvalue: function (availabespace, key) {
        this.bestclassvalue[key] = availabespace;
    },

    takeNewworsefit: function (classname) {
        this.worsefit.push(classname);
    },

    getbestfitspace: function () {
        return this.bestfitspace;
    },

    getbestclassvalue: function () {
        return this.bestclassvalue;
    },

    takeworsefitspace: function (availabespace, key) {
        this.worsefitspace[key] = availabespace;
    },

    takeworseclassvalue: function (availabespace, key) {
        this.worseclassvalue[key] = availabespace;
    },

    getworsefit: function () {
        return this.worsefit;
    },

    getworseclassvalue: function () {
        return this.worseclassvalue;
    },

    getworsefitspace: function () {
        return this.worsefitspace;
    }
};

var INITIALS = {
    initialclassname: null,
    initialspace: null,
    initialcoursename: null,
    initialregistered: null,
    index: null,
    remainingstudent: null,

    takeinitialclassname: function (classname) {
        this.initialclassname = classname;
    },

    getinitialclassname: function () {
        return this.initialclassname;
    },

    takeinitialspace: function (availabespace) {
        this.initialspace = availabespace;
    },

    takeinitialcoursename: function (coursename) {
        this.initialcoursename = coursename;
    },

    getinitialspace: function () {
        return this.initialspace;
    },

    takeinitialregistered: function (number) {
        this.initialregistered = number;
    },

    getinitialcoursename: function () {
        return this.initialcoursename;
    },

    getinitialregistered: function () {
        return this.initialregistered;
    },

    getindex: function (index) {
        this.index = index;
    },

    giveindex: function () {
        return this.index;
    },
    takeremainingstudent: function (value) {
        this.remainingstudent = value;
    },
    getremainingsudent: function () {
        return this.remainingstudent;
    }
};

var CHANGES = {
    classaffected: null,
    period: null,
    courseaffected: null,
    remainingnum: null,

    takeclassaffected: function (classs) {
        this.classaffected = classs;
    },
    takeperiod: function (period) {
        this.period = period;
    },
    takecourseaffected: function (affected) {
        this.courseaffected = affected;
    },
    takeremainingnum: function (num) {
        this.remainingnum = num;
    },

    getclassaffected: function () {
        return (this.classaffected);
    },
    getperiod: function () {
        return (this.period);
    },
    getcourseaffected: function () {
        return (this.courseaffected);
    },
    getremainingnum: function () {
        return (this.remainingnum);
    },

};

module.exports.FITS = FITS;
module.exports.INITIALS = INITIALS;
module.exports.CHANGES = CHANGES;