/**
 * Created by mathias on 06/12/16.
 */

/**
 * Created by mathias on 06/12/16.
 */
// var cluster = require('cluster');
// if (cluster.isMaster) {
// // Count the machine's CPUs
//     var cpuCount = require('os').cpus().length;
//     cpuCount = Math.max(cpuCount,2);
//     // Create a worker for each CPU
//     for (var i = 0; i < cpuCount; i += 1) {
//         cluster.fork();
//     }
//
// }else{
    var Server = require('./server');
    var a = new Server();
    a.initialize();
    a.start();
// }
// cluster.on('exit', function (worker) {
//
//     // Replace the dead worker,
//     // we're not sentimental
//     console.log('Worker %d died :(', worker.id);
//     cluster.fork();
//
// });
//
