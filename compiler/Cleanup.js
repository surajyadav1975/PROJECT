const fs = require('fs');
const path = require('path');

function getOutputFilePath(language, sourcePath) {
    if (language === 'cpp' || language === 'c') {
        return sourcePath.replace('codes', 'outputs').replace(/\.(cpp|c)$/i, '.out');
    } else if (language === 'java') {
        return sourcePath.replace('codes', 'outputs').replace('.java', '.class');
    } else if (language === 'py' || language === 'js') {
        return null; 
    } else {
        throw new Error('❌ Unsupported language.');
    }
}

async function cleanupFiles(language, sourcePath) {
    const deleteDelay = 10000; 
    const outputPath = getOutputFilePath(language, sourcePath);

    setTimeout(async () => {
        try {
            await fs.promises.unlink(sourcePath);
            console.log('✅ Deleted source file:', sourcePath);
        } catch (e) {
            if (e.code !== 'ENOENT' && e.code !== 'ENOTEMPTY') {
                console.error('❌ Error deleting source file or folder:', e);
            }
        }
    }, deleteDelay);

    if (outputPath) {
        setTimeout(async () => {
            try {
                await fs.promises.unlink(outputPath);
                console.log('✅ Deleted output file:', outputPath);
            } catch (e) {
                if (e.code !== 'ENOENT' && e.code !== 'ENOTEMPTY') {
                    console.error('❌ Error deleting output file or folder:', e);
                }
            }
        }, deleteDelay);
    }
}

module.exports = { cleanupFiles };