export const log = console.log.bind(console, new Date().toLocaleDateString());
export const utc2local = function (datetime) {
  return new Date(datetime).toLocaleString();
}

export const ajax = function (method, path, data, responseCallback) {
  // log('ajax request', method, path, data, responseCallback)
  var r = new XMLHttpRequest()
  r.open(method, path, true)
  // response callback
  r.onreadystatechange = function () {
    if (r.readyState === 4) {
      // log('ajax response data', r.response)
      var r_data = JSON.parse(r.response)
      responseCallback(r_data)
    }
  }

  var form = new FormData()
  for (var key in data) {
    // 规范写法
    if (!data.hasOwnProperty(key)) continue;
    if (data[key] instanceof File) {
      log('is file')
      let f = data[key]
      form.append(key, f)
      form.append('size', f.size)
    } else {
      form.append(key, JSON.stringify(data[key].size))
    }
  }
  r.send(form);
}

export const baseUrl = "http://localhost:4000"


export const jsonAjax = function (method, path, data, responseCallback) {
  // log('ajax request', method, path, data, responseCallback)
  var r = new XMLHttpRequest()
  r.open(method, path, true)
  // response callback
  r.onreadystatechange = function () {
    if (r.readyState === 4) {
      // log('ajax response data', r.response)
      var res = JSON.parse(r.response)
      responseCallback(res);
    }
  }
  r.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  r.send(JSON.stringify(data));
}