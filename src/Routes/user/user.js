// ========= IMPORTANT =========== \\
/**
 * create a temporary route with a session id so that the API can be accessed only via code,
 * this prevents users from accessing another account.
 * Then, seven a timer to delete the session and make it invalid.
 *
 * Also avoiding explorer users who tried to make requests in the API,
 * unless you have an ip address and allow them only to make requests in the API with cors.
 *
 *
 * You can also make an authorization method with your bot's token or your ID,
 *  I recommend your bot's token more, because only you have access to it,
 *  if you are hosting on the replit use the .env
 * 
 * .env example for replit: const botToken = process.env['VARIABLE_NAME']; 
 * 
 * 
 * REQUESTS: usage node-fetch or axios
 */
// ========= IMPORTANT ============= \\


const router = require('express').Router();
const UserModel = require('../../modules/models/User');


// localhost:3001/api/user
router.get('/', (req, res) => {
	res.send(200);
});


// send UserInfo localhost:3001/api/user/id
router.get('/:userId', async(req, res) => {
	const userData = await UserModel.findOne({
		member: req.params.userId
	});
	// if user data != null
	if (userData != null) {
		// validate user
		if (req.params.userId != userData.member) {
			// send if user != request userId
			res.status(401).send({
				msg: "Unauthorized",
				reason: "Invalid user id "
			});
			// valid userId
		} else {
			res.status(200).send({
				user: userData
			}); // end status
		} // end else
	} else {
		const createUser = await UserModel.create({ member: req.params.userId });
		createUser.save();

		res.status(404).send({
			msg: "Not Found",
			reason: "Could not find user or is null"
		}); // end status
	} // end else
}) // end get


// Update user money localhost:3001/api/user/id/daily
router.put('/:userId/daily', async(req, res) => {
	// find userId
	const {
		userId
	} = req.params;
	// request body
	const {
		coins
	} = req.body;
	// userData mongodb
	const userData = await UserModel.findOne({
		member: userId
	});
	// validate
	if (coins && userId && userData != null) {
		const updateUser = await UserModel.findOneAndUpdate({
			member: userId
		}, {
			// update coins
			$inc: {
				coins
			}
		}, {
			// options
			new: true,
			upsert: true
		}).catch(e => {
			// error to insert
			res.status(404).send({
				msg: "Not Found",
				reason: e
			});
		});
		// send user updated or localhost:3001/api/user/id
		res.status(201).send({
			msg: "Created",
			user: updateUser
		});
	} else {
		// if user == null, create a new user
		const userData = await UserModel.create({
				member: userId,
			})
			// save new user document
		userData.save();
		// send status if not find user
		res.status(404).send({
			msg: "Not Found ",
			reason: "User or coin is null",
			newUser: userData
		});
	}; // finish
});


// update user bank localhost:3001/api/user/id/bank
router.put('/:userId/bank', async(req, res) => {
	// find userId
	const {
		userId
	} = req.params;
	// request body
	const {
		bank
	} = req.body;
	// find userData
	const userData = await UserModel.findOne({
		member: userId
	});
	// validate
	if (bank && userId && userData != null) {
		// find And update userData
		const updateUser = await UserModel.findOneAndUpdate({
			member: userId
		}, {
			// find Bank value
			$inc: {
				bank
			}
		}, {
			// options
			new: true,
			upsert: true,
		});
		// confirm 
		res.status(201).send({
			msg: "Created",
			user: updateUser
		});
	} else {
		// if user == null, create a new user
		const userData = await UserModel.create({
				member: userId,
			})
			// save new user document
		userData.save();
		// send status if not find user
		res.status(404).send({
			msg: "Not Found ",
			reason: "User or coin is null",
			newUser: userData
		});
	};
});


// update user bank localhost:3001/api/user/id/deposit
router.put('/:userId/deposit', async(req, res) => {
	const {
		userId
	} = req.params;
	const {
		coins
	} = req.body;
	const userData = await UserModel.findOne({
		member: userId
	});
	if (coins && userData != null) {
		if (userData.coins < coins) {
			return res.status(404).send({
				msg: "Not Found ",
				reason: "User coins is < coins"
			});
		} else {
			// find and Update user
			const updateUserBank = await UserModel.findOneAndUpdate({
				member: userId
			}, {
				$inc: {
					bank: coins,
					coins: -coins
				}
			}, {
				// options
				new: true,
				upsert: true
			});
			// confirm
			res.status(201).send({
				msg: "Created",
				user: updateUserBank
			});
		}
	} else {
		res.status(404).send({
			msg: "Not Found",
			reason: "User credentials is null"
		});
	}
});


// update user coins localhost:3001/api/user/id/pull
router.put('/:userId/pull', async(req, res) => {
	const {
		userId
	} = req.params;
	const {
		bank
	} = req.body;
	const userData = await UserModel.findOne({
		member: userId
	});
	// validate
	if (userId && bank && userData !== null) {
		// validate user coins in bank
		if (userData.bank < bank) {
			res.status(404).send({
				msg: "Not Found",
				reason: "user bank < coins "
			});
		} else {
			// update user coins
			const updateUserCoins = await UserModel.findOneAndUpdate({
				member: userId
			}, {
				$inc: {
					coins: bank,
					bank: -bank
				}
			});
			// confirm
			res.status(201).send({
				msg: "Created",
				user: updateUserCoins
			});
		}
	} else {
		// error on find user credentials
		res.status(404).send({
			msg: "Not Found",
			reason: "User credentials is null"
		});
	}
});

// pay method localhost:3001/:userId/:userToPayiD/pay
router.put('/:userId/:memberId/pay', async(req, res) => {
    // find user and memberId
	const {
		userId, memberId
	} = req.params;

    // find coins request body
	const {
		coins
	} = req.body;
    // find user credentials
	const userData = await UserModel.findOne({
		member: userId
	});
    // find member credentials
	const memberData = await UserModel.findOne({
		member: memberId
	});
	// validate user and member
	if (userId && memberId && userData && memberData != null) {
		// validate coins
		if (userData.coins < coins) {
			return res.status(404).send({
				msg: "Not Found",
				reason: "User coins < coins "
			});
		}

		if (memberId === userData.member) {
			return res.status(404).send({
				msg: "Not Found",
				reason: "you can't pay yourself"
			})
		}
		
		// update user coins
		const updateUser = await UserModel.findOneAndUpdate({
			member: userId
		}, {
			$inc: {
				coins: -coins
			}
		}, {
			new: true,
			upsert: true
		});
		// update member coins
		const updateMember = await UserModel.findOneAndUpdate({
			member: memberId
		}, {
			$inc: {
				coins: coins
			}
		}, {
			new: true,
			upsert: true
		});
		// confirm
		res.status(201).send({
			msg: "Created",
			user: updateUser,
			member: updateMember
		});
	} else {
		// if user credentials == null
		const createMember = await UserModel.create({ member: memberId });
		createMember.save();
		res.status(404).send({
			msg: "Not Found",
			reason: "User credentials is null",
			newUser: createMember
		});
	};
});


module.exports = router;