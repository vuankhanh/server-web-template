const AdminAccount = require('../../models/AdminAccount');

const matchAdminAccountService = require('../../services/matchAdminAccount');
const bcryptService = require('../../services/bcrypt');

async function getAll(req, res){
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
                activated: 1,
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
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getDetail(req, res){
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
                    activated: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            )
            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    try {
        if(Object.keys(formData).length === 0 && formData.constructor === Object){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const password = bcryptService.hashPassword('qweQWE123!@#');
            let object = { ...formData, password };

            const result = new AdminAccount.model.AdminAccount(object);
            await result.save();
            let response = result.toObject();
            let select = {
                _id: 1,
                userName: 1,
                name: 1,
                avatar: 1,
                permission: 1,
                activated: 1,
                createdAt: 1,
                updatedAt: 1
            }

            for(const [key, value] of Object.entries(response)){
                if(select[key] != 1){
                    delete response[key];
                }
            }
            return res.status(200).json(response);
        }
    } catch (error) {
        if(error.code===11000){
            return res.status(409).json(
                {
                    message: 'This admin account already exists',
                    field: error.keyPattern
                }
            );
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function update(req, res){
    const formData = req.body;
    try {
        if(!formData.userName || (Object.keys(formData).length === 0 && formData.constructor === Object)){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let condition = { userName: formData.userName };
            let object = {};

            if(formData.name){
                object.name = formData.name;
            }

            if(formData.avatar){
                object.avatar = formData.avatar;
            }

            if(formData.permission){
                object.permission = formData.permission;
            }

            if(formData.activated != undefined){
                object.activated = formData.activated;
            }

            const result = await AdminAccount.model.AdminAccount.findOneAndUpdate(
                condition,
                {
                    $set: object
                },
                {
                    new: true,
                    select: {
                        userName: 1,
                        name: 1,
                        avatar: 1,
                        permission: 1,
                        activated: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            );
            return res.status(200).json(result);
        }
    } catch (error) {
        if(error.code===11000){
            return res.status(409).json(
                {
                    message: 'This admin account already exists',
                    field: error.keyPattern
                }
            );
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
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