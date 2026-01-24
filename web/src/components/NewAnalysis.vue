<script setup>
import { ref, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { analyzeApplication } from '../api';

const router = useRouter();

// --- State ---
const file = ref(null);
const fileName = ref('');
const jobDescription = ref('');
const strategy = ref('real-world');
const isDragging = ref(false);

// --- Loading State ---
const isLoading = ref(false);
const loadingStatus = ref("Initializing...");
const loadingProgress = ref(0);
let progressInterval = null;

// --- File Handling ---
const triggerFileInput = () => document.getElementById('hidden-file-input').click();

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
};

const handleDrop = (event) => {
    isDragging.value = false;
    const droppedFile = event.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
};

const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
        file.value = selectedFile;
        fileName.value = selectedFile.name;
    } else {
        alert("Please upload a valid PDF file.");
    }
};

// --- Analysis Logic ---
const startAnalysis = async () => {
    if (!file.value || !jobDescription.value.trim()) return;

    isLoading.value = true;
    
    // Sleek faster loader
    progressInterval = setInterval(() => {
        if (loadingProgress.value < 95) {
            loadingProgress.value += (100 - loadingProgress.value) * 0.1; 
        }
    }, 200);

    try {
        const result = await analyzeApplication(file.value, jobDescription.value, strategy.value);
        loadingProgress.value = 100;
        setTimeout(() => {
            if (result && result.id) router.push({ name: 'AnalysisReport', params: { id: result.id } });
            else router.push('/'); 
        }, 500);
    } catch (error) {
        console.error(error);
        alert("Analysis failed.");
        isLoading.value = false;
        clearInterval(progressInterval);
        loadingProgress.value = 0;
    }
};

onUnmounted(() => clearInterval(progressInterval));
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-[#38bdf8] selection:text-[#0f172a]">
        
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#38bdf8]/5 blur-[100px] rounded-full"></div>
            <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[80px] rounded-full"></div>
        </div>

        <div class="relative w-full max-w-4xl h-[650px] bg-[#1e293b]/60 backdrop-blur-xl border border-white/5 rounded-lg shadow-2xl flex flex-col overflow-hidden">
            
            <div v-if="isLoading" class="absolute inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300">
                <div class="w-64 space-y-2">
                    <div class="flex justify-between text-xs font-mono text-[#38bdf8]">
                        <span>PROCESSING_DATA</span>
                        <span>{{ Math.round(loadingProgress) }}%</span>
                    </div>
                    <div class="h-0.5 bg-slate-800 w-full overflow-hidden">
                        <div class="h-full bg-[#38bdf8] transition-all duration-200" :style="{ width: loadingProgress + '%' }"></div>
                    </div>
                </div>
            </div>

            <header class="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f172a]/30">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"></div>
                    <h1 class="text-sm font-semibold text-slate-100 tracking-wide uppercase">Analysis Console</h1>
                </div>
                <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-slate-700/50"></div>
                    <div class="w-3 h-3 rounded-full bg-slate-700/50"></div>
                </div>
            </header>

            <div class="flex-1 grid grid-cols-12 divide-x divide-white/5">
                
                <div class="col-span-5 p-5 flex flex-col gap-6 bg-[#1e293b]/20">
                    
                    <div class="space-y-2">
                        <label class="text-xs font-medium text-slate-400 uppercase tracking-wider">Source Resume (PDF)</label>
                        
                        <div 
                            class="relative h-32 border border-dashed rounded transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                            :class="[
                                isDragging ? 'border-[#38bdf8] bg-[#38bdf8]/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800',
                                file ? 'border-emerald-500/50 bg-emerald-500/5 border-solid' : ''
                            ]"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleDrop"
                            @click="triggerFileInput"
                        >
                            <input type="file" id="hidden-file-input" class="hidden" accept=".pdf" @change="handleFileChange">
                            
                            <div v-if="file" class="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-full w-full animate-[scan_2s_linear_infinite]"></div>

                            <div v-if="file" class="text-center px-4 relative z-10">
                                <p class="text-xs font-mono text-emerald-400 truncate max-w-[200px]">{{ fileName }}</p>
                                <p class="text-[10px] text-slate-500 mt-1">Click to replace</p>
                            </div>
                            <div v-else class="text-center relative z-10 pointer-events-none">
                                <span class="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">+ Upload File</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-medium text-slate-400 uppercase tracking-wider">Model Strategy</label>
                        <div class="grid grid-cols-3 p-1 bg-[#0f172a] rounded border border-slate-800">
                            <button 
                                v-for="mode in ['strict', 'real-world', 'brutal']" 
                                :key="mode"
                                @click="strategy = mode"
                                class="text-[10px] py-1.5 rounded font-medium transition-all capitalize"
                                :class="strategy === mode ? 'bg-[#1e293b] text-[#38bdf8] shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                            >
                                {{ mode }}
                            </button>
                        </div>
                        <p class="text-[10px] text-slate-500 leading-tight min-h-[2.5em]">
                            <span v-if="strategy === 'strict'">Exact keyword matching only.</span>
                            <span v-if="strategy === 'real-world'">Semantic analysis & modern standards.</span>
                            <span v-if="strategy === 'brutal'">FAANG-level metric expectations.</span>
                        </p>
                    </div>

                    <div class="mt-auto border-t border-white/5 pt-4">
                        <div class="flex items-center gap-2 text-[10px] text-slate-500">
                            <div class="w-1.5 h-1.5 rounded-full" :class="file ? 'bg-emerald-500' : 'bg-slate-700'"></div>
                            <span>{{ file ? 'Resume Loaded' : 'Waiting for input...' }}</span>
                        </div>
                    </div>
                </div>

                <div class="col-span-7 flex flex-col bg-[#0f172a]/30">
                    <div class="h-8 flex items-center justify-between px-4 bg-[#0f172a]/50 border-b border-white/5">
                        <span class="text-xs text-slate-500 font-mono">job_description.txt</span>
                        <button v-if="jobDescription" @click="jobDescription = ''" class="text-[10px] text-red-400/70 hover:text-red-400">CLEAR</button>
                    </div>
                    
                    <textarea 
                        v-model="jobDescription"
                        class="flex-1 w-full bg-transparent border-none p-4 text-xs font-mono text-slate-300 resize-none focus:ring-0 placeholder:text-slate-700 leading-relaxed custom-scrollbar"
                        placeholder="// Paste Job Description here..."
                        spellcheck="false"
                    ></textarea>

                    <div class="p-4 border-t border-white/5 bg-[#1e293b]/20">
                        <button 
                            @click="startAnalysis"
                            :disabled="!file || !jobDescription"
                            class="w-full group relative flex items-center justify-center gap-2 py-2.5 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#0f172a] text-xs font-bold uppercase tracking-wider rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span class="relative z-10">Run Analysis</span>
                            <svg class="w-3 h-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
}

/* Sleek Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #0f172a; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #475569; 
}
</style>