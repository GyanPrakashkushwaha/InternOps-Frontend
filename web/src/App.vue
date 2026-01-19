
<template>
  <div class="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-[#38bdf8] selection:text-slate-900 flex flex-col">
    
    <nav class="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-xl transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <div class="flex items-center gap-3">
            <div class="relative group cursor-pointer">
              <div class="absolute -inset-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-indigo-500 opacity-20 group-hover:opacity-40 blur-md transition duration-500"></div>
              
              <img 
                src="../assets/logo-removebg.png" 
                alt="Company Logo" 
                class="relative h-9 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            <div class="hidden md:block">
              <h1 class="text-xl font-bold tracking-tight text-slate-100">
                Application<span class="text-[#38bdf8]">Tracker</span>
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-1 bg-[#1e293b]/50 p-1.5 rounded-lg border border-slate-800/50 backdrop-blur-sm">
            
            <router-link 
              to="/dashboard" 
              class="px-5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out"
              :class="[
                $route.path === '/dashboard' 
                  ? 'bg-[#38bdf8] text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-[#38bdf8]/50 transform scale-105' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              ]"
            >
              Dashboard
            </router-link>

            <router-link 
              to="/analysis" 
              class="px-5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out"
              :class="[
                $route.path === '/analysis/123' 
                  ? 'bg-[#38bdf8] text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-[#38bdf8]/50 transform scale-105' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              ]"
            >
              Analysis
            </router-link>
            
          </div>

        </div>
      </div>
    </nav>

    <main class="flex-1 relative">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
  </div>
</template>

<style>
/* Global Reset to ensure full height */
html, body {
  margin: 0;
  padding: 0;
  background-color: #0f172a; /* Matches Slate 950 */
}

/* Custom Scrollbar for the whole app */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0f172a; 
}
::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569; 
}

/* Page Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Slide up effect on enter */
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Slide up effect on leave */
}
</style>