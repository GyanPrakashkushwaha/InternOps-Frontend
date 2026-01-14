<template>
  <div class="relative rounded-2xl bg-white p-2 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 transition-shadow focus-within:shadow-2xl focus-within:shadow-sky-500/10 focus-within:ring-sky-500/50">
    <div class="flex items-center gap-2 border-b border-slate-100 px-2 pb-2 mb-2">
       <button class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-sky-500" title="Upload Resume">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
       </button>
    </div>

    <div class="flex items-end gap-2 pr-2">
      <textarea
        v-model="input"
        @keydown.enter.prevent="send"
        placeholder="Ask InternOps to analyze gaps in your resume..."
        rows="1"
        class="max-h-32 min-h-[44px] w-full resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
        style="field-sizing: content;" 
      ></textarea>

      <button 
        @click="send"
        :disabled="!input.trim()"
        class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-105 hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['send-message']);
const input = ref('');

const send = () => {
  if (!input.value.trim()) return;
  emit('send-message', input.value);
  input.value = '';
};
</script>