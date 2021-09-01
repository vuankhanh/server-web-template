const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleOauthTokenStrategy = require('passport-google-oauth-token');
const ClientAuthentication = require('../models/ClientAuthentication');

module.exports = passport => {
    passport.use(
        new FacebookTokenStrategy(
            {
                clientID: '583183603050614',
                clientSecret: 'dd905d3e58640699fb0e0fcfd7df6540'
            },
            async (accessToken, refreshToken, profile, done)=>{
                try {
                    // console.log('accessToken ', accessToken);
                    // console.log('refreshToken ', refreshToken);
                    // console.log('profile ', profile);

                    let object = {
                        customerCode: 'tuthan-000001',
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        allowFacebook: true,
                        facebookId: profile.id,
                    }

                    const authenticationResult = await ClientAuthentication.findOne(
                        { email: object.email }
                    )

                    if(!authenticationResult){
                        const newAuthentication = new ClientAuthentication(object);
                        await newAuthentication.save();
                        return done(null, newAuthentication);
                    }else{
                        if(!authenticationResult.allowFacebook || authenticationResult.facebookId){
                            const authenticationResult = await ClientAuthentication.findOneAndUpdate(
                                { email: object.email },
                                {
                                    $set: {
                                        'facebookId': object.facebookId,
                                        'allowFacebook': true
                                    }
                                },
                                { new: true }
                            );
                            return done(null, authenticationResult);
                        }else{
                            return done(null, authenticationResult);
                        }
                    }
                    
                } catch (error) {
                    console.log('lỗi trong này');
                    console.log(error);
                    done(error, false)
                }
            }
        )
    );

    passport.use(
        new GoogleOauthTokenStrategy(
            {
                clientID: '594503809918-0e4urn5uacs50j8ejbj0f887t76et12c.apps.googleusercontent.com',
                clientSecret: 'xwVkjyuCB8XynB_czlAP4BHb',
            },
            async (accessToken, refreshToken, profile, done)=>{
                try {
                    // console.log('accessToken ', accessToken);
                    // console.log('refreshToken ', refreshToken);
                    // console.log('profile ', profile);
                    let object = {
                        customerCode: 'tuthan-000001',
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        allowGoogle: true,
                        googleId: profile.id,
                    }

                    const authenticationResult = await ClientAuthentication.findOne(
                        { email: object.email }
                    )

                    if(!authenticationResult){
                        const newAuthentication = new ClientAuthentication(object);
                        await newAuthentication.save();
                        return done(null, newAuthentication);
                    }else{
                        if(!authenticationResult.allowGoogle || authenticationResult.googleId){
                            const authenticationResult = await ClientAuthentication.findOneAndUpdate(
                                { email: object.email },
                                {
                                    $set: {
                                        'googleId': object.facebookId,
                                        'allowGoogle': true
                                    }
                                },
                                { new: true }
                            );
                            return done(null, authenticationResult);
                        }else{
                            return done(null, authenticationResult);
                        }
                    }
                    
                } catch (error) {
                    console.log('lỗi trong này');
                    console.log(error);
                    done(error, false)
                }
            }
        )
    );
}