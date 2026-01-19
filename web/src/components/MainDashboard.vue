<script setup>
import AnalysisHistorySidebar from "../components/AnalysisHistorySidebar.vue";
import ChatInterface from '../components/ChatInterface.vue'
import AnalysisReport from '../components/AnalysisReport.vue'
</script>

<template>
    <div class="flex h-dvh">
        <AnalysisHistorySidebar/>
        <AnalysisReport/>
        <ChatInterface/>
    </div>
</template>