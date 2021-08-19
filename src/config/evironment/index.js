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
    facebook: {
        FACEBOOK_CLIENT_ID: '1998183173690064',
        FACEBOOK_CLIENT_SECRET: '913720af8c6bc13085270bfe00213b3f'
    },
    giahangtietkiem: {
        token: "350CCd53B334686f26EC0A6f350C7471B78bcE5f",
        env: "https://services.giaohangtietkiem.vn",
        port: 443
    },
    ghn: {
        token: "9375af52-f8e5-11eb-bfef-86bbb1a09031",
        env: "https://dev-online-gateway.ghn.vn",
    },
    ahamove: {
        // token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhaGEiLCJ0eXAiOiJ1c2VyIiwiY2lkIjoiODQ4NDI0MTU5MjEiLCJzdGF0dXMiOiJPTkxJTkUiLCJlb2MiOiJ2dWFua2hhbmgxOTA3MTk5MkBnbWFpbC5jb20iLCJub2MiOiJWXHUwMTY5IEFuIEtoXHUwMGUxbmgiLCJjdHkiOiJIQU4iLCJhY2NvdW50X3N0YXR1cyI6IkFDVElWQVRFRCIsImV4cCI6MTYyODg1Njg0NiwicGFydG5lciI6ImNhcm90YXZuIiwidHlwZSI6ImFwaSJ9.ClSxZHzikFJ1U9yHQ2YM4WJvfTrWeC6x6fu0xfKwQS4",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhaGEiLCJ0eXAiOiJ1c2VyIiwiY2lkIjoiODQ4NDI0MTU5MjEiLCJzdGF0dXMiOiJPTkxJTkUiLCJlb2MiOiJ2dWFua2hhbmgxOTA3MTk5MkBnbWFpbC5jb20iLCJub2MiOiJWXHUwMTY5IEFuIEtoXHUwMGUxbmgiLCJjdHkiOiJIQU4iLCJhY2NvdW50X3N0YXR1cyI6IkFDVElWQVRFRCIsImV4cCI6MTYyOTEwOTk4NywicGFydG5lciI6ImNhcm90YXZuIiwidHlwZSI6ImFwaSJ9.Op7Vk2GrSxAgx8OhRk79W5W4iAkjyzZfQBIUzNsAdiI",
        env: "https://apistg.ahamove.com/v1"
    },
    host: {
        // frontEnd: {
        //     protocol: 'http',
        //     domain: 'carota.vn'
        // }
        frontEnd: {
            protocol: 'http',
            domain: 'localhost:4200'
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