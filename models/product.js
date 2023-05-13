import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        productDesc: { type: String, required: true },
        productPrice: {type: String , required: true}
    }
);


const product = mongoose.model('product',productSchema);

export default product 