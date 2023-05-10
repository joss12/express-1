import { getCollection } from "./index";

const brands = [
    "Shanes",
    "Dilgan",
    "Veggies of Spinning Wheel"
]

const productTypes = [
    "Sweater",
    "Tee-Shirt",
    "Hat",
    "Shoes"
];


const colors = [
    "Black",
    "Blue",
    "White",
    "Green",
];

const sizes = [
    "Small",
    "Medium",
    "Large",

]

let skuCount = 1;
let price = 1;


function generateProducts(){
    const products = [];

    for(let brand of brands){

        for(let color of colors){

            for(let productType of productTypes){
                
                for(let size of sizes){

                    products.push({
                        SKU: skuCount++,
                        brand,
                        productType,
                        color,
                        size,
                        price: price++,
                        quantity: 5
                    })
                }
            }
        }
    }
    return products
}

(async function (){
    const products = await generateProducts();

    const collection = await getCollection("store", `products`);
    await collection.deleteMany();
    await collection.insertMany(products);

    console.log("Inserted products");

    const tokens = await getCollection("auth", `tokens`);

    await tokens.deleteMany();
    await tokens.insertOne({
        owner: "CLIENT-1",
        value: 123,
        expiry: null,
        canModifyProducts: true
    });
    console.log("Done!")

})();


