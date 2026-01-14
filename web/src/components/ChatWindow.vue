<template>
  <div class="w-full overflow-y-auto px-4 py-6 md:px-8">
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
      
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :class="['flex w-full gap-4', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']"
      >
        <div 
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
          :class="msg.role === 'ai' ? 'bg-white border border-slate-100' : 'bg-slate-200'"
        >
          <span v-if="msg.role === 'ai'" class="text-lg">⚡️</span>
          <span v-else class="text-xs font-bold text-slate-600">ME</span>
        </div>

        <div 
          class="relative max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm"
          :class="[
            msg.role === 'user' 
              ? 'bg-gradient-to-br from-emerald-500 to-sky-500 text-white rounded-tr-sm shadow-sky-500/20' 
              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
          ]"
        >
          <div class="prose prose-slate prose-sm max-w-none prose-p:my-0 prose-ul:my-2 prose-li:my-0" :class="{ 'text-white prose-invert': msg.role === 'user' }">
             {{ msg.text }}
          </div>
          
          <div 
            class="mt-2 text-[10px] opacity-70" 
            :class="msg.role === 'user' ? 'text-right text-sky-100' : 'text-slate-400'"
          >
            {{ msg.timestamp }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  messages: {
    type: Array,
    required: true
  }
});
</script>