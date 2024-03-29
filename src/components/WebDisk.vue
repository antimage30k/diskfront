<template>
  <el-container>
    <el-aside width="10%">
      <el-affix :offset="120">
        <div>
          <AvatarItem />
        </div>
        <span :title="userInfo.username">{{ userInfo.username }}</span>
        <br />
        <br />
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="handleLogin" :style="{ color: loginTextColor }">
            <el-icon>
              <user />
            </el-icon>
            <span>
              <b>{{ loginSpan }}</b>
            </span>
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
        <el-table-column label="公开" width="100">
          <template #default="scope">
            <el-switch
              :model-value="scope.row.share"
              :disabled="notAdminOrUploader(scope.row.uploader)"
              @click.prevent="changeShare(scope.row.id, scope.row.share, scope.row.uploader)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column width="200">
          <template #header>
            <el-input size="small" placeholder="Type to search" v-model="search" />
          </template>
          <template #default="scope">
            <el-button size="small" @click.prevent="downloadFile(scope.row.id)">Download</el-button>
            <el-button
              size="small"
              type="danger"
              @click.prevent="deleteFile(scope.row.id)"
              :disabled="notAdminOrUploader(scope.row.uploader)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <br />

      <el-upload
        class="upload-demo"
        :action="baseUrl + '/api/disk/upload/multi'"
        multiple
        :on-success="afterUpload"
      >
        <el-button type="primary" :disabled="userInfo.userId == guestId">Upload Files</el-button>
      </el-upload>
    </el-main>
  </el-container>

  <el-dialog v-model="loginDialogVisible" width="480px">
    <LoginItem @close-login-dialog="closeLoginDialog" />
  </el-dialog>
</template>


<script>
import { isString } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { jsonAjax, log, utc2local, store, getCurrentUser, setUser } from './util.js'
import LoginItem from "./LoginItem.vue";
import AvatarItem from "./AvatarItem.vue";
import { BaseUrl, DefaultUser, defaultAvatar } from "./constants.js";

export default {
  data() {
    return {
      files: [],
      search: "",
      baseUrl: BaseUrl,
      loginDialogVisible: false,
      userInfo: store.userInfo,
      loginTextColor: '#67C23A',
      guestId: DefaultUser.Guest,
    };
  },
  computed: {
    filtered() {
      return this.files.filter((data) => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()));
    },
    getAvatar() {
      if (!this.userInfo.avatar) {
        return defaultAvatar;
      } else {
        return this.userInfo.avatar;
      }
    },
    loginSpan() {
      if (this.userInfo.userId === DefaultUser.Guest) {
        this.loginTextColor = '#67C23A';
        return "LOGIN";
      } else {
        this.loginTextColor = '#F56C6C';
        return "LOGOUT";
      }
    },
  },
  mounted() {
    getCurrentUser();
    this.fetch();
  },
  methods: {
    fetch() {
      jsonAjax("GET", BaseUrl + "/api/disk/", null, (data) => {
        this.files = data;
        for (let i = 0; i < this.files.length; i++) {
          let f = this.files[i];
          f.local_time = utc2local(f.create_time);
        }
      });
    },
    afterUpload(res) {
      if (isString(res)) {
        ElMessage.error(res);
      }
      else {
        res.local_time = utc2local(res.create_time);
        this.files.push(res);
      }
    },
    deleteFile(id) {
      jsonAjax("DELETE", BaseUrl + "/api/disk/delete/" + id, null, this.afterDelete);
    },
    afterDelete(response) {
      let id = response.id;
      this.files.splice(this.files.findIndex((f) => {
        return f.id === id;
      }), 1);
    },
    downloadFile(id) {
      window.location.href = BaseUrl + "/api/disk/download/" + id;
    },
    handleLogin() {
      if (this.userInfo.userId === DefaultUser.Guest) {
        this.openLoginDialog();
      } else {
        this.onLogout();
      }
    },
    openLoginDialog() {
      this.loginDialogVisible = true;
    },
    closeLoginDialog() {
      this.fetch();
      this.loginDialogVisible = false;
    },
    onLogout() {
      jsonAjax('DELETE', BaseUrl + '/api/logout', null, (res) => {
        setUser(res);
        this.fetch();
      });
    },
    notAdminOrUploader(uploaderId) {
      return !this.userInfo.isAdmin && uploaderId !== this.userInfo.userId;
    },
    changeShare(fileId, currentShare, uploaderId) {
      if (this.notAdminOrUploader(uploaderId)) {
        return;
      }
      jsonAjax('POST', this.baseUrl + '/api/disk/share/set', { id: fileId, share: !currentShare }, (res) => {
        this.files[this.files.findIndex((f) => f.id === fileId)].share = res.share;
      })
    },
  },
  components: { LoginItem, AvatarItem }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
