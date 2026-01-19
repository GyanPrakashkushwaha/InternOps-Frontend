<script setup>
import { ref, nextTick, watch } from 'vue';

// State
const messageInput = ref('');
const chatContainer = ref(null);
const isTyping = ref(false);

const messages = ref([
  { 
    id: 1, 
    sender: 'ai', 
    text: 'I noticed the candidate lacks concrete metrics in the "Hiring Manager" section. Would you like me to generate some interview questions to probe this?' 
  },
  { 
    id: 2, 
    sender: 'user', 
    text: 'Yes, please focus on Python performance metrics.' 
  },
]);

// Helper: Scroll to bottom
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Watcher: Trigger scroll whenever messages change
watch(messages, scrollToBottom, { deep: true });

const sendMessage = async () => {
  const content = messageInput.value.trim();
  if (!content || isTyping.value) return;

  // 1. Add User Message
  messages.value.push({ 
    id: Date.now(), 
    sender: 'user', 
    text: content 
  });
  
  messageInput.value = '';
  isTyping.value = true; 

  // 2. Simulate AI Network Request
  setTimeout(() => {
    isTyping.value = false;
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      text: 'Creating questions focused on memory management and Big O notation...'
    });
  }, 1500);
};
</script>

<template>
  <aside class="flex flex-col w-146 h-170 max-h-dvh bg-[#0f172a] border-l border-slate-700/50 shadow-xl">
    
    <div class="p-5 border-b border-slate-700/50 bg-[#0f172a] z-10 shrink-0">
      <h2 class="text-lg font-semibold text-white tracking-tight flex items-center gap-2.5">
        <span class="text-2xl">🤖</span> 
        <div>
          AI Assistant
          <p class="text-[11px] font-normal text-slate-400 leading-none mt-0.5">Context-aware coaching</p>
        </div>
      </h2>
    </div>

    <div 
      ref="chatContainer"
      class="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex gap-3 animate-fade-in"
        :class="msg.sender === 'user' ? 'flex-row-reverse' : ''"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-white/10 shadow-sm"
          :class="msg.sender === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'"
        >
          {{ msg.sender === 'ai' ? 'AI' : 'ME' }}
        </div>

        <div 
          class="max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
          :class="msg.sender === 'ai' 
            ? 'bg-[#1e293b] text-slate-200 rounded-tl-none border border-slate-700/50' 
            : 'bg-indigo-600 text-white rounded-tr-none'"
        >
          {{ msg.text }}
        </div>
      </div>

      <div v-if="isTyping" class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 opacity-50">AI</div>
        <div class="bg-[#1e293b] border border-slate-700/50 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-10">
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
        </div>
      </div>
    </div>

    <div class="p-6 border-t border-slate-700/50 bg-[#0f172a] shrink-0">
      <div class="relative group">
        <input 
          v-model="messageInput"
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="Ask about this candidate..." 
          class="w-full bg-[#1e293b] border border-slate-700 text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-slate-500 transition-all shadow-inner"
        />
        
        <button 
          @click="sendMessage"
          :disabled="!messageInput.trim()"
          aria-label="Send message"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
          :class="messageInput.trim() 
            ? 'text-indigo-400 hover:text-white hover:bg-indigo-600 shadow-lg' 
            : 'text-slate-600 cursor-not-allowed'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.delay-75 { animation-delay: 75ms; }
.delay-150 { animation-delay: 150ms; }
</style>