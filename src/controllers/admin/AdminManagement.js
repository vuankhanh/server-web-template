const AdminAccount = require('../../models/AdminAccount');

const matchAdminAccountService = require('../../services/matchAdminAccount');

async function getAll(req, res){
    const jwtDecoded = req.jwtDecoded;
    const accountInfo = jwtDecoded.data;
    if(accountInfo.permission != 1){
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'Unable to access this route.',
        });
    }else{
        const query = req.query;
        const size = parseInt(query.size) || 10;
        const page = parseInt(query.page) || 1;
        try {
            const countTotalUsers = await AdminAccount.model.AdminAccount.countDocuments();
            const filterPageUsers = await AdminAccount.model.AdminAccount.find(
                {},
                {
                    userName: 1,
                    name: 1,
                    avatar: 1,
                    permission: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            )
            .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
            .limit(size);
    
            return res.status(200).json({
                totalItems: countTotalUsers,
                size: size,
                page: page,
                totalPages: Math.ceil(countTotalUsers/size),
                data: filterPageUsers
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function getDetail(req, res){
    const jwtDecoded = req.jwtDecoded;
    const accountInfo = jwtDecoded.data;
    if(accountInfo.permission != 1){
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'Unable to access this route.',
        });
    }else{
        const params = req.params;
        const id = params.id;
        try{
            if(!id){
                return res.status(400).json({message: 'Missing parameter'});  
            }else{
                const condition = { _id: id }
                const result = await AdminAccount.model.AdminAccount.findOne(
                    condition,
                    {
                        userName: 1,
                        name: 1,
                        avatar: 1,
                        permission: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                )
                return res.status(200).json(result);
            }
        }catch(error){
            console.log(error)
            return res.status(500).json({ message: 'Something went wrong' }); 
        }
    }
}

async function insert(req, res){

}

async function update(req, res){
    const jwtDecoded = req.jwtDecoded;
    const accountInfo = jwtDecoded.data;
    if(accountInfo.permission != 1){
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'Unable to access this route.',
        });
    }else{
        const formData = req.body;
        if(formData.oldPassword){
            accountInfo.password = formData.oldPassword;

            let matchedAccount = await matchAdminAccountService.checkAccount(accountInfo);
            if(matchedAccount){
                formData.password = bcrypt.hashPassword(formData.password);
                let accessToken = await findOneAndUpdateAndGenNewtoken(accountInfo, formData);
                if(accessToken){
                    return res.status(200).json({ message: 'successfully', accessToken: accessToken });
                }else{
                    return res.status(204).json({ message: 'Nothing changes' });
                }
            }else{
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        }
    }
}

async function disable(req, res){

}

module.exports = {
    getAll,
    getDetail,
    insert,
    update,
    disable
}