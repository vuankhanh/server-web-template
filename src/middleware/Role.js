exports.grantAccess = function(permission){
    return async (req, res, next) => {
        const jwtDecoded = req.jwtDecoded;
        const accountInfo = jwtDecoded.data;
        if(Number.isInteger(permission) && Number.isInteger(accountInfo.permission)){
            if(permission < accountInfo.permission){
                return res.status(403).send({
                    message: 'Unable to access this route.',
                });
            }
            next();
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}