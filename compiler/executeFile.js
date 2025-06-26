const { exec ,spawn} = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4 } = require('uuid');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeFile = (filepath,input) => {
    const jobID = path.basename(filepath).split(".")[0];
    const filename = `${jobID}.exe`;
    const outPath = path.join(outputPath, filename);
    
    return new Promise((resolve, reject) => {
        const compile = spawn('g++', [filepath, '-o', outPath]);

        compile.stderr.on('data', (data) => {
            reject({ status: 'compilation error', message: data.toString() });
        });

        compile.on('exit', (code) => {
            if (code !== 0) {
                return reject({ status: 'compilation error', message: 'Compilation failed' });
            }

            const run = spawn(outPath);

            let output = '';
            let errors = '';

            run.stdin.write(input);
            run.stdin.end();

            run.stdout.on('data', (data) => {
                output += data.toString();
            });

            run.stderr.on('data', (data) => {
                errors += data.toString();
            });

            run.on('close', (code) => {
                if (code !== 0) {
                    return reject({ status: 'runtime error', message: errors });
                }
                resolve({ status: 'success', output });
            });
        });
        // exec(
        //     `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ${filename}`,
        //     (error, stdout, stderr) => {
        //         if (error) {
        //             reject({ error, stderr });
        //         }
        //         if (stderr) {
        //             reject(stderr);
        //         }
        //         resolve(stdout);
        //     }
        // );
    });
}; 

module.exports = {
    executeFile,
};
