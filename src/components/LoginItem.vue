<template>
    <el-tabs type="card">
        <el-tab-pane label="Login">
            <el-form
                lable-position="top"
                label-width="100px"
                :model="form"
                style="max-width: 360px"
            >
                <el-form-item label="Name">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="form.password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="success" round @click="onLogin">Login</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="Register">
            <el-form
                lable-position="top"
                label-width="100px"
                :model="form"
                style="max-width: 360px"
            >
                <el-form-item label="Name">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="form.password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="onRegister">Register</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>import { ElMessage } from "element-plus"
import { jsonAjax, baseUrl } from "./util"


export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
        }
    },

    methods: {
        onRegister() {
            jsonAjax('POST', baseUrl + '/register', this.form, (res) => { ElMessage(res) });
        },
        onLogin() {
            jsonAjax('POST', baseUrl + '/login', this.form, (res) => { ElMessage(res) });
        },
    }
}
</script>
<style>
</style>