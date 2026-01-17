<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('')
const activeTab = ref('ALL') 

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Hired', value: 'HIRE' },
  { label: 'Rejected', value: 'NO_HIRE' },
  { label: 'Pending', value: 'MAYBE' }
]

const getStatusStyles = (status) => {
  if (!status) return 'bg-slate-700 text-slate-400';
  switch (status.toLowerCase()) {
    case 'hire': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
    case 'no_hire':
    case 'reject': return 'bg-rose-500/10 text-rose-400 ring-rose-500/20';
    case 'maybe':
    case 'pending': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20';
    default: return 'bg-slate-700 text-slate-400 ring-slate-600';
  }
}

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-rose-400';
}

const data = [
      { "id": 8, "date": "2026-01-10T19:07:51.533092+05:30", "jdsnippet": "iption Job title- Data Science & AI", "strategy": "real-world", "atsscore": 97, "recruiterscore": 85, "careerprogressionscore": 92, "techdepthscore": 93, "status": "HIRE" },
      { "id": 43, "date": "2026-01-10T19:35:59.905787+05:30", "jdsnippet": "iption Job title:.. Data Science & ", "strategy": "strict", "atsscore": 82, "recruiterscore": 90, "careerprogressionscore": 92, "techdepthscore": 93, "status": "NO_HIRE" },
      { "id": 44, "date": "2026-01-11T13:54:55.726474+05:30", "jdsnippet": "cription\r\nJob Title: Data Science &", "strategy": "strict", "atsscore": 88, "recruiterscore": 90, "careerprogressionscore": 90, "techdepthscore": 88, "status": "NO_HIRE" },
      { "id": 45, "date": "2026-01-11T13:59:51.106210+05:30", "jdsnippet": "escription\r\nJob Title: Data Science", "strategy": "brutal", "atsscore": 92, "recruiterscore": 95, "careerprogressionscore": 92, "techdepthscore": 98, "status": "HIRE" },
      { "id": 46, "date": "2026-01-11T19:52:42.528688+05:30", "jdsnippet": "escription: \r\nJob Title: Data Scien", "strategy": "brutal", "atsscore": 90, "recruiterscore": 90, "careerprogressionscore": 80, "techdepthscore": 90, "status": "HIRE" },
      { "id": 47, "date": "2026-01-11T21:18:10.371399+05:30", "jdsnippet": "escription:- \r\nJob Title: Data Scie", "strategy": "brutal", "atsscore": 92, "recruiterscore": 95, "careerprogressionscore": 88, "techdepthscore": 92, "status": "HIRE" },
      { "id": 54, "date": "2026-01-11T21:55:14.814906+05:30", "jdsnippet": "\n  Job Description                 ", "strategy": "real-world", "atsscore": 93, "recruiterscore": 95, "careerprogressionscore": 95, "techdepthscore": 90, "status": "HIRE" },
      { "id": 67, "date": "2026-01-15T21:56:42.138474+05:30", "jdsnippet": " internship\r\nPerilabs is looking fo", "strategy": "real-world", "atsscore": 88, "recruiterscore": 90, "careerprogressionscore": 50, "techdepthscore": 65, "status": "MAYBE" },
]

const filteredData = computed(() => {
  return data.filter(item => {
    const matchesTab = activeTab.value === 'ALL' || item.status === activeTab.value;
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = (item.jdsnippet || '').toLowerCase().includes(query) || (item.strategy || '').toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });
});
</script>

