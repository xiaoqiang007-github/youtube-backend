'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create () {
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
  async login () {
    const { ctx } = this;
    const body = this.ctx.request.body
    // 1. 基本数据校验
    ctx.validate({
      email: {
        type: 'email'
      },
      password: {
        type: 'string'
      }
    });
    // 2. 校验邮箱是否存在
    const UserService = this.service.user

    const user = await UserService.findByEmail(body.email)
    if (!user) {
      this.ctx.throw(422, '用户不存在')
    }
    // 3. 校验密码是否正确
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, '密码不正确')
    }
    // 4. 生成token
    const token = UserService.createToken({
      userId: user._id
    })
    // 5. 发送响应数据
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
  async getCurrentUser () {
    console.log('ctx', this)
    // 1. 验证 token
    //  2. 获取用户
    //  3. 发送响应
    const user = this.ctx.user
    this.ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        avator: user.avator,
        channelDescriptioin: user.channelDescriptioin,
        token: this.ctx.headers['authorization']
        // ...user
      }
    }
  }

  async update () {
    const { ctx } = this;
    const body = this.ctx.request.body
    // 1. 基本数据校验
    ctx.validate({
      username: {
        type: 'string',
        required: false
      },
      email: {
        type: 'email',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      channelDescriptioin: {
        type: 'string',
        required: false
      },
      avator: {
        type: 'string',
        required: false
      },
    });

    // 2. 校验用户是否已经存在 校验邮箱是否已经存在
    const UserService = this.service.user

    if (body.username && body.username !== this.ctx.user.username && await UserService.findByUsername(body.username)) {
      this.ctx.throw(422, '用户已存在')
    }
    if (body.email && body.email !== this.ctx.user.email && await UserService.findByEmail(body.email)) {
      this.ctx.throw(422, '邮箱已存在')
    }
    // 3. 校验密码是否已经存在
    if (body.password) {
      body.password = this.ctx.helper.md5(body.password)
      // if(&& body.email !== this.ctx.user.email && await UserService.findByEmail(body.email)) {
      //   this.ctx.throw(422, '邮箱已存在')
      // }
    }
    // 4. 更新用户信息
    const user = await UserService.updateUser(body)
    console.log('user', user)

    // 5. 发送响应数据
    this.ctx.body = {
      user: {
        // 通过lodash获取需要的字段
        ...this.ctx.helper._.pick(user, ['email', 'username', 'avator', 'channelDescriptioin', 'subscribersCount']),
        token: this.ctx.headers['authorization']
        // ...user
      }
    }
  }

  async subscribe () {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId
    // 1. 用户不能订阅自己
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己')
    }
    // 2. 添加订阅
    const user = await this.service.user.subscribe(userId, channelId)
    // 3. 发送订阅
    this.ctx.body = {
      user: {
        // 通过lodash获取需要的字段
        ...this.ctx.helper._.pick(user, ['username', 'email', 'avator', 'channelDescriptioin', 'subscribersCount']),
        // ...user.toJSON(),
        isSubscribed: true
      }
    }
  }

  async unsubscribe () {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId
    // 1. 用户不能取消订阅自己
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能取消订阅自己')
    }
    // 2. 添加订阅
    const user = await this.service.user.unsubscribe(userId, channelId)
    // 3. 发送订阅
    this.ctx.body = {
      user: {
        // 通过lodash获取需要的字段
        ...this.ctx.helper._.pick(user, ['username', 'email', 'avator', 'channelDescriptioin', 'subscribersCount']),
        // ...user.toJSON(),
        isSubscribed: false
      }
    }
  }

  async getUser () {
    // 1. 获取订阅状态
    let isSubscribed = false
    if (this.ctx.user) {
      //  获取订阅记录
      const record = await this.app.model.Subscription.findOne({
        user: this.ctx.user._id,
        channel: this.ctx.params.userId
      })
      if (record) {
        isSubscribed = true
      }
    }
    // 2. 获取用户信息
    const user = await this.app.model.User.findById(this.ctx.params.userId)
    console.log('getUser. user', user, this.ctx.params)
    // 3. 发送响应 
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username', 'email', 'avator', 'channelDescriptioin', 'cover', 'subscribersCount'
        ]),
        isSubscribed
      }
    }
  }

  async getSubscription () {
    const Subscription = this.app.model.Subscription

    let subscriptions = await Subscription.find({
      user: this.ctx.params.userId
    }).populate('channel')
    console.log('subscriptions', subscriptions, this.ctx.params.userId)
    subscriptions = subscriptions.map(item => {
      return this.ctx.helper._.pick(item.channel, ['_id', 'username', 'avatar'])
    })
    this.ctx.body = {
      subscriptions
    }
  }

}

module.exports = UserController;
