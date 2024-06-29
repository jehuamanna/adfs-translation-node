/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');
const crypto = require('crypto');

const getAlltranslation = async (req, res) => {
  try {
    const translationsPath = path.join(__dirname, '../../../translations');
    const files = await fs.readdir(translationsPath);

    const jsonFiles = files.filter((file) => path.extname(file) === '.json');

    const readAndLogJsonFile = async (filePath) => {
      const data = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      return { [path.basename(filePath, '.json')]: jsonData };
    };

    const promises = jsonFiles.map((file) => {
      const filePath = path.join(translationsPath, file);
      return readAndLogJsonFile(filePath);
    });

    const results = await Promise.all(promises);
    const finalOutput = results.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {},
    );
    res.send(finalOutput);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
};

const updateTranslation = async (req, res) => {
  try {
    const translationsPath = path.join(__dirname, '../../../translations');

    for (const lang of Object.keys(req.body)) {
      const filePath = path.join(translationsPath, `${lang}.json`);
      const updatedData = req.body[lang];
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedData, null, 2),
        'utf-8',
      );
    }

    res.status(201).send('Translations updated successfully.');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
};

const getLanguageVersion = async (req, res) => {
  try {
    const lang = req.params.lang;
    const translationsPath = path.join(__dirname, '../../../translations');
    const filePath = path.join(translationsPath, `${lang}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const hash = crypto.createHash('md5').update(lang)
      .digest('hex');
    console.log('hash ==>', hash);
    if (jsonData.hasOwnProperty(hash)) {
      res.send({ version: jsonData[hash] });
    } else {
      res.send({ [lang]: jsonData, hash });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
};

const getLanguageData = async (req, res) => {
  try {
    const lang = req.params.lang;
    const translationsPath = path.join(__dirname, '../../../translations');
    const filePath = path.join(translationsPath, `${lang}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    res.send({ [lang]: jsonData });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAlltranslation,
  updateTranslation,
  getLanguageVersion,
  getLanguageData,
};
