const Redirect = require('../../models/Redirect');

const randomStringsService = require('../../services/redirectCode');

async function getAll(req, res){

}

async function insert(req, res){
    const formData = req.body;
    try {
        if(!formData || !formData.originalUrl){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let originalUrl = formData.originalUrl;
            let condition = { url: originalUrl };
            let check = await Redirect.model.Redirect.findOne(condition);
            if(check){
                let reponse = {
                    shortenedLink: 'https://carota.vn/redirect/'+check.strings,
                    redirectTo: check.url
                };
                return res.status(200).json(reponse);
            }else{
                let randomCode = await randomStringsService.generateCode();
                let newUrl = {
                    strings: randomCode,
                    url: originalUrl
                }
                const result = new Redirect.model.Redirect(newUrl);
                await result.save();
                let reponse = {
                    shortenedLink: 'https://carota.vn/redirect/'+newUrl.strings,
                    redirectTo: originalUrl
                }
                return res.status(200).json(reponse);
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    insert
}