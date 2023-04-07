<template>
    <div>
        功能1:二维码生成小工具
        <hr>
        <el-card class="box-card" shadow="hover" >
            <el-col :span="12" >
                <el-input v-model="urls" placeholder="网址"></el-input>
                <el-button @click="createQRCode" type="primary" round icon="el-icon-search">生成</el-button>
            </el-col>
        </el-card>
        <img :src="url" width="350">
    </div>
</template>

<script>
export default {
    data() {
        return {
            res: "http://192.168.0.102:1146/function/getQrCode?url=",
            urls: "",
            url: "",
        }
    },
    methods: {
        createQRCode() {
            this.url = this.res + this.urls;
        }
    },
}
</script>

<style>
.box-card .el-input {
    margin-right: 1%;
    width: 300px;
    padding-bottom: 4%;
}
</style>
