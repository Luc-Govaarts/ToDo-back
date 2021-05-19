const config = require('./config')

const signupVerification = async (email, name) => {
	const verificationCode = Math.floor(100000 + Math.random() * 900000) // genrating a random 6 digit integer between 100.000 and 999.999
	try {
		await config.transporter.sendMail({
			from: '"Tinus To do App" <tinustodoapp@gmail.com>', // sender address
			to: email, // list of receivers
			subject: 'Verify your email adress', // Subject line
			html: `<div style="  margin: auto; width: 70%; padding: 20px;">
                        <p>Hi ${name}, <br><br>
                            Thank you for signing up fot the Tinus To Do App. <br>
                            You are almost ready to start using the app. <br>
                            Before you can, please verify your email adress. <br>
                            Click the link below and enter the verification code.<br><br></p>
                                  
                        <p style="font-size: 24px;"> VERIFICATION CODE: </p>
                        <p style="color:blue;font-size: 24px;"> ${verificationCode} </p> <br><br>
                                  
                        <p> SET UP LINK TO VERIFICATION PAGE<p>
                </div>`,
		})
	} catch (error) {
		console.log(error)
	}
}

exports.signupVerification = signupVerification
