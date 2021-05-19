const nodemailer = require('nodemailer')
require('dotenv').config()

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, 
	auth: {
		user: process,env.MAIL_USER,
		pass: process,env.MAIL_PASS, 
	},
})

export async const testmail = () => {
    await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "lucgovaarts@hotmail.com", // list of receivers
        subject: "Hello ✔ test 1234", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        });
}

