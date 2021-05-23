const router = require('express').Router();

// import
const test = require('./test/test');
const user = require('./user/user');

// usages

// localhost:3001/api/test
router.use('/test', test);
// localhost:3001/api/user
router.use('/users', user);

// export
module.exports = router;