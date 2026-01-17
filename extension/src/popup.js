import { getTabContentHTML } from './ui.js';
import { processResumeAnalysis } from './api.js';

const main = document.getElementById("main");
let currentResult = null;
let ANALYSIS_KEY = "";

// --- INIT ---
function init() {
    document.body.classList.remove('expanded');
    main.innerHTML = "";
    
    // Create Layout
    const surface = document.createElement("div");
    surface.className = "surface";
    
    const header = document.createElement("div");
    header.className = "header";
    header.innerHTML = `
        <img src="assets/logo-removebg.png" alt="Logo" class="logo-img">
        <div class="header-text">
            <h1>InternOps</h1>
            <p>Smart Resume Filter</p>
        </div>
    `;
    
    const inputView = document.createElement("div");
    inputView.className = "input-view";
    inputView.id = "input-view";
    
    inputView.innerHTML = `
        <div class="select-wrapper">
            <label>Upload Resume (PDF)</label>
            <input type="file" id="resume-upload" accept=".pdf" class="custom-file-input" />
        </div>

        <div class="select-wrapper">
            <label>Job Description</label>
            <textarea id="job-description" placeholder="Paste the job description or role requirements here..."></textarea>
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

    const resultView = document.createElement("div");
    resultView.className = "results-container hidden";
    resultView.id = "result-view";

    surface.appendChild(header);
    surface.appendChild(inputView);
    surface.appendChild(resultView);
    main.appendChild(surface);

    // --- RESTORE STATE ON LOAD ---
    chrome.storage.local.get(['savedJD', 'savedResume'], (result) => {
        // 1. Restore Job Description
        if (result.savedJD) {
            const jdInput = document.getElementById("job-description");
            if (jdInput) jdInput.value = result.savedJD;
        }

        // 2. Restore Resume File
        if (result.savedResume) {
            try {
                const file = base64ToFile(result.savedResume.content, result.savedResume.name, result.savedResume.type);
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const fileInput = document.getElementById("resume-upload");
                if (fileInput) fileInput.files = dataTransfer.files;
            } catch (e) {
                console.error("Error restoring file:", e);
            }
        }
    });

    // --- NEW: CLEAN SAVE LISTENERS ---
    
    // 1. JD Listener: Update storage or remove if empty
    document.getElementById("job-description").addEventListener("input", (e) => {
        const val = e.target.value;
        if (val && val.trim().length > 0) {
            chrome.storage.local.set({ savedJD: val });
        } else {
            // If user clears the box, remove from storage
            chrome.storage.local.remove("savedJD");
        }
    });

    // 2. Resume Listener: CLEAR EVERYTHING when new file selected
    document.getElementById("resume-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // A. Clear previous data (Clean Slate Protocol)
            // We remove old Resume AND old JD because a new resume implies a new application context
            await chrome.storage.local.remove(['savedJD', 'savedResume']);
            
            // B. Clear the JD UI to match the storage removal
            document.getElementById("job-description").value = "";

            // C. Save the NEW resume
            try {
                const base64 = await fileToBase64(file);
                chrome.storage.local.set({ 
                    savedResume: { 
                        name: file.name, 
                        type: file.type, 
                        content: base64 
                    } 
                });
            } catch (err) {
                console.error("Error saving file:", err);
            }
        }
    });

    document.getElementById("analyze").addEventListener("click", handleAnalyze);
}

// --- CONTROLLER LOGIC ---
async function handleAnalyze() {
    const btn = document.getElementById("analyze");
    const originalText = btn.innerText;
    
    const fileInput = document.getElementById("resume-upload");
    const jdInput = document.getElementById("job-description");
    if (!fileInput.files || fileInput.files.length === 0) {
        triggerError(btn, originalText, "Please select a PDF")
        return; 
    }
    if (!jdInput.value.trim()) {
        triggerError(btn, originalText, "Enter Job Description");
        return;
    }

    const resumeFile = fileInput.files[0]; 
    const mode = document.getElementById("mode").value; 
    const jdText = jdInput.value.trim()

    console.log("File ready for upload:", resumeFile.name);
    
    btn.classList.add("loading");
    btn.innerHTML = `<span class="spinner"></span> Analyzing...`;
    
    try {
        const data = await processResumeAnalysis(resumeFile, jdText, mode); 

        if(data && data.final_result) {
            currentResult = data.final_result;
            transitionToResults();
        } else {
            throw new Error("No final result");
        }
    } catch (e) {
        console.error(e);
        btn.innerText = "Analysis Failed";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove("loading");
        }, 2000);
    }
}

function triggerError(btn, originalText, msg){
    btn.innerText = msg;
    btn.style.background = "var(--danger)";
    setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
        }, 2000);
}

function transitionToResults() {
    document.body.classList.add('expanded');
    document.getElementById("input-view").classList.add("hidden");
    document.querySelector(".header").classList.add("hidden");

    const resultView = document.getElementById("result-view");
    resultView.classList.remove("hidden");
    renderResultStructure();
}

function handleBack() {
    document.body.classList.remove('expanded');
    document.getElementById("result-view").classList.add("hidden");
    document.querySelector(".header").classList.remove("hidden");

    const inputView = document.getElementById("input-view");
    inputView.classList.remove("hidden");
    
    const btn = document.getElementById("analyze");
    btn.innerText = "Analyze Resume";
    btn.classList.remove("loading");
}

function renderResultStructure() {
    const container = document.getElementById("result-view");
    
    container.innerHTML = `
        <div class="nav-header-row">
            <button id="back-btn" class="nav-btn" title="Back to Analyze">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button id="download-updated-cv" class="nav-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="margin-right:6px">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JD-Optimized CV
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

    document.getElementById("back-btn").addEventListener("click", handleBack);

    document.getElementById("open-chat-btn").addEventListener("click", () => {
        window.open("http://localhost:5173/", "_blank");
    });

    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTabContent(e.target.dataset.tab);
        });
    });

    renderTabContent('ats');
}

function renderTabContent(tabName) {
    const contentDiv = document.getElementById("tab-content");
    contentDiv.innerHTML = getTabContentHTML(tabName, currentResult);
}

// --- HELPER FUNCTIONS ---

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function base64ToFile(dataurl, filename, mimeType) {
    const arr = dataurl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mimeType });
}

// Start the app
init();