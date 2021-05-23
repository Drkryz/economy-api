const router = require('express').Router();

// get /test
router.get('/', ( req, res ) => {
    res.send("<h1>Hello world!, it is a test</h1>");
});

module.exports = router;