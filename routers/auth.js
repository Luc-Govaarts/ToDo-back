const bcrypt = require('bcrypt')
const { Router } = require('express')
const { toJWT } = require('../auth/jwt')
const authMiddleware = require('../auth/middleware')
const User = require('../models/').user
const { SALT_ROUNDS, VERIFICATION_CODE } = require('../config/constants')
const router = new Router()
const mail = require('../nodemailer/mail')

router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res
				.status(400)
				.send({ message: 'Please provide both email and password' })
		}

		const user = await User.findOne({ where: { email } })

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(400).send({
				message: 'User with that email not found or password incorrect',
			})
		}

		// don't send back the password hash or verification code hash
		delete user.dataValues['password']
		delete user.dataValues['verificationCode']

		const token = toJWT({ userId: user.id })
		return res.status(200).send({ token, ...user.dataValues })
	} catch (error) {
		console.log(error)
		return res.status(400).send({ message: 'Something went wrong, sorry' })
	}
})

router.post('/signup', async (req, res) => {
	const { email, password, name, code } = req.body

	if (!code) {
		return res.status(400).send({ message: 'Ask owner for verification code' })
	} else if (!email || !password || !name) {
		return res
			.status(400)
			.send({ message: 'Please provide an email, password, a name' })
	} else if (VERIFICATION_CODE !== code) {
		return res.status(400).send({ message: 'invalid verification key' })
	}

	// genrating a random 6 digit integer between 100.000 and 999.999

	const verificationCode = Math.floor(
		100000 + Math.random() * 900000
	).toString()

	try {
		const newUser = await User.create({
			email,
			password: bcrypt.hashSync(password, SALT_ROUNDS),
			name,
			verificationCode: bcrypt.hashSync(verificationCode, SALT_ROUNDS),
		})

		// don't send back the password hash or verification code hash
		delete newUser.dataValues['password']
		delete newUser.dataValues['verificationCode']

		const token = toJWT({ userId: newUser.id })

		mail.signupVerification(email, name, verificationCode)

		res.status(201).json({ token, ...newUser.dataValues })
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res
				.status(400)
				.send({ message: 'There is an existing account with this email' })
		}
		console.log(error)
		return res.status(400).send({ message: 'Something went wrong, sorry' })
	}
})

router.patch('/verify', async (req, res) => {
	const { code, id } = req.body

	if (!code) {
		return res
			.status(400)
			.send({ message: 'Please provide valid verification code' })
	}

	try {
		const user = await User.findByPk(id)

		if (!bcrypt.compareSync(code.toString(), user.verificationCode)) {
			return res
				.status(400)
				.send({ message: 'Please provide valid verification code' })
		} else {
			await user.update({ verified: true })
			return res.status(200).send({ ...user.dataValues })
		}
	} catch (error) {
		console.log(error)
		return res.status(400).send({ message: 'Something went wrong, sorry' })
	}
})

router.patch('/sendNewCode', async (req, res) => {
	const { id, retriesLeft } = req.body

	try {
		// to do:
		//	[X]	check if user has reties left
		// 	[X] update verification code
		//	[X] update number of retries
		//	[X]	send new email with code
		//	[X]	delete sensitive data and return new user data

		const user = await User.findByPk(id)

		if (user.retriesLeft > 0) {
			const verificationCode = Math.floor(
				100000 + Math.random() * 900000
			).toString()

			await user.update({
				verificationCode: bcrypt.hashSync(verificationCode, SALT_ROUNDS),
				retriesLeft: retriesLeft,
			})

			mail.signupVerification(user.email, user.name, verificationCode)

			delete user.dataValues['password']
			delete user.dataValues['verificationCode']

			return res.status(200).send({
				message: 'A new verification code was send to your inbox',
				user: user.dataValues,
			})
		} else {
			return res.status(400).send({
				message: 'No retries left, account will be deleted in 24 hours',
			})
		}
	} catch (error) {
		console.log(error)
		return res.status(400).send({ message: 'Something went wrong, sorry' })
	}
})

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get('/me', authMiddleware, async (req, res) => {
	// don't send back the password hash
	delete req.user.dataValues['password']
	delete req.user.dataValues['verificationCode']
	res.status(200).send({ ...req.user.dataValues })
})

module.exports = router
