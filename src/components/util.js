import { ref, reactive } from "vue";
import { BaseUrl } from "./constants";
import { ElMessage } from "element-plus"

export const log = console.log.bind(console, new Date().toLocaleDateString());
export const utc2local = function (timestamp) {
  return new Date(timestamp * 1000).toLocaleString();
}

export const jsonAjax = function (method, path, data, responseCallback) {
  // log('ajax request', method, path, data, responseCallback)
  var r = new XMLHttpRequest()
  r.open(method, path, true)
  // response callback
  r.onreadystatechange = function () {
    if (r.readyState === 4) {
      // log('ajax response data', r.response)
      var res = JSON.parse(r.response);
      if (r.status === 500) {
        ElMessage.error(res.msg);
      } else {
        responseCallback(res);
      }
    }
  };
  
  r.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  r.send(JSON.stringify(data));
}

export const store = {
  userInfo: reactive({
    isAdmin: ref(false),
    userId: ref(-1),
    username: ref('guest'),
  }),
}

export const setUser = function (data) {
  store.userInfo.isAdmin = data.isAdmin;
  store.userInfo.userId = data.userId;
  store.userInfo.username = data.username;
  log("UserInfo", data);
}

export const logout = function () {
  store.userInfo.isAdmin = false;
  store.userInfo.userId = -1;
}

export const getCurrentUser = function () {
  jsonAjax("GET", BaseUrl + '/api/current_user', null, (res) => {
    setUser(res);
  });
}