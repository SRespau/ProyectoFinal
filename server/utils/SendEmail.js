const nodemailer = require("nodemailer");

module.exports.sendEmail = async (req, res, next) => {
    try {
        const { user, password, email } = req.body;
        const transporter = nodemailer.createTransport({
            service: "Outlook365",
            host: "smtp.office365.com",
            auth: {
                user: "sergiocrespo69@outlook.es",
                pass: "1!Bilbilis",
            },
            port: "587",
            tls: {
            ciphers: "SSLv3",
            },
        });

        await transporter.sendMail({
            from: "sergiocrespo69@outlook.es",
            to: email,
            subject: "Recuperación contraseña Adamas",
            text: "Muy buenas " + user + " \n\nLe recordamos la contraseña registrada por usted: " + password + "\n\nAtentamente, el equipo de Adamas",
        });

        return res.json("Email enviado con exito");
    } catch (error) {
        console.log(error, "Email no enviado");
    }
};

