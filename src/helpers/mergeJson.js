const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = (filePaths) => {
  return filePaths.reduce((merged, filePath) => {
    const absolutePath = path.resolve(__dirname, filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    Object.entries(jsonData).forEach(([key, value]) => {
      if (_.isPlainObject(value)) {
        // eslint-disable-next-line no-param-reassign
        merged[key] = _.merge(merged[key], value);
      } else if (_.isArray(value)) {
        // eslint-disable-next-line no-param-reassign
        merged[key] = _.compact(_.concat(merged[key], value));
      } else {
        // eslint-disable-next-line no-param-reassign
        merged[key] = value;
      }
    });
    return merged;
  }, {});
};
