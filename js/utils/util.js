import reqwest from 'reqwest';
import Notification from '../common/notify';


Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.resize = function(){
    for (var i = 0; i < this.length; i++) {
        this[i].resize();
    }
};

module.exports = {
    /**
     * 判断对象的类型
     */
    type:function(obj){
        return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
    },
    extend:function(obj,def){
        if(typeof(obj) != "object" || obj === null){
            return def;
        }
        let o = obj , i , j;
        if(def && typeof(def) == "object"){
            for(i in def){
                if(!o[i]){
                    o[i] = def[i]
                }
            }
        }
        return o;
    },

    ajax: function(config, request) {
        var self = this;
        let defaultConfig = {
            method: 'get',
            type: 'json',
            data: {},
            success: function() {},
            error: function() {},
            complete: function() {},
            failure: function() {}
        };
        let conf = this.extend(config, defaultConfig);
        //修复ajax get 304bug，增加随机数
        if(conf.method == 'get'){
            conf.data.randnum = Math.random();
        }
        //成功函数
        let success = conf.success;
        let failure = conf.failure;
        conf.success = function(result) {
            if (parseInt(result.code) === 200) {
                success(result.value);
            } else {
                failure(result);
                Notification.error(result.msg,2);
            }
        }
            //失败函数
        let error = conf.error;
        conf.error = function(e) {
            error(e);
            Notification.error('未知错误');
        }
            //完成函数
        let complete = conf.complete;
        conf.complete = function() {
            complete();
        }
        return request(conf);
    },

    loadDataPromise(url,data){
        let promise = new Promise((resolve, reject) => {
            let ajax = this.ajax({
                url:url,
                data:data,
                success:function(result){
                    resolve(result);
                },
                failure:function(e){
                    reject();
                },
                error:function(e){
                    reject();
                }
            },reqwest,Notification);

        });
        return promise;
    }

}
