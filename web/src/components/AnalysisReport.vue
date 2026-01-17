<script setup>
import { ref } from 'vue';

// --- Dummy Data (Matches your JSON structure) ---
const report = ref({
  id: "1024",
  role: "Backend Engineer (Google)",
  mode: "Strict Compliance (Enterprise ATS)",
  final_result: {
    ats_result: {
      match_score: 85,
      missing_keywords: ["Kubernetes", "gRPC", "OCR pipelines"],
      formatting_issues: [],
      decision: "PASS",
      feedback: "Good keyword density, but you are missing specific cloud-native terms mentioned in the JD. Your formatting is clean and parseable."
    },
    recruiter_result: {
      career_progression_score: 90,
      red_flags: [],
      soft_skills_detected: ["Leadership", "Mentoring", "Cross-functional collaboration"],
      decision: "PASS",
      feedback: "Strong career growth shown from Junior to Senior dev. The narrative is clear and the transitions between roles are logical."
    },
    hm_result: {
      tech_depth_score: 78,
      project_impact_score: 65,
      stack_alignment: "High (Python/FastAPI matches JD)",
      decision: "MAYBE",
      feedback: "Technically sound, but lacks specific metrics. You say 'improved performance' but don't say by how much (e.g., 'reduced latency by 50ms'). Need more concrete proof of work."
    }
  }
});

// --- Helpers ---
const getDecisionColor = (decision) => {
    switch (decision?.toUpperCase()) {
        case 'PASS':
        case 'HIRE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        case 'FAIL':
        case 'NO_HIRE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
};

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
};
</script>

