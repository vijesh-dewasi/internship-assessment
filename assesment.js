import express from 'express';
import mongoose from 'mongoose';
import product from './models/product.js'
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
dotenv.config();


const app = express();
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

const mongoUserName = process.env.mongoUserName;
const mongoPassword = process.env.mongoPassword;

// const mongoUri= "mongodb+srv://"+mongoUserName+":" + mongoPassword +"@productsitecluster.hduf0ay.mongodb.net/forAssement?retryWrites=true"
const mongoUri= "mongodb+srv://vijesh:Mohit%40123@productsitecluster.hduf0ay.mongodb.net/forAssement?retryWrites=true"

async function main() {
    await mongoose.connect(mongoUri);
}

main().then(() => console.log("connection_success")).catch(err => console.log(err));

// const dummy_products =[
//     {
//         name: "table",
//         productDesc: "a nice table on sale",
//         productPrice: 400
//     },
//     {
//         name: "chair",
//         productDesc: "a nice chair on sale",
//         productPrice: 200
//     },
//     {
//         name: "stool",
//         productDesc: "a nice stool on sale",
//         productPrice: 100
//     }
// ]

// dummy_products.forEach((product_item)=>{
//     const our_data = new product(product_item);
//     our_data.save();
// })


async function findAllProducts(){
    const result= await  product.find({}).exec().then((res)=>{return res})
    return result;
}

async function findProductById(id){
    
    const result =await  
    product.findOne({}).where({ _id:id}).exec()
    .then((res)=>{
        return res;
    }).catch(err=>{
        console.log(err)
    })
    return result;
}

async function updateProductPrice(id,price){
   
    try{
    const update={productPrice:price}
    const updatedProduct = await product.findOneAndUpdate({ _id: id}, update, {new: true})

    return updatedProduct
    }
    catch(err){
        console.log(err)
    }
}

app.get('/products', async function (req, res){
   const allProducts= await findAllProducts();
   res.send(JSON.stringify(allProducts))
  });

app.route('/products/:productId')
.get( async function (req, res) {
    const productId= req.params.productId;
    const productFound = await findProductById(productId);
    if(productFound==null){
        res.statusCode=404
    }
    res.send(JSON.stringify(productFound))
  })
.patch(async function(req,res){
    const productId= req.params.productId;
    const price= req.body.price;
    if(!price){
        res.statusCode=422
        res.send(JSON.stringify({wrong_object_structure:"expected a price field in body"}))
    }
    else{
    const  updatedProduct= await updateProductPrice(productId,price);

    if(updatedProduct==null){
        res.statusCode=404;
    }
    res.send(JSON.stringify(updatedProduct))
       }
});
  

let PORT = process.env.port || 3000

app.listen(PORT, function () {
  console.log('Listening to Port',PORT);
});