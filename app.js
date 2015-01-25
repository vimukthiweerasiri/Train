var net = require('net');
var convert=require('./control/stringToJSON');
var HOST = '127.0.0.1';
var PORT = 6969;

net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        logic(data);
        sock.write('You said "' + data + '"');
        
    });
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

var logic=function(data){
    console.log('this is data: '+data);
    var obj=convert.convert('1234567,79.654,3.5667,2010,10,11,4,12,32,32,32.98');
    console.log(obj.imei);
    console.log(obj.latitude);
    console.log(obj.longitude);
}