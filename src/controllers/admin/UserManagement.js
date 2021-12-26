const ClientAuthentication = require('../../models/ClientAuthentication');

async function getAll(req, res){
    const query = req.query;
    const size = parseInt(query.size) || 10;
    const page = parseInt(query.page) || 1;
    const status = query.status;
    const createdBy = query.createdBy;

    try {
        const statusCondition = !status ? {} : { status };
        const createdByCondition = !createdBy ? {} : { createdBy };
        const condition = {
            ...statusCondition,
            ...createdByCondition
        }

        const countTotalUsers = await ClientAuthentication.countDocuments(condition);
        const filterPageUsers = await ClientAuthentication.find(
            condition,
            {
                customerCode: 1,
                email: 1,
                phoneNumber: 1,
                name: 1,
                allowAccount: 1,
                allowFacebook: 1,
                allowGoogle: 1,
                googleId: 1,
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

}

module.exports = {
    getAll,
    getDetail
}