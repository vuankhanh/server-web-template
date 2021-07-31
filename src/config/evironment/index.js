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
    giahangtietkiem: {
        token: "350CCd53B334686f26EC0A6f350C7471B78bcE5f",
        env: "https://services.giaohangtietkiem.vn",
        port: 443
    },
    host: {
        backEnd:{
            protocol: 'http',
            domain: 'localhost',
            port: 3000
        },
        frontEnd: {
            protocol: 'http',
            domain: 'localhost',
            port: 4200
        }
    },
    token: {
        authentication:{
            ACCESS_TOKEN_SECRET: "access-token-secret-vak-tuthan-carota-68-92-1@#",
            ACCESS_TOKEN_LIFE: '3d',
            REFRESH_TOKEN_SECRET: "refresh-token-secret-vak-tuthan-carota-68-92-1@#",
            REFRESH_TOKEN_LIFE: '30d',
        },
        forgotPassword: {
            FORGOT_PASSWORD_TOKEN_SECRET: "forgot-password-token-secret-vak-tuthan-carota-68-92-1@#",
            FORGOT_PASSWORD_TOKEN_LIFE: '3d',
        }
    },
    order: {
        orderStatus
    }
}