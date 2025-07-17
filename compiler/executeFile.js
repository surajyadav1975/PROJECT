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
            run = spawn('java', [filepath]);
            executeProgram(run, input, resolve, reject);
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

    const TIMEOUT = 5000; // 5 seconds
    const MAX_INPUT_SIZE = 10000; // 10 KB
    const MAX_OUTPUT_SIZE = 50000; // 50 KB

    let killed = false;

    // Input check
    if (input && input.length > MAX_INPUT_SIZE) {
        return reject({ status: 'input error', message: 'Input size exceeds limit (10KB).' });
    }

    // Set timeout to kill long-running processes
    const timeout = setTimeout(() => {
        killed = true;
        run.kill('SIGKILL');
        return reject({ status: 'time limit exceeded', message: 'Execution time exceeded 5 seconds.' });
    }, TIMEOUT);

    // Collect stdout
    run.stdout.on('data', (data) => {
        if (output.length + data.length > MAX_OUTPUT_SIZE) {
            killed = true;
            run.kill('SIGKILL');
            clearTimeout(timeout);
            return reject({ status: 'output limit exceeded', message: 'Output exceeded 50KB.' });
        }
        output += data.toString();
    });

    // Collect stderr
    run.stderr.on('data', (data) => {
        errors += data.toString();
    });

    // Handle exit
    run.on('close', (code) => {
        clearTimeout(timeout);
        if (killed) return; // already handled

        if (code !== 0) {
            return reject({ status: 'runtime error', message: errors || 'Unknown error occurred.' });
        }
        resolve({ status: 'success', output });
    });

    // Handle execution errors (e.g. file not found, permission issues)
    run.on('error', (err) => {
        clearTimeout(timeout);
        return reject({ status: 'execution error', message: err.message });
    });

    // Pass input (if any)
    if (input) {
        run.stdin.write(input);
    }
    run.stdin.end();
};


module.exports = {
    executeFile,
};
