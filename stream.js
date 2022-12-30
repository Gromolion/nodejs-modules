let fs = require('fs');

let fsStream = fs.createReadStream('stream/file_for_read');
let fsData;
const fsInterval = setInterval(function() {
    fsData = fsStream.read(2)
    if (!fsData) {
        clearInterval(fsInterval);
        console.log('\nВведите строку в консоль: ');
        return;
    }
    process.stdout.write(fsData.toString());
}, 1000);

process.stdin.on('readable', () => {
    let stdinData = '';
    let _data;
    let fsStream = fs.createWriteStream('stream/file_for_write', {flags: 'a'});
    let stdinInterval = setInterval(function() {
        _data = process.stdin.read(4);
        if (!_data) {
            clearInterval(stdinInterval);
            return;
        }

        stdinData += _data;
        if (Buffer.byteLength(stdinData, 'utf8') === 8) {
            fsStream.write(stdinData);
            stdinData = '';
        }
    }, 1000);
});