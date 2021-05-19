const mail = require('./config')

const testMail = async () => {
    try {
        await mail.transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "lucgovaarts@hotmail.com", // list of receivers
            subject: "Hello ✔ test 1234", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });
    } catch (error) {
        console.log(error)
    }
}

exports.testMail = testMail
