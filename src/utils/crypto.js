const crypto = require('crypto');

const languages = ['hi', 'kn', 'ma', 'ml', 'ta', 'te', 'pa'];

const hashs = languages.map((lang) => {
  const hash = crypto.createHash('md5').update(lang)
    .digest('hex');
  return ({
    [`${hash}`]: 0,
  });
});

// eslint-disable-next-line no-console
console.log(hashs);
