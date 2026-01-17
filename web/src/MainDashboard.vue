<script setup>
import AnalysisHistorySidebar from './components/AnalysisHistorySidebar.vue';
import AnalysisReport from './components/AnalysisReport.vue';
import ChatInterface from './components/ChatInterface.vue';
</script>

<template>
  <div class="flex h-screen w-full bg-[#0f172a] overflow-hidden text-slate-300">
    
    <AnalysisHistorySidebar />

    <main class="flex-1 h-full overflow-hidden relative">
      <AnalysisReport />
    </main>

    <ChatInterface />

  </div>
</template>