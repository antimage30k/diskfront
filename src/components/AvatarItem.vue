<template>
    <el-avatar class="avatar-img" :size="160" fit="cover" :src="userAvatar"
        @click.prevent="userInfo.userId !== -1 && switchAvatarDialogVisible()" />

    <el-dialog v-model="avatarDialogVisible" width="1080px">
        <el-tabs type="card">
            <el-tab-pane label="Choose Avatar">
                <div class="grid-container">
                    <div class="grid-item" v-for="item in defaultAvatars" :key="item" :id="'item-' + item"
                        :style="{ backgroundColor: item === selected ? '#409eff' : '#FFFFFF' }">
                        <el-image :src="item" fit="cover" @click.prevent="chooseAvatar(item)" />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Avatar Link">
                <el-input v-model="selected" placeholder="Input Image Link"></el-input>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click.prevent="switchAvatarDialogVisible">Cancel</el-button>
                <el-button type="primary" @click.prevent="changeAvatar">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script>
import { ElMessage } from "element-plus";
import { BaseUrl, unsettedNum, defaultAvatarList, defaultAvatar } from './constants.js';
import { store, jsonAjax, log } from './util.js'
export default {
    data() {
        return {
            userInfo: store.userInfo,
            avatarDialogVisible: false,
            selected: "",
        }
    },
    computed: {
        userAvatar() {
            return this.userInfo.avatar ? this.userInfo.avatar : defaultAvatar;
        },
        defaultAvatars() {
            const arr = [];
            for (let i = 0; i < defaultAvatarList.length; i++) {
                arr.push('/avatar/' + defaultAvatarList[i]);
            }
            return arr;
        }
    },
    methods: {
        switchAvatarDialogVisible() {
            this.avatarDialogVisible = !this.avatarDialogVisible;
        },
        chooseAvatar(item) {
            // const preDiv = document.querySelector('#item-'+this.selected);
            // preDiv.style.backgroundColor = "#FFFFFF"
            this.selected = item;
            // const div = document.querySelector("#item-"+item);
            // div.style.backgroundColor = "#409eff";
        },
        changeAvatar() {
            if (this.selected === "") {
                ElMessage.error("Please Select One Avatar");
                return;
            }
            jsonAjax("PATCH", BaseUrl + '/api/avatar/set', { avatar: this.selected }, (res) => {
                log(res);
                store.userInfo.avatar = res.avatar;
            });
            this.switchAvatarDialogVisible();
        },
    },
}

</script>
<style scoped>
.avatar-img {
    border: #409eff solid 0px;
    display: block;
    margin: 50px auto;
    border-radius: 50%;
    transition: all 1.2s;
}

.avatar-img:hover {
    transform: rotate(360deg);
}

.grid-container {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto;
    grid-gap: 0px;
    background-color: #ffffff;
    padding: 20px;
}

.grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 10px;
}
</style>