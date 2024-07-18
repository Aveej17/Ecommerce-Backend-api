import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema;

const ColorSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
    },
    {timestamps: true},
);


const Color = mongoose.model("Colour", ColorSchema);

export default Color;
