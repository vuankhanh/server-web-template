const shipper = require('./src/controllers/shipping-partner/giaohangtietkiem');

let f = async ()=>{
  try {
    let a = await shipper.warehouseAddresses();
    console.log(a);
  } catch (error) {
    console.log("Lỗi");
    console.log(error);
  }
};

f();