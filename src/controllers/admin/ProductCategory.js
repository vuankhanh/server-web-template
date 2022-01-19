const ProductCategory = require('../../models/ProductCategory');

const convertVieService = require('../../services/convert-Vie');

async function getAll(req, res){
    try {
        let productCategorys = await ProductCategory.model.ProductCategory.find({});
        res.status(200).json(productCategorys);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}   

async function insert(req, res){
    const formData = req.body;
    try {
        if(!formData._id || !formData.name || !formData.googleProductCategory){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let object = {
                name: formData.name,
                route: convertVieService(formData.name),
                googleProductCategory: formData.googleProductCategory
            };
            const productCategory = new ProductCategory.model.ProductCategory(object);
            await productCategory.save();
            return res.status(200).json(productCategory);
        }
    } catch (error) {
        if(error.code===11000){
            if(error.keyPattern){
                return res.status(409).json({ key: error.keyPattern, message: 'Insert product category failed' });
            }
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function update(req, res){
    const formData = req.body;
    try {
        if(!formData._id || !formData.name || !formData.googleProductCategory){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let dataWillUpdate = {
                name: formData.name,
                route: convertVieService(formData.name),
                googleProductCategory: formData.googleProductCategory
            };

            const result = await ProductCategory.model.ProductCategory.findByIdAndUpdate(
                { _id: formData._id },
                {
                    $set: dataWillUpdate
                },
                { 'new': true }
            );
            return res.status(200).json(result);
        }
    } catch (error) {
        if(error.code===11000){
            if(error.keyPattern){
                return res.status(409).json({ key: error.keyPattern, message: 'Insert product category failed' });
            }
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function remove(req, res){
    const formData = req.body;
    try {
        if(formData._id){
            const result = await ProductCategory.model.ProductCategory.findOneAndRemove(
                {_id: formData._id}
            );
            return res.status(200).json(result);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove
}