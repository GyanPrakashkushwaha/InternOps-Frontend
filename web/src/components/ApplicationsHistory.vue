<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { fetchHistory } from '../api'

const searchQuery = ref('')
const activeTab = ref('ALL') 
const data = ref([])
const router = useRouter()

const tabs = [
  { label: 'All Applications', value: 'ALL' },
  { label: 'Hired', value: 'HIRE' },
  { label: 'Rejected', value: null },
  { label: 'Pending', value: 'MAYBE' }
]

onMounted(async () => {
    data.value = await fetchHistory()
    console.log(data.value)
})
// --- UTILITIES ---

const getStatusStyles = (status) => {
    if (!status) return 'bg-slate-700/50 text-slate-400 border-slate-600';
    switch (status.toLowerCase()) {
    case 'hire': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    case null:
    case 'reject': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'maybe':
    case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default: return 'bg-slate-700/50 text-slate-400 border-slate-600';
  }
}

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 font-bold';
    if (score >= 75) return 'text-amber-400 font-semibold';
    return 'text-rose-400 font-medium';
}

function goToAnalysis(id){
    router.push(`/analysis/${id}`)
}

const formatDate = (dateString) => {
    if (!dateString) return { date: '--', time: '--' };
    const d = new Date(dateString);
    return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
}

// Format array to comma-separated string for display
const arrayToString = (arr) => {
    if (Array.isArray(arr)) return arr.join(', ');
    return '';
}

// --- COMPUTED ---

const filteredData = computed(() => {
  return data.value.filter(item => {
    const matchesTab = activeTab.value === 'ALL' || item.status === activeTab.value;
    const query = searchQuery.value.toLowerCase();
    
    // Updated Search: Uses the new rich DB fields
    // Checks: Job Title, Company, Location, Strategy/Mode, Status, or Required Skills
    const jobTitle = (item.job_title || '').toLowerCase();
    const company = (item.company_name || '').toLowerCase();
    const location = (item.location || '').toLowerCase();
    const strategy = (item.mode || item.strategy || '').toLowerCase();
    const skills = arrayToString(item.required_skills).toLowerCase();

    const matchesSearch = 
        jobTitle.includes(query) || 
        company.includes(query) ||
        location.includes(query) ||
        strategy.includes(query) ||
        skills.includes(query) ||
        (item.status || '').toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });
});
</script>

