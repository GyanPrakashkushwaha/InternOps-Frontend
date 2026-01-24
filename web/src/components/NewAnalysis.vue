<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Define your backend URL here (or import from a config file)
const API_BASE_URL = "https://internops-2.onrender.com"; // Update this port if necessary

const router = useRouter();

// --- State ---
const file = ref(null);
const fileName = ref('');
const fileSize = ref('');
const jobDescription = ref('');
const strategy = ref('real-world');
const isDragging = ref(false);

// --- Loading State ---
const isLoading = ref(false);
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
        fileSize.value = (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB';
    } else {
        alert("Please upload a valid PDF file.");
    }
};


const startAnalysis = async () => {
    if (!file.value || !jobDescription.value.trim()) return;

    isLoading.value = true;
    loadingProgress.value = 0;
    
    // Simulate progress to keep user engaged while the synchronous backend processes
    // The backend might take 10-60 seconds to respond.
    progressInterval = setInterval(() => {
        if (loadingProgress.value < 90) {
            // Slow down as we get higher to prevent reaching 100% prematurely
            const increment = Math.max(0.5, (90 - loadingProgress.value) / 50); 
            loadingProgress.value = Math.min(loadingProgress.value + increment, 90);
        }
    }, 200);

    try {
        // 1. Prepare Form Data for FastAPI (matches 'file: UploadFile' and 'job_description: Form')
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('job_description', jobDescription.value);

        // 2. Call the synchronous endpoint
        const response = await fetch(`${API_BASE_URL}/analyze/${strategy.value}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();

        // 3. Complete the progress bar
        loadingProgress.value = 100;
        clearInterval(progressInterval);
        
        // 4. Navigate to report using the returned analysis_id
        setTimeout(() => {
            if (result && result.analysis_id) {
                router.push({ name: 'AnalysisReport', params: { id: result.analysis_id } });
            } else {
                throw new Error("Invalid response structure");
            }
        }, 800);

    } catch (error) {
        console.error("Analysis Error:", error);
        alert(`Analysis failed: ${error.message}`);
        isLoading.value = false;
        clearInterval(progressInterval);
        loadingProgress.value = 0;
    }
};

onUnmounted(() => clearInterval(progressInterval));
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-[#38bdf8] selection:text-[#0f172a] pt-0">
        
        

        <div class="relative w-full max-w-5xl h-[600px] bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 ring-1 ring-white/5 rounded-xl shadow-2xl flex flex-col group">
            
            <transition name="fade">
                <div v-if="isLoading" class="absolute inset-0 z-50 bg-[#0f172a]/90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div class="w-80 space-y-4">
                        <div class="flex justify-between items-end text-xs font-mono text-[#38bdf8]">
                            <span class="animate-pulse">>> INITIATING_NEURAL_LINK...</span>
                            <span>{{ Math.floor(loadingProgress) }}%</span>
                        </div>
                        <div class="h-1 bg-slate-800 w-full rounded-full">
                            <div class="h-full bg-gradient-to-r from-[#38bdf8] to-indigo-500 transition-all duration-300 ease-out relative shadow-[0_0_10px_#38bdf8]" :style="{ width: loadingProgress + '%' }">
                                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                            </div>
                        </div>
                        <div class="text-[10px] text-slate-500 font-mono text-center pt-2">
                            Optimizing vector embeddings for context window...
                        </div>
                    </div>
                </div>
            </transition>

            <header class="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-gradient-to-r from-[#1e293b]/50 to-transparent">
                <div class="flex items-center gap-3">
                    <div class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-[#38bdf8]"></span>
                    </div>
                    <div>
                        <h1 class="text-[15px] font-bold text-slate-100 tracking-widest uppercase font-mono">Resume<span class="text-[#38bdf8]" >.AI</span> Console</h1>
                    </div>
                </div>
                
                <div class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <div class="px-2 py-1 rounded bg-slate-800/50 border border-white/5 text-[10px] font-mono text-slate-400">v2.4.0-stable</div>
                    <div class="flex gap-1.5 ml-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    </div>
                </div>
            </header>

            <div class="flex-1 flex flex-row divide-x divide-white/5">
                
                <div class="w-[40%] p-6 flex flex-col gap-8 bg-[#1e293b]/10 relative">
                    
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <label class="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Target Resume</label>
                            <span v-if="file" class="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">PDF VERIFIED</span>
                        </div>
                        
                        <div 
                            class="relative h-40 border border-dashed rounded-lg transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group/upload "
                            :class="[
                                isDragging ? 'border-[#38bdf8] bg-[#38bdf8]/5 scale-[0.99]' : 'border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/30',
                                file ? 'border-emerald-500/30 bg-emerald-500/5 border-solid' : ''
                            ]"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleDrop"
                            @click="triggerFileInput"
                        >
                            <input type="file" id="hidden-file-input" class="hidden" accept=".pdf" @change="handleFileChange">
                            
                            <div v-if="file" class="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full animate-[scan_2.5s_linear_infinite]"></div>

                            <div v-if="file" class="text-center px-6 relative z-10 flex flex-col items-center gap-2">
                                <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p class="text-xs font-mono text-emerald-300 font-medium truncate max-w-[200px]">{{ fileName }}</p>
                                    <p class="text-[10px] text-slate-500 mt-0.5">{{ fileSize }}</p>
                                </div>
                            </div>
                            
                            <div v-else class="text-center relative z-10 pointer-events-none space-y-3">
                                <div class="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover/upload:text-[#38bdf8] group-hover/upload:scale-110 transition-all duration-300 border border-white/5">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <div>
                                    <span class="text-slate-400 text-xs font-medium block">Drag & drop PDF here</span>
                                    <span class="text-slate-600 text-[10px] block mt-1">or click to browse filesystem</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Analysis Strategy</label>
                        <div class="flex flex-col gap-3">
                            <div class="grid grid-cols-3 p-1 bg-[#0f172a]/80 rounded-lg border border-white/5">
                                <button 
                                    v-for="mode in ['strict', 'real-world', 'brutal']" 
                                    :key="mode"
                                    @click="strategy = mode"
                                    class="text-[13px] py-2 rounded-md font-medium transition-all capitalize relative"
                                    :class="strategy === mode ? 'text-[#38bdf8] shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'"
                                >
                                    <div v-if="strategy === mode" class="absolute inset-0 bg-[#1e293b] border border-[#38bdf8]/20 rounded-md z-0"></div>
                                    <span class="relative z-10">{{ mode }}</span>
                                </button>
                            </div>
                            
                            <div class="p-3 rounded border border-dashed border-slate-700/50 bg-slate-800/20 min-h-[60px] flex items-center">
                                <div class="text-[12px] text-slate-400 leading-relaxed">
                                    <span v-if="strategy === 'strict'" class="flex gap-2">
                                        <span class="text-[#38bdf8] font-bold">●</span> Exact keyword matching. Good for ATS simulation.
                                    </span>
                                    <span v-if="strategy === 'real-world'" class="flex gap-2">
                                        <span class="text-emerald-400 font-bold">●</span> Semantic understanding & modern tech stack grouping.
                                    </span>
                                    <span v-if="strategy === 'brutal'" class="flex gap-2">
                                        <span class="text-red-400 font-bold">●</span> FAANG-level metrics. High scrutiny on gaps.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <div class="w-1.5 h-1.5 rounded-full animate-pulse" :class="file ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'"></div>
                            <span>{{ file ? 'SYSTEM_READY' : 'AWAITING_INPUT' }}</span>
                        </div>
                        <div class="text-[10px] text-slate-600 font-mono">ID: NULL-PTR</div>
                    </div>
                </div>

                <div class="w-[60%] flex flex-col bg-[#0f172a]/30 relative">
                    <div class="h-10 flex items-center justify-between px-4 bg-[#0f172a]/50 border-b border-white/5 select-none">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span class="text-xs text-slate-400 font-mono font-medium tracking-wide">Job Description</span>
                        </div>
                        <button 
                            v-if="jobDescription" 
                            @click="jobDescription = ''" 
                            class="text-[10px] font-mono text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
                        >
                            clear_buffer()
                        </button>
                    </div>
                    
                    <div class="flex-1 relative group/editor">
                        <textarea 
                            v-model="jobDescription"
                            class="absolute inset-0 w-full h-full bg-transparent border-none p-6 text-sm font-mono text-slate-300 resize-none focus:ring-0 placeholder:text-slate-700 leading-7 custom-scrollbar z-10"
                            placeholder=""
                            spellcheck="false"
                        ></textarea>
                        
                        <!-- <div class="absolute left-0 top-6 bottom-6 w-12 border-r border-white/5 flex flex-col items-center pt-1 text-[10px] text-slate-700 font-mono leading-7 select-none z-0"> -->
                        <!-- </div> -->
                    </div>

                    <div class="p-5 border-t border-white/5 bg-[#1e293b]/30 backdrop-blur-sm">
                        <button 
                            @click="startAnalysis"
                            :disabled="!file || !jobDescription"
                            class="w-full group relative flex items-center justify-center gap-3 py-3 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#0f172a] text-xs font-bold uppercase tracking-widest rounded-md transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] overflow-hidden"
                        >
                            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span class="relative z-10">Initialize Analysis</span>
                            <svg class="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes scan {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
}

@keyframes pulse-slow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

.animate-pulse-slow {
    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sleek Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
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