const
  Http = require('http'),
  Url = require('url'),
  Path = require('path'),
  Fs = require('fs'),
  mime = require('./mime')
  ;

module.exports = ({ hostname = '127.0.0.1', port = 3000, root } = {}) => {
  root = Path.resolve(root || '');

  const server = Http.createServer((req, res) => {
    const { url } = req;
    const { pathname } = Url.parse(url);

    let filename = Path.join(root, pathname);

    function notFound() {
      res.statusCode = 404;
      res.end();
      console.log('Not Found:', pathname);
    }

    function error(err) {
      res.statusCode = 500;
      res.end();
      console.log('Error:', err);
    }

    Fs.stat(filename, (err, stat) => {
      if (err) return notFound();

      if (stat.isDirectory()) {
        filename = Path.join(filename, 'index.html');

      } else if (!stat.isFile()) {
        return notFound();
      }

      Fs.access(filename, Fs.constants.R_OK, (err) => {
        if (err) return notFound();

        res.setHeader('Content-Type', mime(filename));

        const readStream = Fs.createReadStream(filename);

        readStream.pipe(res);
        readStream.on('error', error);

        readStream.on('end', () => {
          console.log('OK:', pathname);
        })

      });
    });
  });

  server.listen(port, hostname, () => {
    console.log(`Running at http://${hostname}:${port}`);
  });

  server.on('error', (error) => {
    console.log('Error:', error);
  });

};