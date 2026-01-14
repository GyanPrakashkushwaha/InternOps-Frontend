<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-sky-200 selection:text-sky-900">
    <Sidebar 
      class="hidden md:flex w-72 flex-col border-r border-slate-200 bg-white"
      @new-chat="handleNewChat"
    />

    <main class="flex flex-1 flex-col relative overflow-hidden">
      <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse"></div>
          <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wide">InternOps Agent</h2>
        </div>
      </header>

      <ChatWindow :messages="messages" class="flex-1" />

      <div class="p-4 md:p-6 bg-slate-50">
        <div class="mx-auto max-w-3xl">
           <ChatInput @send-message="handleSendMessage" />
           <p class="mt-3 text-center text-xs text-slate-400">
             InternOps AI analyzes context against 50+ parameters.
           </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import ChatInput from './components/ChatInput.vue';

const messages = ref([
  { 
    id: 1, 
    role: 'ai', 
    text: "Hello! I've analyzed the 'GenAI Engineer' job description. Based on your uploaded resume, you have a **72% match**. Would you like to draft a cover letter or identify the missing keywords first?",
    timestamp: '10:00 AM'
  }
]);

const handleSendMessage = (text) => {
  // Add User Message
  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Mock AI Response (Delayed)
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: "I'm processing that request against the ATS strict mode parameters...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }, 1000);
};

const handleNewChat = () => {
  messages.value = [];
  // Reset logic here
};
</script>