<template>
    <div class="h-screen flex flex-col bg-[#0f172a] font-sans text-slate-300">
        
        <header class="flex-none bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/60 z-30 sticky top-0">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div class="relative w-full sm:max-w-md group">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            placeholder="Search role, company, skills..." 
                            class="block w-full pl-10 pr-4 py-2.5 bg-[#1e293b]/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:border-[#38bdf8] sm:text-sm transition-all shadow-lg"
                        >
                    </div>

                    <div class="flex items-center bg-[#1e293b] p-1 rounded-lg border border-slate-700/60 shadow-sm overflow-x-auto max-w-full">
                        <button 
                            v-for="tab in tabs" 
                            :key="tab.value"
                            @click="activeTab = tab.value"
                            class="whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ease-out"
                            :class="activeTab === tab.value 
                                ? 'bg-[#38bdf8] text-slate-900 shadow-md transform scale-105' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'"
                        >
                            {{ tab.label }}
                        </button>
                    </div>

                </div>
            </div>
        </header>

        <main class="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
            <div class="max-w-7xl mx-auto h-full flex flex-col bg-[#1e293b]/40 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm overflow-hidden">
                
                <div class="flex-1 overflow-auto custom-scrollbar">
                    <table class="min-w-full divide-y divide-slate-700/50">
                        <thead class="bg-[#1e293b] sticky top-0 z-20 shadow-sm">
                            <tr>
                                <th scope="col" class="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Applied</th>
                                <th scope="col" class="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Role & Company</th>
                                <th scope="col" class="px-3 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">ATS / Keywords</th>
                                <th scope="col" class="px-3 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 border-l border-slate-700/50">Tech / Fit</th>
                                <th scope="col" class="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th scope="col" class="relative py-4 pl-3 pr-6"><span class="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        
                        <tbody class="divide-y divide-slate-700/50 bg-transparent">
                            <tr v-if="filteredData.length === 0">
                                <td colspan="6" class="py-20 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p class="text-slate-400 font-medium">No matches found</p>
                                        <button @click="searchQuery = ''; activeTab = 'ALL'" class="mt-2 text-[#38bdf8] text-xs font-bold hover:underline">Reset Filters</button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-for="item in filteredData" :key="item.id" class="group hover:bg-[#1e293b] transition-colors duration-150">
                                
                                <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm align-top">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-slate-200 group-hover:text-white transition-colors">
                                            {{ formatDate(item.created_at || item.date).date }}
                                        </span>
                                        <span class="text-[11px] text-slate-500 font-mono mt-0.5">
                                            {{ formatDate(item.created_at || item.date).time }}
                                        </span>
                                        <div class="mt-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-400 border border-slate-700/80">
                                                {{ item.mode || item.strategy || 'N/A' }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-3 py-4 text-sm max-w-[280px] align-top">
                                    <div class="flex flex-col gap-1">
                                        <div class="font-semibold text-white text-base truncate" :title="item.job_title">
                                            {{ item.job_title || 'Unknown Role' }}
                                        </div>
                                        
                                        <div class="flex items-center text-slate-400 text-xs gap-1.5 truncate">
                                            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span class="font-medium text-slate-300">{{ item.company_name || 'Unknown Co.' }}</span>
                                            <span v-if="item.location" class="text-slate-600">•</span>
                                            <span v-if="item.location">{{ item.location }}</span>
                                        </div>

                                        <div class="flex flex-wrap gap-2 mt-1">
                                            <span v-if="item.salary_range" class="text-[10px] text-emerald-400/80 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                {{ item.salary_range }}
                                            </span>
                                            <span v-if="item.work_mode" class="text-[10px] text-indigo-400/80 bg-indigo-900/20 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                                {{ item.work_mode }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-3 py-4 text-sm align-top">
                                    <div class="flex flex-col items-center gap-2">
                                        <div class="text-center min-w-[40px]">
                                            <div class="text-[10px] text-slate-500 uppercase font-bold">ATS Match</div>
                                            <div class="text-base" :class="getScoreColor(item.match_score || item.atsscore)">
                                                {{ item.match_score || item.atsscore || 0 }}%
                                            </div>
                                        </div>
                                        
                                        <div v-if="item.missing_keywords && item.missing_keywords.length > 0" class="flex flex-col items-center">
                                            <div class="text-[10px] text-rose-400 font-medium flex items-center gap-1 bg-rose-900/10 px-1.5 py-0.5 rounded border border-rose-500/20" :title="'Missing: ' + arrayToString(item.missing_keywords)">
                                                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                {{ item.missing_keywords.length }} Missing
                                            </div>
                                        </div>
                                        <div v-else class="text-[10px] text-slate-600 italic">No keyword issues</div>
                                    </div>
                                </td>

                                <td class="px-3 py-4 text-sm border-l border-slate-700/50 bg-slate-800/10 align-top">
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-center gap-3">
                                            <div class="text-center min-w-[40px]">
                                                <div class="text-[10px] text-indigo-400/60 uppercase font-bold">Tech</div>
                                                <div class="text-base font-bold text-indigo-300">{{ item.tech_depth_score || item.techdepthscore || '-' }}</div>
                                            </div>
                                            <div class="h-6 w-px bg-slate-700/50"></div>
                                            <div class="text-center min-w-[40px]">
                                                <div class="text-[10px] text-amber-500/60 uppercase font-bold">Fit</div>
                                                <div class="text-base font-bold text-amber-400">{{ item.career_progression_score || item.recruiterscore || '-' }}</div>
                                            </div>
                                        </div>
                                        
                                        <div v-if="item.stack_alignment" class="text-center">
                                             <span class="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 border border-slate-600 truncate max-w-[100px] inline-block" :title="item.stack_alignment">
                                                Stack: {{ item.stack_alignment }}
                                             </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="whitespace-nowrap px-3 py-4 text-sm align-top">
                                    <span 
                                        class="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold border rounded-md uppercase tracking-wider w-24"
                                        :class="getStatusStyles(item.status)"
                                    >
                                        {{ (item.status || 'FAIL').replace('_', ' ') }}
                                    </span>
                                </td>

                                <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm align-top">
                                    <button class="group/btn cursor-pointer flex items-center gap-1 ml-auto text-[#38bdf8] hover:text-white transition-all text-xs font-bold uppercase tracking-wider mt-1"
                                    @click="() => goToAnalysis(item.id || item.analysis_id)">
                                        <span>View</span>
                                        <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="bg-[#1e293b] px-6 py-3 mb-6 border-t border-slate-700/50 flex justify-between items-center text-xs">
                     <span class="text-slate-500">
                        Showing <span class="font-bold text-slate-200">{{ filteredData.length }}</span> matches
                    </span>
                    <div class="flex gap-2">
                        <button class="text-slate-500 hover:text-slate-300 disabled:opacity-50" disabled>&larr; Prev</button>
                        <button class="text-slate-500 hover:text-slate-300">Next &rarr;</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Scoped to prevent global pollution */
.custom-scrollbar::-webkit-scrollbar { 
    width: 6px; 
    height: 6px; 
}
.custom-scrollbar::-webkit-scrollbar-track { 
    background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb { 
    background: #334155; 
    border-radius: 3px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
    background: #475569; 
}
</style>