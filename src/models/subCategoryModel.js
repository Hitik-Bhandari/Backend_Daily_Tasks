import { Schema, model } from "mongoose";

const subCategorySchema = new Schema (
    {
        subCategory: {
            type: String,
            required: true,
        },
        category_id: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }   
    }, {timestamps: true}
)

export const SubCategory = model("SubCategory", subCategorySchema);