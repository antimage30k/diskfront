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
                    <el-input v-model="form.password" type="password" />
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
                status-icon
                :model="form"
                :rules="rules"
                ref="ruleFormRef"
                style="max-width: 360px"
            >
                <el-form-item label="Name" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Confirm" prop="repeatPass">
                    <el-input v-model="form.repeatPass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="onRegister">Register</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { ElMessage } from "element-plus"
import { jsonAjax, store, setUser, logout, validatePassword, validateUsername, log } from "./util"
import { BaseUrl } from "./constants"
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
                repeatPass: '',
            },
            userInfo: store.userInfo,
            rules: {
                username: [{ required: true, message: 'Please input username', trigger: 'blur' },
                { validator: this.validateName, trigger: 'blur' }],
                password: [{ validator: this.validatePass, trigger: 'blur' }],
                repeatPass: [{ validator: this.confirmPass, trigger: 'blur' }],
            }
        }
    },

    methods: {
        onRegister() {
            if (!this.$refs.ruleFormRef) {
                return;
            }
            this.$refs.ruleFormRef.validate((result) => {
                if (result) {
                    jsonAjax('POST', BaseUrl + '/api/register', this.form, (res) => {
                        ElMessage.success(res.message);
                    });
                }
            });

        },
        onLogin() {
            jsonAjax('POST', BaseUrl + '/api/login', this.form, (res) => {
                ElMessage.success(res.message);
                setUser(res.data);
                this.$emit('close-login-dialog');
            });
        },
        validateName(rule, value, callback) {
            if (!validateUsername(value)) {
                callback(new Error('Invalid Username'))
            } else {
                callback();
            }
        },
        validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input Password'))
            } else if (!validatePassword(value)) {
                callback(new Error('Invalid Password'));
            } else { callback(); }
        },
        confirmPass(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input the password again'));
            } else if (value !== this.form.password) {
                callback(new Error("Two inputs don't match!"));
            } else {
                callback();
            }
        },
    },
}
</script>
<style>
</style>