const ProductGalleryShema = require('../../models/ProductGallery');

async function get(size, page){
    try {
        let countTotal = await ProductGalleryShema.model.ProductGallery.countDocuments();
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
    try {
        let productGallery = new ProductGalleryShema.model.ProductGallery(objGallery);
        return await productGallery.save();
    } catch (error) {
        return error;
    }
}

async function update(id, objectWillUpdate){
    try {
        const productCategory = await ProductGalleryShema.model.ProductGallery.findByIdAndUpdate(
            { _id: id },
            {
                $set:{
                    'name': objectWillUpdate.name,
                    'productName': objectWillUpdate.productName,
                    'media': objectWillUpdate.media
                }
            },
            { 'new': true }
        );

        return productCategory;
    } catch (error) {
        return error;
    }
}

async function remove(id){
    try {
        const result = await ProductGalleryShema.model.ProductGallery.findOneAndRemove(
            {_id: id}
        );
        return result;
    } catch (error) {
        return error;
    }
}

module.exports= {
    get,
    insert,
    update,
    remove,
}