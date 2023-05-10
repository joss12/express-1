import express from 'express';

import {getCollection} from '../db/index';

export const router = express.Router();

router.get('/detail/:SKU', async function(req, res){

    const {SKU} = req.params;
    console.log("Searching for SKU", SKU);

    const collection = await getCollection("store", "products");
    const product = await collection.findOne({SKU: +SKU});
    res.json(product)

});


router.get('/search',  async function (req, res){

    let dbQuery = {
        price:{
            $gt: req.query.minPrice ? +req.query.minPrice: 0,
            $lt: req.query.maxPrice ? +req.query.maxPrice: Infinity
        }
    };

    console.log("query", req.query)

    for(let property of ["color", "size", "productType"]){
        let value = req.query[property];

        if(value){
            dbQuery[property] = {
                $in : value.split(',')
            };
        }
    }

    console.log("Made the query", dbQuery);

    const collection = await getCollection("store", "products");
    const productPointer = collection.find(dbQuery)
    .project({_id: 0})
    .limit(+req.query.limit || 10);

    const products = await productPointer.toArray();
    res.json(products)
});


router.get('/options/:property', async function(req, res){
    const { property } = req.params;
    const collection = await getCollection("store", "products");
    const options = await collection.distinct(property);
    res.json(options);
});


router.post('/adjust/quantity', async function(req, res){
    const {SKU, token, count} = req.body;

    const tokens = await getCollection("auth", "tokens");
    const auth = await tokens.findOne({value: token});

    if(!auth || !auth.canModifyProducts){
        res.json({error: "Invalid auth"});
        return;
    }

    const products = await getCollection("store", "products");
    const product = await products.find({SKU});

    await products.updateOne({
        SKU
    }, {
        $set:{
            quantity: product.quantity + +count

        }
    });
    res.json({success:true});
})
