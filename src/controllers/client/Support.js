const Support = require('../../models/Support');

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
    const route = params.route;

    try {
        if(!route){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const condition = { route };
            const support = await Support.model.Support.findOne(condition)
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

module.exports = {
    getAll,
    getDetail,
}