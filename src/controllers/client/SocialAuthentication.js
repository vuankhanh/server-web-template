const passport = require('passport');

const Authentication = require('../Authentication');

function Facebook(req, res){
    passport.authenticate('facebook-token', { session: false }, async (error, user, info)=>{
        // console.log('run this');
        // console.log(error);
        // console.log(user);
        // console.log(info);
        if(error){
            const oauthError = error.oauthError;
            if(oauthError.statusCode){
                return res.status(oauthError.statusCode).json({message: oauthError.data});
            }

            return res.status(500).json({ message: 'Something went wrong' });
        }
        if(user){
            let tokenGenerating = await Authentication.generateToken('client', user);
            const accessToken = tokenGenerating.accessToken;
            
            const refreshToken = tokenGenerating.refreshToken;
            return res.status(200).json({accessToken, refreshToken, message: 'successfully'});
        }
    })(req, res)
}

function Google(req, res, next){
    passport.authenticate('google-oauth-token', { session: false }, async (error, user, info)=>{
        // console.log('run this');
        // console.log(error);
        // console.log(user);
        // console.log(info);
        if(error){
            console.log(error);
            const oauthError = error.oauthError;
            if(oauthError.statusCode){
                return res.status(oauthError.statusCode).json({message: oauthError.data});
            }

            return res.status(500).json({ message: 'Something went wrong' });
        }
        if(user){
            let tokenGenerating = await Authentication.generateToken('client', user);
            const accessToken = tokenGenerating.accessToken;
            
            const refreshToken = tokenGenerating.refreshToken;
            return res.status(200).json({accessToken, refreshToken, message: 'successfully'});
        }
    })(req, res, next)
}


module.exports={
    Facebook,
    Google
}