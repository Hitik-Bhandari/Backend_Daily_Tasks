import { Router } from "express";
import { changePassword, login, profile, register, updateProfile } from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { changePasswordSchema, createUserSchema, getUserParamSchema } from "../validators/userValidator.js";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/productControllers.js";
import upload from "../middleware/multerMiddleware.js";
import uploadFile from "../controllers/uploadControllers.js";


const router = Router();

//login/signUp
router.post('/register',validate(createUserSchema, "body") ,register);
router.post('/login', login);

//ProfileApi
router.get('/profile', authMiddleware, profile);

//UpdateProfile And ChangePassword
router.put('/updateProfile', authMiddleware, updateProfile);
router.post('/changePassword',authMiddleware, validate(changePasswordSchema),changePassword);

//Product Routes
router.post('/products/createProduct', authMiddleware, createProduct);

router.get('/products/getProduct', authMiddleware, getProduct);

router.put('/products/updateProduct/:id', authMiddleware, validate(getUserParamSchema, "params"), updateProduct);
router.delete('/products/deleteProduct/:id', authMiddleware, validate(getUserParamSchema, "params"), deleteProduct);

router.get('/uploads', authMiddleware, upload.fields([
    {
        name: "file",
        maxCount: 2
    }
]), uploadFile)

export default router