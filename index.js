const express = require('express');
const { request } = require('http');
const products = require('./products');
const app = express();

// //middleware has 3 arguments, with 'next' being the final argument
// const refine = (req, res, next) =>{
//     let value = products.inventory[0].productName;
//     res.send(value);
//     next();
// }
// //middleware is where the marks lie, Mike wants to see as much as possible

// //app.use() is reserved for middleware and must be called to make use of the middleware, otherwise middleware is just a const holding arguments
// app.use(refine);
// //refine is the middleware name that was defined, and is called inside the app.use argument



//need these two lines to post, and to access body of requests
app.use(express.json());
app.use(express.urlencoded({extended:false}));








let username = "Ryan"

// app.get('/', (req, res) => {
//     res.send('<h1>Welcome Back, ' + username + '</h1>');
//     //res.send(); great for debugging, but should be using .json later
// });

app.get('/api/products', (req, res) =>{
    res.json(products);
});



// get one products based on ID
app.get('/api/products/:id', (req, res)=> {
    const found = products.inventory.some(item => item.id === parseInt(req.params.id));
     //can specifcy parametres with req.params.(quality)
    if(found){
        res.json(products.inventory.filter(item => item.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({msg: "This product was not found"});
    }
});

app.post('/api/addproduct/:id', (req,res) =>{
    const newProduct = {
        id: +req.params.id,
        productName: req.body.productName,
        inStock: req.body.inStock,
        availStock: req.body.availStock
    }

    if(!newProduct.id || !newProduct.productName || !newProduct.inStock || !newProduct.availStock){
        return res.status(400).json({msg: "missing information"});
    }

    products.inventory.push(newProduct);
    res.json(products);

    // res.send(newProduct);
});

//Update

app.put('/api/updateproducts/:id', (req, res)=>{

    const found = products.inventory.some(item => item.id === parseInt(req.params.id));

    if(found){
        const updProduct = req.body;
        products.inventory.forEach(item => {
            // the +req returns an interger and is another method to parseInt(req) 
            if(item.id === +req.params.id){
                // the ? is a check if the product has a name and sets it to its own name since it must be changed after
                // an update request, this way it stays the same, the : item.productName sets the name to exactly what it
                // was if it returns no name (aka, leaves it blank)
                item.productName = updProduct.productName ? updProduct.productName : item.productName;
                item.inStock = updProduct.inStock ? updProduct.inStock : item.inStock;
                res.json({msg:'Product Updated' , item});
            }
        });
    } else {
        res.status(400).json({msg: 'This product was not found.'});
    }
});




//Delete

app.delete('/api/deleteproduct/:id', (req, res)=>{
    const found = products.inventory.some(item => item.id === parseInt(req.params.id));

    if(found){
        res.json({
            msg: "Product Deleted",
            deleted: products.inventory.filter(item => item.id === parseInt(req.params.id)),
            products: products.inventory.filter(item => item.id !== parseInt(req.params.id))
        });
    } else {
        res.status(400).json({msg: "This product was not found"});
    }
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});