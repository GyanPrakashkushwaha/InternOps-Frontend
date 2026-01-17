<script setup>
import { ref } from 'vue';

const messageInput = ref('');
const messages = ref([
  { id: 1, sender: 'ai', text: 'I noticed the candidate lacks concrete metrics in the "Hiring Manager" section. Would you like me to generate some interview questions to probe this?' },
  { id: 2, sender: 'user', text: 'Yes, please focus on Python performance metrics.' },
]);

const sendMessage = () => {
  if (!messageInput.value.trim()) return;
  messages.value.push({ id: Date.now(), sender: 'user', text: messageInput.value });
  messageInput.value = '';
};
</script>

<template>
  <aside class="hidden lg:flex flex-col w-96 h-full bg-[#0f172a] border-l border-slate-700/50">
    <div class="p-6 border-b border-slate-700/50 bg-[#0f172a]">
      <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <span>🤖</span> AI Assistant
      </h2>
      <p class="text-xs text-slate-500 mt-1">Context-aware coaching</p>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex gap-3"
        :class="msg.sender === 'user' ? 'flex-row-reverse' : ''"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          :class="msg.sender === 'ai' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'"
        >
          {{ msg.sender === 'ai' ? 'AI' : 'ME' }}
        </div>
        <div 
          class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed"
          :class="msg.sender === 'ai' ? 'bg-[#1e293b] text-slate-300 rounded-tl-none border border-slate-700/50' : 'bg-indigo-600 text-white rounded-tr-none'"
        >
          {{ msg.text }}
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-slate-700/50 bg-[#0f172a]">
      <div class="relative">
        <input 
          v-model="messageInput"
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="Ask about this candidate..." 
          class="w-full bg-[#1e293b] border border-slate-700 text-slate-200 text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500 transition-all"
        />
        <button 
          @click="sendMessage"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
        >
          ➤
        </button>
      </div>
    </div>
  </aside>
</template>