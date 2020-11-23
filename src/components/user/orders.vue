<template>
    <div>
        orders
        <div>
            <el-table :data="comments" style="width:100%">
              <el-table-column prop="name" label="用户" width="200"></el-table-column>
              <el-table-column prop="time" label="发布时间" width="200" sortable></el-table-column>
              <el-table-column prop="comment" label="评论内容"></el-table-column>
            </el-table>
          </div>
    </div>
</template>