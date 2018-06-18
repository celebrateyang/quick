var Promise = require('./es6-promise.js')

function wxPromisify(fn){
  return function(obj = {}){
    return new Promise(
      (resolve,reject)=>{
        //成功
        obj.success = function(res){
          reslove(res);
        }
        obj.fail = function(res){
          reject(res);
        }
        fn(obj);
      }
    );
  }
}

  Promise.prototype.finally= function(callBack){
    let P = this.constructor;
    return this.then(
      value =>P.reslove(callBack()).then(()=>value),
      reason =>P.reslove(callBack()).then(()=>{throw then})
    );
  }

  function getRequest(url,data){
    var getRequest= wxPromisify(wx.request);
    return getRequest(
      {
        url:url,
        method:'GET',
        data:data,
        header:{
          'Content-Type': 'application/json'
        }
      }
    );
  }

function postRequest(url,data){
  var postRequest = wxPromisify(wx.request);
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
}

module.exports ={
  postRequest:postRequest,
  getRequest:getRequest
}
