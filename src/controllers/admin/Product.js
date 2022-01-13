const Product = require('../../models/Product');
const convertVieService = require('../../services/convert-Vie');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    try {
        let countTotal = await Product.model.Product.countDocuments();
        let filterPage = await Product.model.Product.find({})
        .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(size);
        return res.status(200).json({
            totalItems: countTotal,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotal/size),
            data: filterPage
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function searching(req, res){
    const query = req.query;
    try {
        if(!query.productName){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const filterPage = await Product.model.Product.find(
                {
                    $text: {
                        $search: query.productName
                    }
                },
                {
                    category: 1,
                    name: 1,
                    code: 1,
                    sortDescription: 1,
                    thumbnailUrl: 1,
                    currencyUnit: 1,
                    theRemainingAmount: 1,
                    price: 1,
                    unit: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            ).limit(5);

            return res.status(200).json(filterPage);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    formData.code = "abc";
    try {
        formData.route = convertVieService(formData.name);

        const thumbnail = formData.albumImg.thumbnail;

        const object = {...formData, thumbnailUrl: thumbnail };
        const product = new Product.model.Product(object);
        await product.save();
        return res.status(200).json(product);
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
        if(formData){
            formData.route = convertVieService(formData.name);

            const thumbnail = formData.albumImg.thumbnail;

            const result = await Product.model.Product.findByIdAndUpdate(
                { _id: formData._id },
                {
                    $set:{
                        'name': formData.name,
                        'route': formData.route,
                        'category': formData.category,
                        'price': formData.price,
                        'currencyUnit': formData.currencyUnit,
                        'unit': formData.unit,
                        'thumbnailUrl': thumbnail,
                        'sortDescription': formData.sortDescription,
                        'highlight': formData.highlight,
                        'albumBanner': formData.albumBanner,
                        'theRemainingAmount': formData.theRemainingAmount,
                        'longDescription': formData.longDescription,
                        'albumImg': formData.albumImg,
                        'albumVideo': formData.albumVideo
                    }
                },
                { 'new': true }
            );
            return res.status(200).json(result);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
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
            const result = await Product.model.Product.findOneAndRemove(
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
    searching,
    insert,
    update,
    remove
}