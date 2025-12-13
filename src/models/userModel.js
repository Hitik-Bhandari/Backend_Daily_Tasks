import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        }, 
        password: {
            type: String,
            required: true,
            select: false,
            minLength: 8,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
            trim: true
        }
    }, {timestamps: true}
)

userSchema.pre("save", async function (next) {
    if( !this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password, 10)
    next;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



export const User = model("User", userSchema);