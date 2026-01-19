<script setup>
import { ref, onMounted } from 'vue';
import { fetchAnalysisHistory } from '../api'
import { useRouter, useRoute } from "vue-router"

// const historyItems = ref([
//   { id: '1024', role: 'Backend Engineer', company: 'Google', date: '2m ago', status: 'MAYBE',  },
//   { id: '1023', role: 'Frontend Lead', company: 'Netflix', date: '1h ago', status: 'PASS', color: 'text-emerald-400' },
//   { id: '1022', role: 'DevOps Engineer', company: 'Amazon', date: '1d ago', status: 'FAIL', color: 'text-rose-400' },
//   { id: '1021', role: 'Data Scientist', company: 'Meta', date: '2d ago', status: 'PASS', color: 'text-emerald-400' },
// ]);

const historyItems = ref([])
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  historyItems.value = await fetchAnalysisHistory()
})

function analysisReport(id){
  router.push(`${id}`)
  // console.log(id)
}

</script>

<template>
  <aside class="md:flex flex-col w-100 h-170 bg-[#0f172a] border-r border-slate-700/50">
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
        @click="() => analysisReport(item.id)"
      >
        <div class="flex justify-between items-start mb-1">
          <span class="text-xs font-mono text-slate-500">#{{ item.id }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider" :class="item.color">{{ item.status || 'FAIL'}}</span>
        </div>
        <h3 class="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{{ item.company }}</h3>
        <p class="text-xs text-slate-400">{{ item.role }}</p>
        
        <div :class="{'ring-1 ring-indigo-500': item.id == route.params.id}"></div>
      </div>
    </div>
  </aside>
</template>