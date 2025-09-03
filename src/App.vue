<script setup>
import { ref, reactive } from 'vue';
import { generateJWT, buildRedirectUrl } from './utils/jwt.js';
import UrlModal from './components/UrlModal.vue';

// 響應式數據
const formData = reactive({
  targetUrl: 'https://example.com',
  userId: 'N100007965',
});

const errors = reactive({});
const isLoading = ref(false);
const generatedUrl = ref('');
const errorMessage = ref('');
const showModal = ref(false);

console.log(import.meta.env.VITE_PRIVATE_KEY);
console.log(import.meta.env.VITE_PUBLIC_KEY);

// 方法
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  // 驗證目標網站
  if (!formData.targetUrl) {
    errors.targetUrl = '請輸入目標網站 URL';
    isValid = false;
  } else if (!isValidUrl(formData.targetUrl)) {
    errors.targetUrl = '請輸入有效的 URL 格式';
    isValid = false;
  }

  // 驗證使用者 ID
  if (!formData.userId) {
    errors.userId = '請輸入使用者 ID';
    isValid = false;
  }

  return isValid;
};

const generateJWTAndRedirect = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  generatedUrl.value = '';

  try {
    // 生成 JWT
    const jwtToken = await generateJWT(formData.userId);

    // 構建跳轉 URL
    const redirectUrl = buildRedirectUrl(formData.targetUrl, jwtToken);
    generatedUrl.value = redirectUrl;
    showModal.value = true;

    // 延遲一下讓使用者看到生成的 URL，然後跳轉
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2000);
  } catch (error) {
    console.error('生成 JWT 時發生錯誤:', error);
    errorMessage.value = `生成 JWT 時發生錯誤: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">JWT 跨站測試</h2>
          <p class="text-gray-600 mb-8">輸入資訊生成 JWT 並跳轉到目標網站</p>
        </div>

        <form @submit.prevent="generateJWTAndRedirect" class="space-y-6">
          <!-- 目標網站 -->
          <div>
            <label for="targetUrl" class="block text-sm font-medium text-gray-700 mb-2">
              目標網站 URL
            </label>
            <input
              id="targetUrl"
              v-model="formData.targetUrl"
              type="url"
              placeholder="https://example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.targetUrl }"
            />
            <p v-if="errors.targetUrl" class="mt-1 text-sm text-red-600">
              {{ errors.targetUrl }}
            </p>
          </div>

          <!-- 使用者 ID -->
          <div>
            <label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
              使用者 ID
            </label>
            <input
              id="userId"
              v-model="formData.userId"
              type="text"
              placeholder="user-123"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.userId }"
            />
            <p v-if="errors.userId" class="mt-1 text-sm text-red-600">
              {{ errors.userId }}
            </p>
          </div>

          <!-- 提交按鈕 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              處理中...
            </span>
            <span v-else>生成 JWT 並跳轉</span>
          </button>
        </form>

        <!-- Modal 組件 -->
        <UrlModal :is-visible="showModal" :url="generatedUrl" @close="showModal = false" />

        <!-- 錯誤訊息 -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
