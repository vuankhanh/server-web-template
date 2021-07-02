const ProductGalleryShema = require('../../models/ProductGallery');

async function get(size, page){
    try {
        let countTotal = await ProductGalleryShema.model.ProductGallery.find().count();
        let filterPage = await ProductGalleryShema.model.ProductGallery.find({})
        .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(size);
        return {
            totalItems: countTotal,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotal/size),
            data: filterPage
        }
        
    } catch (error) {
        return error;
    }
}

async function insert(objGallery){
    let productGallery = new ProductGalleryShema.model.ProductGallery(objGallery);
    return await productGallery.save();
}

async function update(id, conditional){
    
}

async function remove(id){
    
}

module.exports= {
    get,
    insert,
    update,
    remove,
}