const
  { execFile } = require('child_process')
;

module.exports = (filename, callback) => {
  execFile('file', ['-b', '--mime-type', filename], (err, stdout) => {
    if (err) return callback(err);

    callback(null, stdout.trim());
  });
};