<template>
    <div class="h-full w-full bg-[#0f172a] text-slate-300 font-sans p-4 sm:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        <div class="flex justify-center min-h-min">
            <div class="w-full max-w-4xl h-fit bg-[#1e293b] shadow-2xl rounded-xl border border-slate-700/50 overflow-hidden relative mb-10">
                
                <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-[#38bdf8]"></div>

                <div class="p-8 sm:p-12 space-y-10">

                    <div class="border-b border-slate-700/50 pb-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-3xl font-extrabold text-white tracking-tight mb-2">
                                    📄 Analysis Report <span class="text-slate-500">#{{ report.id }}</span>
                                </h1>
                                <div class="space-y-1 mt-3">
                                    <p class="text-sm text-slate-400">
                                        <strong class="text-slate-200">Target Role:</strong> {{ report.role }}
                                    </p>
                                    <p class="text-sm text-slate-400">
                                        <strong class="text-slate-200">Mode:</strong> 
                                        <span class="inline-flex items-center gap-1.5 ml-1">
                                            🛡️ {{ report.mode }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="hidden sm:flex flex-col items-end">
                                <div class="px-4 py-1.5 rounded text-sm font-bold border uppercase tracking-wider"
                                     :class="getDecisionColor(report.final_result.hm_result.decision)">
                                    {{ report.final_result.hm_result.decision }}
                                </div>
                             </div>
                        </div>
                    </div>

                    <section>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-bold text-sm">1</span>
                            <h2 class="text-xl font-bold text-white">ATS Screen <span class="text-slate-500 font-medium text-base">(Gatekeeper)</span></h2>
                        </div>
                        <blockquote class="border-l-4 border-slate-700 pl-4 py-1 mb-6 text-sm text-slate-500 italic">
                            Checks for keywords and formatting. If this fails, no human sees your resume.
                        </blockquote>

                        <ul class="space-y-3 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[120px]">Match Score:</span>
                                <span class="font-bold" :class="getScoreColor(report.final_result.ats_result.match_score)">
                                    {{ report.final_result.ats_result.match_score }}/100
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[120px]">Decision:</span>
                                <span class="px-2 py-0.5 rounded text-xs font-bold border uppercase" 
                                      :class="getDecisionColor(report.final_result.ats_result.decision)">
                                    {{ report.final_result.ats_result.decision }}
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[120px] pt-1">Missing Keywords:</span>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="kw in report.final_result.ats_result.missing_keywords" :key="kw" 
                                          class="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20 text-xs font-mono">
                                        {{ kw }}
                                    </span>
                                </div>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[120px]">Formatting Issues:</span>
                                <span v-if="report.final_result.ats_result.formatting_issues.length === 0" class="text-slate-400">None detected.</span>
                                <span v-else class="text-rose-400">{{ report.final_result.ats_result.formatting_issues.join(', ') }}</span>
                            </li>
                            <li class="flex items-start gap-2 mt-4">
                                <span class="font-bold text-slate-200 min-w-[120px]">Feedback:</span>
                                <p class="text-slate-400 italic">"{{ report.final_result.ats_result.feedback }}"</p>
                            </li>
                        </ul>
                    </section>

                    <hr class="border-slate-800" />

                    <section>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-bold text-sm">2</span>
                            <h2 class="text-xl font-bold text-white">Recruiter Screen <span class="text-slate-500 font-medium text-base">(The Story)</span></h2>
                        </div>
                        <blockquote class="border-l-4 border-slate-700 pl-4 py-1 mb-6 text-sm text-slate-500 italic">
                            Checks for career progression and red flags.
                        </blockquote>

                        <ul class="space-y-3 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Progression Score:</span>
                                <span class="font-bold" :class="getScoreColor(report.final_result.recruiter_result.career_progression_score)">
                                    {{ report.final_result.recruiter_result.career_progression_score }}/100
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Decision:</span>
                                <span class="px-2 py-0.5 rounded text-xs font-bold border uppercase" 
                                      :class="getDecisionColor(report.final_result.recruiter_result.decision)">
                                    {{ report.final_result.recruiter_result.decision }}
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Red Flags:</span>
                                <span v-if="report.final_result.recruiter_result.red_flags.length === 0" class="text-slate-400">None.</span>
                                <span v-else class="text-rose-400 font-bold">{{ report.final_result.recruiter_result.red_flags.join(', ') }}</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px] pt-1">Soft Skills:</span>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="skill in report.final_result.recruiter_result.soft_skills_detected" :key="skill" 
                                          class="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 text-xs">
                                        {{ skill }}
                                    </span>
                                </div>
                            </li>
                            <li class="flex items-start gap-2 mt-4">
                                <span class="font-bold text-slate-200 min-w-[140px]">Feedback:</span>
                                <p class="text-slate-400 italic">"{{ report.final_result.recruiter_result.feedback }}"</p>
                            </li>
                        </ul>
                    </section>

                    <hr class="border-slate-800" />

                    <section>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-bold text-sm">3</span>
                            <h2 class="text-xl font-bold text-white">Hiring Manager Screen <span class="text-slate-500 font-medium text-base">(The Proof)</span></h2>
                        </div>
                        <blockquote class="border-l-4 border-slate-700 pl-4 py-1 mb-6 text-sm text-slate-500 italic">
                            Checks for technical depth and impact metrics.
                        </blockquote>

                        <ul class="space-y-3 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Tech Depth Score:</span>
                                <span class="font-bold" :class="getScoreColor(report.final_result.hm_result.tech_depth_score)">
                                    {{ report.final_result.hm_result.tech_depth_score }}/100
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Project Impact:</span>
                                <span class="font-bold" :class="getScoreColor(report.final_result.hm_result.project_impact_score)">
                                    {{ report.final_result.hm_result.project_impact_score }}/100
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Stack Alignment:</span>
                                <span class="text-slate-300">{{ report.final_result.hm_result.stack_alignment }}</span>
                            </li>
                             <li class="flex items-start gap-2">
                                <span class="font-bold text-slate-200 min-w-[140px]">Decision:</span>
                                <span class="px-2 py-0.5 rounded text-xs font-bold border uppercase" 
                                      :class="getDecisionColor(report.final_result.hm_result.decision)">
                                    {{ report.final_result.hm_result.decision }}
                                </span>
                            </li>
                            <li class="flex items-start gap-2 mt-4">
                                <span class="font-bold text-slate-200 min-w-[140px]">Feedback:</span>
                                <p class="text-slate-400 italic">"{{ report.final_result.hm_result.feedback }}"</p>
                            </li>
                        </ul>
                    </section>

                    <hr class="border-slate-800" />

                    <section class="pt-2">
                        <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            🤖 AI Coach Actions
                        </h2>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-[#38bdf8] hover:bg-sky-400 text-slate-900 text-sm font-bold rounded-lg transition-all shadow-lg shadow-sky-500/20 group">
                                <span class="text-lg">💬</span> Chat with Analysis
                            </button>
                            
                            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-600 transition-all">
                                <span class="text-lg">📝</span> Auto-Fix Resume
                            </button>
                            
                            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50 text-slate-400 text-sm font-bold rounded-lg border border-slate-700 transition-all">
                                <span class="text-lg">🗑️</span> Delete
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    </div>
</template>