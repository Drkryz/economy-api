const router = require('express').Router();
const UserModel = require('../../../modules/models/User');
const keySession = require('../../../modules/models/Key');

// exaple protected route


/**
 * 
 * the code will be optimized later, 
 * this is just an example of a route with one session per request
 */


// protected routes
// localhost:3001/api/private/users/generatedKey/userId
router.get('/:secret/:userId', async (req, res) => {
    const { secret, userId } = req.params;

    if (userId != null) {
        // find 
        const userData = await UserModel.findOne({ member: userId });
        const session = await keySession.findOne({ member: userId });
        // verify
        if (session == null) {
            res.status(404).send({ msg: "Not Found " });
        } else {
            // validate
            if (secret != session.Key) {
                res.status(401).send({ msg: "Unauthorized", reason: "Invalid userId session " });
            } else {
                // success
                res.status(200).send({ msg: "Success", userData, session });
                // delete session
                await keySession.findOneAndDelete({ member: userId });
                // confirm deleted
                console.log("Session deleted");
            }
        }
    } else {
        // create user if not exists
        (await UserModel.create({ member: userId })).save();
        // send invalid user msg
        res.status(401).send({ msg: "Unauthorized", reason: "Invalid userId keySession " });
    }
});

module.exports = router;