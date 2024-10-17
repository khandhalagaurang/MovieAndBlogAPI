const sendOtp = require("../config/email_config");
const User = require("../model/user");
const bcrypt = require('bcrypt');

const otpStore = {};

const register = async (req, res) => {
    let { username, email, password, otp } = req.body;

    if (!otpStore.email) {
        return res.status(400).json({ msg: "OTP not sent or expired" });
    }

    if (otpStore.email.otp !== otp || (Date.now() - otpStore.email.time >= 60000)) {
        return res.send("email verification fail");
    };
    delete otpStore.email;

    let findUser = await User.findOne({ email });
    if (findUser) {
        return res.status(409).json({
            msg: "user alredy exist"
        })
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ user });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }

};

const login = async (req, res) => {
    let { username, email, password } = req.body;
    let findUser = await User.findOne({ email });
    if (!findUser) {
        return res.send("envalid user email")
    }
    let id = findUser._id;
    if (findUser && findUser.username === username) {
        if (bcrypt.compareSync(password, findUser.password)) {
            req.session.user = {
                id
            }
            res.status(200).json({
                msg: "User Login Successfully"
            })
        } else {
            res.json({
                msg: "password is Incorrect"
            })
        }
    } else {
        res.status(409).json({
            msg: "User not exist Please valide ditailes"
        })
    }
};

const logout = (req, res) => {
    req.session.destroy(function (err) {
        console.log("session destroy");
    })
    res.json({
        msg: "user logout Successfully"
    })
};

const otpVerifyEmail = async (req, res) => {
    let { email } = req.body;
    let to = email;
    let subject = "OTP from siddharth jadav";
    let otp = Math.floor(1000 + Math.random() * 9000);

    otpStore.email = {
        otp: otp,
        time: Date.now()
    }
    console.log(otpStore);

    let html = `<p>This is your otp , it will expire in 2 minites</P>
    <h1>OTP : ${otp}</h1>
    <p>Thank you and best regards</p>
    `
    sendOtp(to, subject, html);
    res.send(`email send = ${otpStore.email.otp}`)
}

module.exports = { register, login, logout, otpVerifyEmail };
