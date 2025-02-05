//module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//model 
const UserModel = require("../models/User.js");


const register = async (req, res) => {

    //try and catch block if there is any error on run time
    try {
        //getting data from req.body
        const { nickName, firstName, lastName, state, city, role, email, mobile, password } = req.body;
        console.log(req.body);

        //checking if there is user already exist
        const userExist = await UserModel.findOne({ mobile });

        //if there is user already exist
        if (userExist) {
            return res.status(404)
                .json({
                    message: "User Alread Exist",
                    success: false
                })
        }

        // if user not exist than creating one

        // 1.create user using user model
        const userModel = new UserModel({
            nickName,
            firstName,
            lastName,
            state,
            city,
            role,
            email,
            mobile,
            password
        })

        //2. bcrypting password to store in database

        userModel.password = await bcrypt.hash(password, 10);

        //3. Saving User in database
        await userModel.save();


        //4. sending response of success registretion

        res.status(200)
            .json({
                message: "User Registered SuccessFully",
                success: true
            })
    }
    catch (error) {
        //if try block throw any error
        res.status(500)
            .json({
                message: " Registretion - Internal Server Error",
                success: false,
                error
            })
        console.error(error);

    }
}

const login = async (req, res) => {
    //try and catch block for run time error
    try {
        //extracting data from req.body

        //checking method from req.body
        const { loginWith } = req.body;
        let user;
        let pass;
        const errorMessage = "Email/Mobile or Password invalid"
        //if login method is mobile
        if (loginWith == "Mobile") {
            const { mobile,password} = req.body;
            user = await UserModel.findOne({ mobile });
            pass = password;
        }
        else//if login method is email
        {
            const { email,password } = req.body;
            user = await UserModel.findOne({ email });
            pass = password;
        }
     

        //checking if user exist

        //if user not exist
        if (!user) {
           
            return res.status(403)
                .json({
                    message: "User Not Exist Please Register first",
                    success: false,
                });
        }

        //if user exist

        const isPasswordSame = await bcrypt.compare(pass, user.password);
       
        //if entered password and password in database is not same

        if (!isPasswordSame) {
            return res.status(403)
                .json({
                    message: errorMessage,
                    success: false,
                })
        }

        //generating jwt Token 
        const jwtToken = jwt.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.status(200)
            .json({
                message:"Login Successfull",
                token: jwtToken,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email
            })
    }
    catch (error) {
        //if any error occure
        res.status(500)
            .json({
                message:"Login - Internal Server Error",
                success:false,
                error:error
            })
    }
}

module.exports = {
    register,
    login
}