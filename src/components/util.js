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
    username: ref('游客'),
    avatar: ref(''),
  }),
}

export const setUser = function (data) {
  store.userInfo.isAdmin = data.isAdmin;
  store.userInfo.userId = data.userId;
  store.userInfo.username = data.username;
  store.userInfo.avatar = data.avatar;
  log("UserInfo", data);
}

export const getCurrentUser = function () {
  jsonAjax("GET", BaseUrl + '/api/current_user', null, (res) => {
    setUser(res);
  });
}

export const validateUsername = function (username) {
  const length = username.length;
  if (length < 2 || length > 10) {
    return false;
  }
  // 字母开头，字母或数字结尾，只能包含字母、数字和下划线
  const reg = /^[a-zA-Z]{1}\w*[0-9a-zA-Z]{1}$/
  return reg.test(username);
}

export const validatePassword = function (password) {
  const reg1 = /^(\d+|[a-zA-Z]+)$/
  const reg2 = /^\S{6,20}$/
  return !reg1.test(password) && reg2.test(password)
}