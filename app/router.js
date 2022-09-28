'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
 module.exports = app => {
  console.log('app', app)
  const { router, controller } = app;
  const auth = app.middleware.auth()
  // router.get('/', controller.home.index);
  router.prefix('/api/v1')

  router.post('/users', controller.user.create)
  router.post('/users/login', controller.user.login)
  // 获取当前登录用户
  router.get('/user', auth, controller.user.getCurrentUser)
  router.patch('/user', auth, controller.user.update)
  // 获取用户资料
  router.get('/users/:userId', app.middleware.auth({
    required: false
  }), controller.user.getUser)
  // 用户订阅
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe)
  router.post('/users/:userId/unsubscribe', auth, controller.user.unsubscribe)
  router.get('/users/:userId/subscriptions', auth, controller.user.getSubscription)
  // 阿里云VOD 获取视频上传地址和凭证
  router.get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo)
};