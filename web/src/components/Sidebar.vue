<template>
  <aside>
    <div class="flex items-center gap-3 px-6 py-6">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-sky-500/20 text-white font-bold text-xl">
        IO
      </div>
      <div>
        <h1 class="text-lg font-bold text-slate-900 tracking-tight">InternOps</h1>
        <p class="text-xs font-medium text-slate-500">Smart Resume Filter</p>
      </div>
    </div>

    <div class="px-4 mb-6">
      <button 
        @click="$emit('new-chat')"
        class="group flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-sky-400 hover:text-sky-500 hover:shadow-md hover:-translate-y-0.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Analysis</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-4">
      <div class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Recent</div>
      <ul class="space-y-1">
        <li v-for="item in history" :key="item.id">
          <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <span class="truncate">{{ item.title }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="border-t border-slate-200 p-4">
      <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
        <div class="h-8 w-8 rounded-full bg-slate-200"></div>
        <div class="flex-1 overflow-hidden">
          <p class="truncate text-sm font-bold text-slate-700">User Account</p>
          <p class="truncate text-xs text-slate-500">Free Plan</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const history = ref([
  { id: 1, title: 'GenAI Engineer Intern' },
  { id: 2, title: 'Frontend Dev - Google' },
  { id: 3, title: 'Backend Lead - Amazon' },
]);
</script>