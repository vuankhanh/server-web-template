const orderStatus = [
    {
        numericalOrder: 1,
        code: 'pending',
        name: 'Chờ xác nhận'
    },{
        numericalOrder: 2,
        code: 'confirmed',
        name: 'Đang xử lý'
    },{
        numericalOrder: 3,
        code: 'isComing',
        name: 'Đang vận chuyển'
    },{
        numericalOrder: 4,
        code: 'done',
        name: 'Giao hàng thành công'
    },{
        numericalOrder: 5,
        code: 'revoke',
        name: 'Đã hủy'
    }
]

module.exports = {
    env: {
        ACCESS_TOKEN_SECRET: "access-token-secret-example-trungquandev.com-green-cat-a@",
        ACCESS_TOKEN_LIFE: 3600,
        REFRESH_TOKEN_SECRET: "refresh-token-secret-example-trungquandev.com-green-cat-a@",
        REFRESH_TOKEN_LIFE: 2592000,
    },
    order: {
        orderStatus
    }
}