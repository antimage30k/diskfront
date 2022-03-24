<template>
    <el-avatar class="avatar-img" :size="128" fit="cover" :src="userAvatar" />
</template>
<script>
import { store } from './util.js'
export default {
    data() {
        return {
            userInfo: store.userInfo,
        }
    },
    computed: {
        userAvatar() {
            return this.userInfo.avatar ? this.userInfo.avatar : '/avatar/default-1.png';
        }
    },
    methods: {

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
</style>