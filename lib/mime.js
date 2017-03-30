const
  Path = require('path')
;

module.exports = (filename) => {
  const ext = Path.extname(filename).slice(1);

  switch (ext) {
    case 'html':
      return 'text/html';

    case 'png':
      return `image/${ext}`;

    case 'svg':
      return 'image/svg+xml';

    default:
      return 'text/plain';
  }
};
