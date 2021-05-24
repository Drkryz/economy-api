const router = require('express').Router();

// import
const test = require('./test/test');
const user = require('./user/user');
const privateUser = require('./secure/secureRoutes/user');

// usages
// localhost:3001/api/test
router.use('/test', test);
// localhost:3001/api/users
router.use('/users', user);

// use secret generator to access this route...
// localhost:3001/api/private/users
router.use('/private/users', privateUser);

// export
module.exports = router;