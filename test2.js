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
console.log(ipaddress);