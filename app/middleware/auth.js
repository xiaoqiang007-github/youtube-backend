module.exports = (options = { required: true }) => {
    return async function errorHandler (ctx, next) {
        // 1. 获取请求头token信息
        let token = ctx.headers['authorization']
        token = token ? token.split('Bearer ')[1] : null

        // 2. 验证token， 无效401
        if (!token) ctx.throw(401)

        // 3. token有效，根据userId 获取用户数据挂在到 ctx对象中给后续的中间件使用
        try {
            const data = ctx.service.user.verifyToken(token)
            ctx.user = await ctx.model.User.findById(data.userId)

        } catch (e) {
            ctx.throw(401)
        }
        // 4. 执行后面的中间件
        await next()
    }
}