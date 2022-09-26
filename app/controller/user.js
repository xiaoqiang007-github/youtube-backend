'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const body = this.ctx.request.body
    console.log('::::::::', body)
    // 1. 数据校验
    ctx.validate({
      username: {
        type: 'string'
      },
      email: {
        type: 'email'
      },
      password: {
        type: 'string'
      }
    });

    const UserService = this.service.user

    if (await UserService.findByUsername(body.username)) {
      this.ctx.throw(422, '用户已存在')
    }
    if (await UserService.findByEmail(body.email)) {
      this.ctx.throw(422, '邮箱已存在')
    }
    // 2. 保存用户
    const user = await UserService.createUser(body)
    // 3. 生成token
    const token = UserService.createToken({
      userId: user._id
    })
    // 4. 发送响应
    ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        avator: user.username,
        channelDescriptioin: user.channelDescriptioin,
        token
        // ...user
      }
    };
  }
  async login() {
    // 1. 基本数据校验
    // 2. 校验邮箱是否存在
    // 3. 校验密码是否正确
    // 4. 生成token
    // 5. 发送响应数据
  }
}

module.exports = UserController;
