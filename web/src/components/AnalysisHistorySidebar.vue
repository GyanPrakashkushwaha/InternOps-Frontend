<script setup>
import { ref } from 'vue';

const historyItems = ref([
  { id: '1024', role: 'Backend Engineer', company: 'Google', date: '2m ago', status: 'MAYBE', color: 'text-amber-400' },
  { id: '1023', role: 'Frontend Lead', company: 'Netflix', date: '1h ago', status: 'PASS', color: 'text-emerald-400' },
  { id: '1022', role: 'DevOps Engineer', company: 'Amazon', date: '1d ago', status: 'FAIL', color: 'text-rose-400' },
  { id: '1021', role: 'Data Scientist', company: 'Meta', date: '2d ago', status: 'PASS', color: 'text-emerald-400' },
]);
</script>

<template>
  <aside class="hidden md:flex flex-col w-80 h-full bg-[#0f172a] border-r border-slate-700/50">
    <div class="p-6 border-b border-slate-700/50">
      <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <span>📂</span> History
      </h2>
      <p class="text-xs text-slate-500 mt-1">Recent analysis reports</p>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div 
        v-for="item in historyItems" 
        :key="item.id"
        class="group p-4 rounded-xl bg-[#1e293b] border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
        :class="{'ring-1 ring-indigo-500': item.id === '1024'}"
      >
        <div class="flex justify-between items-start mb-1">
          <span class="text-xs font-mono text-slate-500">#{{ item.id }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider" :class="item.color">{{ item.status }}</span>
        </div>
        <h3 class="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{{ item.role }}</h3>
        <p class="text-xs text-slate-400">{{ item.company }}</p>
        
        <div v-if="item.id === '1024'" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
      </div>
    </div>
  </aside>
</template>