const { exec ,spawn} = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeFile = (filepath,input,language) => {
    const jobID = path.basename(filepath).split(".")[0];
    
    return new Promise((resolve, reject) => {
        let compile;
        let run;
        let outPath;

        if (language === 'cpp') {
            const filename = `${jobID}.out`;
            outPath = path.join(outputPath, filename);

            compile = spawn('g++', [filepath, '-o', outPath]);

            compile.stderr.on('data', (data) => {
                reject({ status: 'compilation error', message: data.toString() });
            });

            compile.on('exit', (code) => {
                if (code !== 0) {
                    return reject({ status: 'compilation error', message: 'Compilation failed' });
                }

                run = spawn(outPath);
                executeProgram(run, input, resolve, reject);
            });
        }
        else if (language === 'java') {
            compile = spawn('javac', [filepath]);

            compile.stderr.on('data', (data) => {
                reject({ status: 'compilation error', message: data.toString() });
            });

            compile.on('exit', (code) => {
                if (code !== 0) {
                    return reject({ status: 'compilation error', message: 'Compilation failed' });
                }

                const className = path.basename(filepath).split('.')[0];
                run = spawn('java', ['-cp', path.dirname(filepath), className]);
                executeProgram(run, input, resolve, reject);
            });
        }
        else if (language === 'c') {
            const filename = `${jobID}.out`;
            outPath = path.join(outputPath, filename);

            compile = spawn('gcc', [filepath, '-o', outPath]);

            compile.stderr.on('data', (data) => {
                reject({ status: 'compilation error', message: data.toString() });
            });

            compile.on('exit', (code) => {
                if (code !== 0) {
                    return reject({ status: 'compilation error', message: 'Compilation failed' });
                }

                run = spawn(outPath);
                executeProgram(run, input, resolve, reject);
            });
        }

        else if (language === 'py') {
            run = spawn('python', ['-u', filepath]);
            executeProgram(run, input, resolve, reject);
        }

        else if (language === 'js') {
            run = spawn('node', [filepath]);
            executeProgram(run, input, resolve, reject);
        }

        else {
            return reject({ status: 'error', message: 'Unsupported language' });
        }
    });
}; 

const executeProgram = (run, input, resolve, reject) => {
    let output = '';
    let errors = '';

    if (input) {
        run.stdin.write(input);
    }
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
};

module.exports = {
    executeFile,
};
