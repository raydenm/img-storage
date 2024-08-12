<template>
  <a-watermark class="page_main" content="图床" :alpha="0.1">
    <header>
      <h1>Img Storage</h1>
    </header>
    <main>
      <a-upload draggable :action="ACTION_API" multiple :show-link="false" :image-preview="true"
        :show-remove-button="false" accept=".png,.jpg,.jpeg,.gif" :on-before-upload="checkImageSizeFn"
        @success="scrollToBottom">
        <template #upload-item="item">
          <div class="vh-img-item" :key="item.fileItem.uid">
            <a-image class="vh_img_val" :src="item.fileItem.url" />
            <div class="vh_img_text" v-if="item.fileItem.status == 'uploading'">
              <a-skeleton :animation="true">
                <a-space direction="vertical" :style="{ width: '100%' }" size="mini">
                  <a-skeleton-line :rows="2" />
                </a-space>
              </a-skeleton>
            </div>
            <div class="vh_img_text with_value" v-else>
              <section>
                <a-input :error="item.fileItem.response == 'Failed'" :default-value="item.fileItem.response" readonly
                  size="mini" @click="item.fileItem.response != 'Failed' && copyStr(item.fileItem.response)">
                  <template #append v-if="item.fileItem.response != 'Failed'">URL</template>
                </a-input>
                <a-input :error="item.fileItem.response == 'Failed'"
                  :default-value="`![${item.fileItem.name}](${item.fileItem.response})`" readonly size="mini"
                  @click="item.fileItem.response != 'Failed' && copyStr(`![${item.fileItem.name}](${item.fileItem.response})`)">
                  <template #append v-if="item.fileItem.response != 'Failed'">Markdown</template>
                </a-input>
              </section>
              <a-popover title="图片二维码">
                <qrcode-vue class="qr" :value="item.fileItem.response" :size="56" level="H" />
                <template #content>
                  <qrcode-vue class="qr" :value="item.fileItem.response" :size="166" level="H" />
                </template>
              </a-popover>
            </div>
          </div>
        </template>
      </a-upload>
    </main>
  </a-watermark>
</template>
<script setup lang="ts">
import { nextTick } from 'vue'
import { Message } from '@arco-design/web-vue'
import QrcodeVue from 'qrcode.vue'
const ACTION_API = import.meta.env.VITE_IMG_API_URL;


// 检查图片大小
const checkImageSizeFn = (file: any) => {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    Message.error(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`);
    return false;
  }
  return true;
}

// 复制返回地址
const copyStr = async (v: any) => {
  try {
    await navigator.clipboard.writeText(v);
  } catch (error) {
    const i = document.createElement("textarea");
    i.value = v;
    document.body.appendChild(i);
    i.select();
    document.body.removeChild(i);
  }
  Message.success('Copy Success')
}

// 上传完毕滚动到最下面
const scrollToBottom = () => {
  nextTick(() => {
    const imgListDom: any = document.querySelector('.arco-upload-list');
    imgListDom.scrollTo({ top: imgListDom.scrollHeight, behavior: "smooth" });
  })
}
</script>
<style scoped lang="less">
@import './assets/less/main.less';
</style>
