const main = document.getElementById("main");

// --- STATE ---
let currentResult = null; 
const ANALYSIS_ID = 8
// --- INIT ---
function init() {
    // Ensure body starts in small mode
    document.body.classList.remove('expanded');

    main.innerHTML = "";
    
    // Create Layout
    const surface = document.createElement("div");
    surface.className = "surface";
    
    // Header
    const header = document.createElement("div");
    header.className = "header";
    header.innerHTML = `
        <img src="assets/logo-removebg.png" alt="Logo" class="logo-img">
        <div class="header-text">
            <h1>InternOps</h1>
            <p>Smart Resume Filter</p>
        </div>
    `;
    
    // Input View
    const inputView = document.createElement("div");
    inputView.className = "input-view";
    inputView.id = "input-view";
    inputView.innerHTML = `
        <div class="select-wrapper">
            <label>Analysis Strategy</label>
            <select id="mode">
                <option value="strict">Strict Mode (ATS Heavy)</option>
                <option value="real-world" selected>Real World Scenario</option>
                <option value="brutal">Brutal Mode (FAANG)</option>
            </select>
        </div>
        
        <div style="text-align: center; margin-top: 10px;">
            <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                Analyze current page context against 50+ parameters using our advanced AI engine.
            </p>
        </div>

        <button id="analyze">Analyze Resume</button>
    `;

    // Results View (Hidden initially)
    const resultView = document.createElement("div");
    resultView.className = "results-container hidden";
    resultView.id = "result-view";

    surface.appendChild(header);
    surface.appendChild(inputView);
    surface.appendChild(resultView);
    main.appendChild(surface);

    document.getElementById("analyze").addEventListener("click", handleAnalyze);
}

// --- LOGIC ---
async function handleAnalyze() {
    const btn = document.getElementById("analyze");
    const originalText = btn.innerText;
    
    btn.classList.add("loading");
    btn.innerHTML = `<span class="spinner"></span> Analyzing...`;
    
    // Simulate API Call (Replace with real fetch)
    const data = await fetchResult(ANALYSIS_ID); 

    if(data && data.final_result) {
        currentResult = data.final_result;
        transitionToResults();
    } else {
        btn.innerText = "Analysis Failed";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove("loading");
        }, 2000);
    }
}

function transitionToResults() {
    // Expand the window dimensions
    document.body.classList.add('expanded');

    document.getElementById("input-view").classList.add("hidden");
    document.querySelector(".header").classList.add("hidden");

    const resultView = document.getElementById("result-view");
    resultView.classList.remove("hidden");
    renderResultStructure();
}

function handleBack() {
    // 1. Shrink window
    document.body.classList.remove('expanded');
    
    // 2. Toggle Views
    document.getElementById("result-view").classList.add("hidden");
    document.querySelector(".header").classList.remove("hidden");

    const inputView = document.getElementById("input-view");
    inputView.classList.remove("hidden");
    
    // 3. Reset Button State
    const btn = document.getElementById("analyze");
    btn.innerText = "Analyze Resume";
    btn.classList.remove("loading");
}

function renderResultStructure() {
    const container = document.getElementById("result-view");
    
    // Note the added 'nav-header-row' with the back button
    container.innerHTML = `
        <div class="nav-header-row">
            <button id="back-btn" class="nav-btn" title="Back to Analyze">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>

        <div class="tabs-header">
            <button class="tab-btn active" data-tab="ats">ATS Scan</button>
            <button class="tab-btn" data-tab="recruiter">Recruiter</button>
            <button class="tab-btn" data-tab="hm">Engineering</button>
        </div>
        <div id="tab-content" class="scroll-content">
            </div>
    `;

    // Back Button Listener
    document.getElementById("back-btn").addEventListener("click", handleBack);

    // Tab Listeners
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTabContent(e.target.dataset.tab);
        });
    });

    // Initial Render
    renderTabContent('ats');
}

