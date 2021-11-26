const Redirect = require('../../models/Redirect');

async function redirectSite(req, res){
    const params = req.params;
    const urlCode = params.urlCode;
    try {
        if(!urlCode){
            return req.status(404);
        }else{
            let condition = { strings: urlCode };
            let result = await Redirect.model.Redirect.findOne(condition);
            return res.redirect(result.url);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
    
}



module.exports = redirectSite