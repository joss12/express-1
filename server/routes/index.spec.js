import axios from 'axios';

(async function(){

    const adjust = await axios.post(`http://localhost:3005/products/adjust/quantity`, {
        SKU: 1,
        token: 123,
        count: -1
    })
    console.log("Adjustment?", adjust.data)
})();