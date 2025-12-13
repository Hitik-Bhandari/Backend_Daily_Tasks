import { User } from "../models/userModel.js";

const register = async (req, res) => {
    try {

        const {username, fullName, email, password, role} = req.body;
        if([username, fullName, email, password].some( (field) => field?.trim() === "")) {
            return res.status(401).json({sucess: false, message: "All are Required Fields"});
        }
        
        const user = await User.findOne({
            $or: [{username, email}]
        })
        // console.log(password);

        if(user) return res.status(400).json({sucess: false, message: "User Already Exists"})

        const createUser = await User.create({username, fullName, email, password, role});

        const checkUser = await User.findById(createUser._id).select("-password").lean();

        
        return res.status(201).json({
            success: true,
            message: "New User Registered SuccessFully",
            data: checkUser
        })
        

        
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        
        const {username, email, password} = req.body;

        if(!(username || email)) {
            return res.status(400).json({success: false, message: "Username or Email is Required"});
        }
        if(! password) {
            return res.status(400).json({success: false, message: "Password is Required"});
        }

        const user = await User.findOne({
            $or: [{username, email}]
        }).select("+password");

        if(!user) return res.status(404).json({success: false, message: "User not Found"});

        const matchPassword = await user.comparePassword(password);
        if(! matchPassword) return res.status(402).json({success: false, message: "Invalid credentials"});

        const accessToken = await user.generateAccessToken();
        const LoggedInUser = await User.findById(user._id).lean();

        return res.status(200).json({
            success: true,
            message: "LoggedIn Successfully",
            accessToken,
            data: LoggedInUser
        })

    } catch (error) {
        console.log(error);
    }
}

const profile = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "User is Authorized to access Profile page",
            data: user
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    } 
}

const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        console.log(user._id)

        const {username, email, fullName} = req.body;
        if(! (username || email || fullName)) {
            return res.status(400).json({success: false, message: "Atleast One field is Required to update"});
        }

        const updateProfile = await User.findByIdAndUpdate(
            user._id,
            {
                $set: ({username, email, fullName})
            },
            { new: true, runValidators: false}
        )

        return res.status(200).json({
            success: true,
            message: "User's Profile Updated Successfully",
            data: updateProfile
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const changePassword = async (req, res) => {
    try {
        
        const user = req.user;
        const {newPassword, oldPassword} = req.body;

        if(!newPassword || !oldPassword) return res.status(400).json({success: false, message: "Both New and Old Password is required to change the password"})

        const newUser = await User.findById(user._id).select("+password");
        // console.log(newUser.password)
        // console.log(newUser.fullName)

        const checkPassword = await newUser.comparePassword(oldPassword);
        if(!checkPassword) return res.status(401).json({success: false, message: "Old Password is Incorrect"});

        newUser.password = await newPassword;
        await newUser.save();

        return res.status(202).json({
            success: true, 
            message: "Password is Changed Successfully",
            data: newUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export {
    register, 
    login,
    profile,
    updateProfile,
    changePassword
}