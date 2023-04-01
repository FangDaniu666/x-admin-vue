<template>
  <div>
    <div class="images">
      <div class="card-div" v-for="url in urls" :key="url">
        <el-row class="row-center">
          <el-card align="center" shadow="hover">
            <el-image :src="url" :preview-src-list="urls">
            </el-image>
            <div class="bottom clearfix">
              <el-button @click="downloadImage(url)" type="primary" class="button">下载</el-button>
            </div>
          </el-card>
        </el-row>
      </div>
    </div>

    <el-card class="pageCard" shadow="hover">
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="pageTotal"
                     v-model:current-page="pageNo"/>
    </el-card>

    <el-backtop></el-backtop>

  </div>
</template>

<script>
import imgsAPI from '@/api/imgsManager.js'
import download from "downloadjs";

export default {

  data() {
    return {
      urls: [],
      pageTotal: 30,
      pageNo: 1,

    }
  },
  methods: {
    getUserList() {
      imgsAPI.getImagsList(this.pageNo).then(response => {
        console.log(response.data.rows);
        for (let i = 0; i < response.data.rows.length; i++) {
          this.urls.push(response.data.rows[i].url);
        }
        this.pageTotal = response.data.total / 30 * 10
      });
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.urls = [];
      this.getUserList();
    },
    downloadImage(url) {
      download(url);
    },
  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style>
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 4px;
  float: right;
}

.el-image {
  width: 100%;
  height: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-div {
  width: 45%;
  margin-top: 8px;
  margin-right: 8px;
  margin-bottom: 8px;
  margin-left: 8px;
  padding: 5px;
}

.images {
  display: flex;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  flex-wrap: wrap;
  justify-content: center;

}

.pageCard {
  padding-left: 30%;

}

@media screen and (min-width: 220px) and (max-width: 600px) {
  .images {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

  }

  .pageCard {
    padding-left: 2%!important;
  }

  .el-card__body {
    padding: 0px;
  }

  .card-div {
    width: 45%;
    margin-top: 2px;
    margin-right: 2px;
    margin-bottom: 2px;
    margin-left: 2px;
    padding: 2px;
  }

  .bottom {
    margin-top: 2px;
    line-height: 2px;
  }

  .button {
    padding: 1px;
    float: right;
  }

}
</style>
