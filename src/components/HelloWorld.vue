<template>
  <el-container>
    <el-aside width="150">
      <el-affix :offset="120">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-icon>
              <user />
            </el-icon>
            <span>LOGIN</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <document />
            </el-icon>
            <span>FILE INDEX</span>
          </el-menu-item>
        </el-menu>
      </el-affix>
    </el-aside>

    <el-main>
      <el-table :data="filtered" stripe align="center">
        <el-table-column prop="local_time" label="上传时间" width="200" />
        <el-table-column prop="name" label="文件名" width="400" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column width="200">
          <template #header>
            <el-input size="small" placeholder="Type to search" v-model="search" />
          </template>
          <template #default="scope">
            <el-button size="small" @click.prevent="downloadFile(scope.row.id)">Download</el-button>
            <el-button size="small" type="danger" @click.prevent="deleteFile(scope.row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <br />

      <el-upload
        class="upload-demo"
        action="http://127.0.0.1:4000/disk/upload/multi"
        multiple
        :on-success="afterUpload"
        :data="{ 'size': size }"
        :before-upload="getSize"
      >
        <el-button type="primary">Upload Files</el-button>
      </el-upload>
    </el-main>
  </el-container>
</template>



<script>
import { isString } from "@vueuse/shared";
import { ElMessage } from "element-plus";

const log = console.log.bind(console, new Date().toLocaleDateString());
const utc2local = function (datetime) {
  return new Date(datetime + ' UTC').toLocaleString();
}

const ajax = function (method, path, data, responseCallback) {
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

export default {

  data() {
    return {
      files: [],
      size: Number,
      search: "",
    }
  },

  computed: {
    filtered() {
      return this.files.filter(
        (data) => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
    },
  },

  mounted() {
    this.fetch();
  },

  methods: {
    fetch() {
      ajax("GET", "http://127.0.0.1:4000/disk/", null, (data) => {
        this.files = data;
        for (let i = 0; i < this.files.length; i++) {
          let f = this.files[i];
          f.local_time = utc2local(f.create_time);
        }
      })
    },
    afterUpload(res) {
      log(res);
      if (isString(res)) {
        ElMessage.error(res)
      } else {
        res.local_time = utc2local(res.create_time)
        this.files.push(res)
      }
    },

    deleteFile(id) {
      ajax("DELETE", "http://127.0.0.1:4000/disk/delete/" + id, null, this.afterDelete);

    },

    afterDelete(response) {
      log(response);
      let id = response.id;
      this.files.splice(
        this.files.findIndex((f) => {
          return f.id === id;
        }), 1,
      );
    },

    getSize(file) {
      // log(file)
      this.size = file.size;
      // log(this.size)

    },

    uuid(id) {
      log(id)
    },

    downloadFile(id) {
      window.location.href = "http://127.0.0.1:4000/disk/download/" + id;
    },

    filter(files, search) {
      return files.filter(
        (data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()))
    },
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
