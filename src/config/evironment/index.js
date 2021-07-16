const deliveryStatus = [
    'pending',
    'confirmed',
    'isComing',
    'done',
    'revoke'
]

module.exports = {
    env: {
        ACCESS_TOKEN_SECRET: "access-token-secret-example-trungquandev.com-green-cat-a@",
        ACCESS_TOKEN_LIFE: 3600,
        REFRESH_TOKEN_SECRET: "refresh-token-secret-example-trungquandev.com-green-cat-a@",
        REFRESH_TOKEN_LIFE: 2592000,
    },
    order: {
        deliveryStatus
    }
}