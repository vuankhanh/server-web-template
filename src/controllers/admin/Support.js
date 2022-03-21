const Support = require('../../models/Support');

const convertVieService = require('../../services/convert-Vie');

async function getAll(req, res){
    try {
        const support = await Support.model.Support.find({});
        return res.status(200).json(support);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getDetail(req, res){
    const params = req.params;
    const id = params.id;

    console.log(params);
    try {
        if(!id){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let support = await Support.model.Support.findById(id)
            .populate(
                {
                    path: 'postsId'
                }
            );
            return res.status(200).json(support);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    try {
        if(
            (Object.keys(formData).length === 0 && formData.constructor === Object) ||
            !formData.name ||
            !formData.postsId
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const object = { 
                name: formData.name,
                route: convertVieService(formData.name),
                postsId: formData.postsId
            };
            const support = new Support.model.Support(object)
            await support.save();
            return res.status(200).json(support);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function update(req, res){
    const query = req.query;
    const id = query.id;
    const formData = req.body;

    try {
        if( 
            !id ||
            (Object.keys(formData).length === 0 && formData.constructor === Object)
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const object = { 
                name: formData.name,
                route: convertVieService(formData.name),
                postsId: formData.postsId
            };

            const condition = { _id: id };
            const support = await Support.model.Support.findOneAndUpdate(
                condition,
                {
                    $set: {
                        object
                    }
                },
                { 'new': true }
            ).populate(
                {
                    path: 'postsId'
                }
            );

            return res.status(200).json(support);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    getDetail,
    insert,
    update
}