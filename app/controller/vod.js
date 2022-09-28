'use strict';

const Controller = require('egg').Controller;

var RPCClient = require('@alicloud/pop-core').RPCClient;

function initVodClient (accessKeyId, accessKeySecret,) {
    var regionId = 'cn-shanghai';   // 点播服务接入地域
    var client = new RPCClient({//填入AccessKey信息
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
        apiVersion: '2017-03-21'
    });
    return client;
}

class VodController extends Controller {
    async createUploadVideo () {
        const query = this.ctx.query
        this.ctx.validate({
            Title: { type: 'string' },
            FileName: { type: 'string' },
        }, query)
        // 请求示例
        var client = initVodClient('LTAI5tAkcxfThZQXfgmXhTSi', 'Nl0iOHBR0sYZaXbHrF2EPwDn2mcIJE');

        // client.request.setApiRegionId("cn-shanghai");
        this.ctx.body = await client.request("CreateUploadVideo", query, {})
        // this.ctx.body = await client.request("RefreshUploadVideo", query, {})
         
        // .then(function (response) {
        //     console.log('VideoId = ' + response.VideoId);
        //     console.log('UploadAddress = ' + response.UploadAddress);
        //     console.log('UploadAuth = ' + response.UploadAuth);
        //     console.log('RequestId = ' + response.RequestId);
        // }).catch(function (response) {
        //     console.log('ErrorCode = ' + response.data.Code);
        //     console.log('ErrorMessage = ' + response.data.Message);
        //     console.log('RequestId = ' + response.data.RequestId);
        // });
    }
}

module.exports = VodController;