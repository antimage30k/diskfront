<template>
    <el-avatar
        class="avatar-img"
        :size="128"
        fit="cover"
        :src="userAvatar"
        @click.prevent="switchAvatarDialogVisible"
    />

    <el-dialog v-model="avatarDialogVisible" title="Choose Your Avatar" width="1080px">
        <div class="grid-container">
            <div
                class="grid-item"
                v-for="item in items"
                :key="item"
                :id="'item-' + item"
                :style="{ backgroundColor: item === selected ? '#409eff' : '#FFFFFF' }"
            >
                <el-image :src="userAvatar" fit="cover" @click.prevent="chooseAvatar(item)" />
            </div>
        </div>
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
import { BaseUrl } from './constants.js';
import { store, jsonAjax, log } from './util.js'
export default {
    data() {
        return {
            userInfo: store.userInfo,
            avatarDialogVisible: false,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            selected: -1,
        }
    },
    computed: {
        userAvatar() {
            return this.userInfo.avatar ? this.userInfo.avatar : '/avatar/default-1.png';
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
            if (this.selected === -1) {
                ElMessage.error("Please Select One Avatar");
                return;
            }
            jsonAjax("PATCH", BaseUrl + '/api/avatar', { avatar: this.selected }, (res) => {
                log(res);
                this.store.avatar = res.avatar;
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
    grid-template-columns: auto auto auto auto;
    grid-gap: 20px;
    background-color: #ffffff;
    padding: 20px;
}

.grid-container > div {
    background-color: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding: 20px 0;
    font-size: 30px;
}
.grid-item {
    border: #409eff solid 1px;
}
</style>