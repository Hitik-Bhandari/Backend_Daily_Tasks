import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/categoryControllers.js";
import { createSubCategory, deleteSubCategory, getSubCategory, updateSubCategory } from "../controllers/subcategoryControllers.js";
import { roleBasedAuth } from "../middleware/roleBasedAccessMiddleware.js";

const adminRouter = Router();

//Category routes for admin
adminRouter.post("/createCategory", authMiddleware, roleBasedAuth(['admin']), createCategory);
adminRouter.get("/getCategory", authMiddleware, roleBasedAuth(['admin']), getCategory);
adminRouter.put("/updateCategory/:id", authMiddleware, roleBasedAuth(['admin']), updateCategory);
adminRouter.delete("/deleteCategory/:id", authMiddleware, roleBasedAuth(['admin']), deleteCategory)

//SubCategory routes for admin
adminRouter.post("/createSubCategory/:id", authMiddleware, roleBasedAuth(['admin']), createSubCategory);
adminRouter.get("/getSubCategory", authMiddleware, roleBasedAuth(['admin']), getSubCategory);
adminRouter.put("/updateSubCategory/:id", authMiddleware, roleBasedAuth(['admin']), updateSubCategory);
adminRouter.delete("/deleteSubCategory/:id", authMiddleware, roleBasedAuth(['admin']), deleteSubCategory);

export default adminRouter