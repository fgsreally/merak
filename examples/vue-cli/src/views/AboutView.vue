<script setup lang="ts">
import { ref } from 'vue'
const dialogVisible = ref(false)
const value = ref('')
const options = [
  {
    value: '选项1',
    label: '黄金糕',
  },
  {
    value: '选项2',
    label: '双皮奶',
  },
  {
    value: '选项3',
    label: '蚵仔煎',
  },
  {
    value: '选项4',
    label: '龙须面',
  },
  {
    value: '选项5',
    label: '北京烤鸭',
  },
]
</script>

<template>
  <div>
    <div class="content">
      <p>弹窗无需子应用做任何处理就可使用</p>
      <h3>1、打开弹窗</h3>
      <p>
        <el-button @click="dialogVisible = true" data-testid="modal-btn">
          点击打开el-dialog
        </el-button>

      </p>
      <h3>2、打开选择器</h3>
      <p>
        <el-select v-model="value" placeholder="el-select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
       
      </p>
      <h3>3、打开气泡卡片</h3>
      <p>
        <el-popover
          placement="top-start"
          title="Title"
          :width="200"
          trigger="hover"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <el-button>el-popover hover 激活</el-button>
          </template>
        </el-popover>

      </p>
      <!-- <h3>4、手动向body中append弹窗</h3>
      <p>
        <AppendBody />
      </p> -->
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" >Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false" data-testid="modal-content">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<style>
:root {
  --host-color: #0239d0;
}
</style>
