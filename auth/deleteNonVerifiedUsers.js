const User = require('../models').user
const moment = require('moment')

async function deleteNonVerifiedUsers(req, res, next) {
	// To Do:
	// checking all non verified users user
	// with no retries left and deleting after 24 hours
	//
	// [X] Checking all users where verified === false && retriesLeft === 0
	// [X] Checking if 24H have past yet
	// [X] If both conditions have been met -> delete account

    const limitInHours = 24

	function deadlinePast(lastRetryUsed, limitInHours) {
		const deadline = moment(lastRetryUsed).add(limitInHours, 'hours')
		return moment() - moment(deadline)
	}

	try {
		const potentialDeletes = await User.findAll({
			where: { verified: false, retriesLeft: 0 },
		})

		potentialDeletes.map(async (potentialDelete) => {
			if (deadlinePast(potentialDelete.lastRetryUsed, limitInHours) > 0) {
				await potentialDelete.destroy({where: {id: potentialDelete.id}})
			}
		})

		return next()
	} catch (error) {}
}

module.exports = deleteNonVerifiedUsers
