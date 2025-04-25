const express = require('express');
const swaggerUi = require('swagger-ui-express');
const mergeJson = require('../../helpers/mergeJson');

const swaggerDocument = mergeJson(['../docs/swagger.json', '../docs/user.swagger.json']);

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
);

module.exports = router;
