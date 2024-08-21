<template>
  <a-watermark class="page_main" content="图床" :alpha="0.1">
    <header>
      <h1>图床</h1>
      <div>
        <p>1. Telegraph 匿名发布平台存储图片内容, 单图5MB, 无限图片储存数量。</p>
        <p>2. WordPress 托管的图片内容, 缓存图片, 无需购买服务器。</p>
        <p>3. Cloudflare 静态网站托管, 全球CDN加速, 免费二级域名无需购买域名。</p>
      </div>
    </header>
    <main>
      <a-upload draggable :action="ACTION_API" multiple :show-link="false" :image-preview="true"
        :show-remove-button="false" accept=".png,.jpg,.jpeg,.gif" :on-before-upload="checkImageSizeFn"
        @success="scrollToBottom">
        <template #upload-item="item">
          <div class="vh-img-item" :key="item.fileItem.uid">
            <a-image class="vh_img_val" :src="item.fileItem.response ?? item.fileItem.url" />
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
      <div v-if="history.length > 0">
        <div class="history-title">
          <h3>历史上传</h3>
          <div @click="clearAllHistory" class="clear-all">全部删除</div>
        </div>
        <div class="arco-upload-list">
          <div v-for="item in history" class="vh-img-item" :key="item.uid">
            <img class="vh_img_val" :src="item.response" />
            <div class="vh_img_text" v-if="item.status == 'uploading'">
              <a-skeleton :animation="true">
                <a-space direction="vertical" :style="{ width: '100%' }" size="mini">
                  <a-skeleton-line :rows="2" />
                </a-space>
              </a-skeleton>
            </div>
            <div class="vh_img_text with_value" v-else>
              <section>
                <a-input :error="item.response == 'Failed'" :default-value="item.response" readonly size="mini"
                  @click="item.response != 'Failed' && copyStr(item.response)">
                  <template #append v-if="item.response != 'Failed'">URL</template>
                </a-input>
                <a-input :error="item.response == 'Failed'" :default-value="`![${item.name}](${item.response})`"
                  readonly size="mini"
                  @click="item.response != 'Failed' && copyStr(`![${item.name}](${item.response})`)">
                  <template #append v-if="item.response != 'Failed'">Markdown</template>
                </a-input>
              </section>
              <a-popover title="图片二维码">
                <qrcode-vue class="qr" :value="item.response" :size="56" level="H" />
                <template #content>
                  <qrcode-vue class="qr" :value="item.response" :size="166" level="H" />
                </template>
              </a-popover>
            </div>
            <div @click="deleteItem(item)" class="delete_icon">删除</div>
          </div>
        </div>
      </div>
    </main>
  </a-watermark>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import QrcodeVue from 'qrcode.vue'
const ACTION_API = import.meta.env.VITE_IMG_API_URL;
const STORE_KEY = 'imgList';

const history = ref(JSON.parse(localStorage.getItem(STORE_KEY) || '[]'));

// 检查图片大小
const checkImageSizeFn = (file: any) => {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    Message.error(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`);
    return false;
  }
  return true;
}

const deleteItem = (item: any) => {
  const index = history.value.findIndex((v: any) => v.uid == item.uid);
  if (index > -1) {
    history.value.splice(index, 1);
    localStorage.setItem(STORE_KEY, JSON.stringify(history.value));
  }
}

const clearAllHistory = () => {
  history.value = [];
  localStorage.setItem(STORE_KEY, JSON.stringify(history.value));
}

const handSaveLocalStorage = (item: any) => {
  localStorage.setItem(STORE_KEY, JSON.stringify([...JSON.parse(localStorage.getItem(STORE_KEY) || '[]'), item]));
}

// 复制返回地址
const copyStr = async (v: string) => {
  try {
    await navigator.clipboard.writeText(v);
    Message.success('复制成功');
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = v;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    Message.success('复制成功');
  }
}

// 上传完毕滚动到最下面
const scrollToBottom = (item: any) => {
  handSaveLocalStorage(item);
  nextTick(() => {
    const imgListDom: any = document.querySelector('.arco-upload-list');
    imgListDom.scrollTo({ top: imgListDom.scrollHeight, behavior: "smooth" });
  })
}
</script>
<style scoped lang="less">
@import './assets/less/main.less';
</style>
