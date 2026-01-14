const main = document.getElementById("main");

// --- STATE ---
let currentResult = null;
const ANALYSIS_ID = 43

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
    
    // --- UPDATED HTML STRUCTURE HERE ---
    inputView.innerHTML = `
        <div class="select-wrapper">
            <label>Upload Resume (PDF)</label>
            <input type="file" id="resume-upload" accept=".pdf" class="custom-file-input" />
        </div>

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
    
    // --- NEW VALIDATION LOGIC ---
    const fileInput = document.getElementById("resume-upload");
    if (!fileInput.files || fileInput.files.length === 0) {
        btn.innerText = "Please Select a PDF";
        btn.style.background = "var(--danger)";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = ""; // Reset to gradient
        }, 2000);
        return; // Stop execution if no file
    }

    // Access the file object here if you need to send it to API
    const resumeFile = fileInput.files[0]; 
    console.log("File ready for upload:", resumeFile.name);
    
    btn.classList.add("loading");
    btn.innerHTML = `<span class="spinner"></span> Analyzing...`;
    
    // Simulate API Call (Replace with real fetch)
    const data = await analyzeResume(); 

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
            
            <button id="open-chat-btn" class="nav-action-btn">Open chat in new tab</button>
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

    // NEW BUTTON LISTENER
    document.getElementById("open-chat-btn").addEventListener("click", () => {
        window.open("http://localhost:5173/", "_blank");
    });

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


init();

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

async function analyzeResume() {
  const mode = document.getElementById("mode").value;

  const fileInput = document.getElementById("resume-upload");
  const file = fileInput.files[0];

  if (!file) {
    console.error("No file selected");
    return;
  }

  const jobDescription = `        
About the work from home job/internship
ServiceHive is looking for a 'GenAI Engineer Intern' to join the team building Inflx, our AI-powered social media automation product. This is a hands-on, high-impact internship where you'll work on building and improving conversational AI agents that automate social media interactions across Instagram, Facebook, Twitter/X, LinkedIn, and websites.

You'll work closely with our Senior Data Scientist (8+ years experience) and engineering team to learn real-world agent architectures and contribute directly to production systems used by real businesses. This internship is designed for candidates who want deep exposure to GenAI, LLMs, and AI agents, not just theoretical learning.

As a 'GenAI Engineer Intern,' your mission is to help build and improve AI agents that talk to users at scale. You'll assist in designing conversation flows, improving prompts, implementing agent logic, and analyzing conversations to continuously improve agent quality.

Selected intern's day-to-day responsibilites include:

A. Core Agent Development (Primary Focus - ~70%)
1. Assist in building conversational AI agents for Inflx
2. Design and test multi-turn conversation flows
3. Improve and experiment with prompt engineering strategies
4. Work with LLMs (GPT-4, Claude, Gemini, open-source models)
5. Assist in intent detection, entity extraction, and sentiment handling
6. Help implement conversation memory and context management
7. Test agent responses and improve conversation quality

B. Backend & Integration Support (~20%)
1. Assist in integrating agents with backend APIs
2. Work with social media APIs and webhooks
3. Help implement lead capture, FAQs, and routing logic
4. Write basic tests and help debug production issues

C. Learning & Collaboration (~10%)
1. Learn directly from Senior Data Scientist and Backend Engineer
2. Participate in code reviews and technical discussions
3. Document prompts, agent logic, and learnings
Skill(s) required
Artificial intelligence
Cursor (GenAI)
Data Science
Deep Learning
Generative AI Tools
Machine Learning
Natural Language Processing (NLP)
Python
Earn certifications in these skills
Learn Artificial intelligence
Learn Cursor (GenAI)
Learn Data Science
Learn Deep Learning
Learn Generative AI Tools
Learn Machine Learning
Learn NLP
+ 1 more skills
Who can apply

Only those candidates can apply who: 

1. are available for the work from home job/internship

2. can start the work from home job/internship between 9th Jan'26 and 13th Feb'26

3. are available for duration of 6 months

4. have relevant skills and interests

* Women wanting to start/restart their career can also apply.

Other requirements
1. Students from tier 1 universities preferred.

2. Students who can devote 40 hours a week would be preferred.
  `;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const data = await fetchAnalyzeResume(formData, mode);
  return data;
}

async function fetchAnalyzeResume(formData, mode) {
  const url = `http://localhost:8000/analyze/${mode}`;
  try {
    const res = await fetch(url, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const status = data.status.toLowerCase();
    if (status == "completed") {
      console.log(data)
      return data;
    }
    if (!data.task_id) throw new Error("Missing task_id");
    const taskId = data.task_id;
    // Do polling.
    const pollURL = `http://localhost:8000/result/${taskId}`;
    const newData = await pollResult(pollURL);
    console.log(newData);
    return newData;
  } catch (err) {
    throw err;
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollAPI(url, interval = 1000, timeout = 20000) {
  const startTime = Date.now();

  while (true) {
    if (Date.now() - startTime > timeout) {
      throw new Error("Polling timed out");
    }

    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      // network error
      await wait(interval);
      continue;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const status = data.status.toLowerCase();
    if (status == "completed") {
      return data;
    }

    await wait(interval);
  }
}

async function pollResult(url) {
  return pollAPI(url, 4000, 60000);
}