function renderTabContent(tabName) {
    const contentDiv = document.getElementById("tab-content");
    let html = "";
    
    if (tabName === 'ats') {
        const data = currentResult.ats_result;
        html = `
            ${renderScoreCard("ATS Match Score", data.match_score, data.decision)}
            
            <div class="card">
                <span class="section-label">Missing Keywords</span>
                <div class="pill-wrap">
                    ${data.missing_keywords.length ? 
                      data.missing_keywords.map(k => `<span class="pill pill-danger">${k}</span>`).join('') : 
                      '<span class="pill pill-success">All Keywords Found</span>'}
                </div>
            </div>

            <div class="card">
                <span class="section-label">Formatting Check</span>
                ${data.formatting_issues && data.formatting_issues.length > 0 ? 
                  `<ul class="markdown-body" style="color: var(--danger)">${data.formatting_issues.map(i => `<li>${i}</li>`).join('')}</ul>` : 
                  '<div class="pill-wrap"><span class="pill pill-success">No Formatting Errors</span></div>'}
            </div>

            <div class="card">
                <span class="section-label">Detailed Feedback</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    } 
    else if (tabName === 'recruiter') {
        const data = currentResult.recruiter_result;
        html = `
            ${renderScoreCard("Career Progression", data.career_progression_score, data.decision)}
            
            ${data.red_flags && data.red_flags.length > 0 ? `
            <div class="card" style="border-left: 3px solid var(--danger);">
                <span class="section-label" style="color: var(--danger)">🚩 Red Flags Detected</span>
                <ul class="markdown-body">${data.red_flags.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>` : ''}

            <div class="card">
                <span class="section-label">Soft Skills</span>
                <div class="pill-wrap">
                    ${data.soft_skills_detected.map(s => `<span class="pill pill-neutral">${s}</span>`).join('')}
                </div>
            </div>

            <div class="card">
                <span class="section-label">Recruiter Impressions</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    } 
    else if (tabName === 'hm') {
        const data = currentResult.hm_result;
        html = `
            <div class="card hero-stats">
                <div>
                    <span class="section-label">Tech Depth</span>
                    <div style="font-size: 24px; font-weight: 800; color: ${getColor(data.tech_depth_score)}">${data.tech_depth_score}</div>
                </div>
                <div style="width: 1px; height: 30px; background: var(--border);"></div>
                <div>
                    <span class="section-label">Impact</span>
                    <div style="font-size: 24px; font-weight: 800; color: ${getColor(data.project_impact_score)}">${data.project_impact_score}</div>
                </div>
                <div>${renderBadge(data.decision)}</div>
            </div>

            <div class="card">
                <span class="section-label">Stack Alignment</span>
                <div class="markdown-body" style="font-style: italic; border-left: 3px solid var(--primary); padding-left: 12px; color: var(--text-muted);">
                    ${data.stack_alignment}
                </div>
            </div>

            <div class="card">
                <span class="section-label">Engineering Lead Notes</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    }
    contentDiv.innerHTML = html;
}

// --- HELPERS ---

function parseMarkdown(text) {
    if (!text) return "";
    let clean = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\d+\.\s/g, '<br><br>• ')
        .replace(/\n/g, '<br>');
    return clean;
}

function getColor(score) {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--danger)';
}

function renderBadge(decision) {
    let colorVar = decision === 'HIRE' ? 'var(--primary)' : (decision === 'PASS' ? 'var(--success)' : 'var(--danger)');
    return `<span style="color: ${colorVar}; font-weight: 700; font-size: 14px;">${decision}</span>`;
}

function renderScoreCard(label, score, decision) {
    const color = getColor(score);
    const dashArray = `${score}, 100`; 
    
    return `
    <div class="card" style="display:flex; align-items:center; gap: 16px;">
        <div style="width: 60px; height: 60px; flex-shrink: 0;">
            <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle" stroke="${color}" stroke-dasharray="${dashArray}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="23.35" style="font-size:13px" class="percentage">${score}</text>
            </svg>
        </div>
        <div style="flex:1;">
            <span class="section-label" style="margin-bottom:4px;">${label}</span>
            <div style="font-weight: 500; font-size: 13px; color: var(--text-muted);">
                Result: ${renderBadge(decision)}
            </div>
        </div>
    </div>
    `;
}

// --- API ---
async function fetchResult(analysisId){
    try{
        const res = await fetch(`http://localhost:8000/analysis_result/${analysisId}`);
        return await res.json();
    } catch(error){
        console.error(error);
        return null;
    }
}

init();