<template>
    <div class="h-screen overflow-y-auto bg-[#0f172a] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-300">
        
        <div class="max-w-7xl mx-auto mb-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
                <h1 class="text-2xl font-bold text-white tracking-tight">Application Tracker</h1>
                <p class="mt-1 text-sm text-slate-400">Overview of your current job application pipeline.</p>
            </div>
            
        </div>

        <div class="max-w-7xl mx-auto mb-6 sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-sm py-4 border-b border-slate-800/50">
            <div class="flex items-center justify-between gap-4">
                
                <div class="relative flex-1 group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input 
                        v-model="searchQuery"
                        type="text" 
                        placeholder="Search..." 
                        class="block w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent sm:text-sm transition-all shadow-lg"
                    >
                </div>

                <div class="flex-shrink-0 flex items-center bg-[#1e293b] p-1 rounded-lg border border-slate-700 shadow-md">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.value"
                        @click="activeTab = tab.value"
                        class="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200"
                        :class="activeTab === tab.value 
                            ? 'bg-[#38bdf8] text-slate-900 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'"
                    >
                        {{ tab.label }}
                    </button>
                </div>

            </div>
        </div>

        <div class="max-w-7xl mx-auto bg-[#1e293b] rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
            <div class="overflow-x-auto min-h-[400px]">
                <table class="min-w-full divide-y divide-slate-700">
                    <thead class="bg-[#0f172a]/50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 sm:pl-6">Date</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Job Role / Snippet</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Strategy</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 bg-slate-800/30">Screening Analysis</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-indigo-300 bg-indigo-500/5 border-l border-slate-700/50">Deep Dive Metrics</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Action</span></th>
                        </tr>
                    </thead>
                    
                    <tbody class="divide-y divide-slate-700 bg-[#1e293b]">
                        <tr v-if="filteredData.length === 0">
                            <td colspan="7" class="py-16 text-center">
                                <p class="text-slate-500 italic mb-2">No applications match your search.</p>
                                <button @click="searchQuery = ''; activeTab = 'ALL'" class="text-[#38bdf8] text-xs font-bold hover:underline">Clear Filters</button>
                            </td>
                        </tr>

                        <tr v-for="(item, index) in filteredData" :key="item.id" class="hover:bg-slate-700/50 transition-colors duration-150 group">
                            
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                                <div class="flex flex-col">
                                    <span class="font-bold text-slate-300 group-hover:text-white transition-colors">
                                        {{ new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                                    </span>
                                    <span class="text-xs text-slate-500 font-mono mt-0.5">
                                        {{ new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                                    </span>
                                </div>
                            </td>

                            <td class="whitespace-nowrap px-3 py-4 text-sm">
                                <div class="font-medium text-white max-w-[200px] truncate" :title="item.jdsnippet">
                                    {{ item.jdsnippet }}
                                </div>
                            </td>

                            <td class="whitespace-nowrap px-3 py-4 text-sm">
                                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                                    {{ item.strategy }}
                                </span>
                            </td>

                            <td class="whitespace-nowrap px-3 py-4 text-sm text-center bg-slate-800/30">
                                <div class="flex items-center justify-center gap-2">
                                    <div class="flex flex-col items-center bg-[#0f172a] rounded px-2.5 py-1.5 min-w-[50px] border border-slate-700/50">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">ATS</span>
                                        <span class="text-sm font-bold" :class="getScoreColor(item.atsscore)">{{ item.atsscore }}</span>
                                    </div>
                                    <div class="flex flex-col items-center bg-[#0f172a] rounded px-2.5 py-1.5 min-w-[50px] border border-slate-700/50">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Rec</span>
                                        <span class="text-sm font-bold text-slate-200">{{ item.recruiterscore }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="whitespace-nowrap px-3 py-4 text-sm text-center bg-indigo-500/5 border-l border-slate-700/50">
                                <div class="flex items-center justify-center gap-2">
                                    <div class="flex flex-col items-center bg-indigo-950/30 rounded px-2.5 py-1.5 min-w-[50px] border border-indigo-500/20">
                                        <span class="text-[10px] text-indigo-400/70 font-bold uppercase tracking-wider mb-0.5">Tech</span>
                                        <span class="text-sm font-bold text-indigo-300">{{ item.techdepthscore }}</span>
                                    </div>
                                    <div class="flex flex-col items-center bg-amber-950/20 rounded px-2.5 py-1.5 min-w-[50px] border border-amber-500/20">
                                        <span class="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider mb-0.5">Fit</span>
                                        <span class="text-sm font-bold text-amber-400">{{ item.careerprogressionscore }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="whitespace-nowrap px-3 py-4 text-sm">
                                <span 
                                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wide"
                                    :class="getStatusStyles(item.status)"
                                >
                                    {{ item.status.replace('_', ' ') }}
                                </span>
                            </td>

                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button class="text-[#38bdf8] hover:text-sky-300 transition-colors cursor-pointer uppercase text-xs tracking-wider font-bold">
                                    View
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
             <div class="bg-[#0f172a]/30 px-4 py-3 border-t border-slate-700 sm:px-6 flex justify-between items-center">
                 <p class="text-xs text-slate-500">
                    Showing <span class="font-bold text-slate-300">{{ filteredData.length }}</span> applications
                </p>
            </div>
        </div>
    </div>
</template>

<style>
/* CSS Reset for scrolling */
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; 
  background-color: #0f172a;
}
::-webkit-scrollbar { width: 4px; height: 8px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #64748b; }
</style>