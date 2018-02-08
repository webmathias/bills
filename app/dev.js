const spawn = require('child_process').spawn;
var p1 = spawn('ng', ['build','--watch'], {maxBuffer: 1024 * 500,
    stdio: [
        0, // Use parents stdin for child
        0, // Pipe child's stdout to parent
        0//fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ]
},(error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        if(stderr.indexOf('maxBuffer exceeded')){
            console.error(`Erro de tamanhode de buffer, use:\necho 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches`);
        }

        p2.kill('SIGTERM');
        process.exit();
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
var p2 = spawn('nodemon',['node/index.js'],{maxBuffer: 1024 * 500,
    stdio: [
        0, // Use parents stdin for child
        0, // Pipe child's stdout to parent
        0//fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ]
}, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        p1.kill('SIGTERM');

        process.exit();
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});




p1.on('close', (code) => {
    console.log(`p1 process exited with code ${code}`);
});


p2.on('close', (code) => {
    console.log(`p2 process exited with code ${code}`);
});