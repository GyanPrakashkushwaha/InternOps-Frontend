const main = document.getElementById("main");

// 1. Create the Surface Card (The white container)
const surface = document.createElement("div");
surface.className = "surface";

// 2. Build the Header with your LOGO
const header = document.createElement("div");
header.className = "header";
// We reference the file name directly here
header.innerHTML = `
    <img src="assets/logo-removebg.png" alt="InternOps Logo" class="logo-img">
    <div class="header-text">
        <h1>InternOps</h1>
        <p>Smart Filter Extension</p>
    </div>
`;

// 3. Build the Controls Container
const controlStack = document.createElement("div");
controlStack.className = "control-stack";

// Select Input
const selectWrapper = document.createElement("div");
selectWrapper.className = "select-wrapper";
selectWrapper.innerHTML = `
    <label for="mode">Select Strategy</label>
    <select name="mode" id="mode">
        <option value="strict">Strict Mode</option>
        <option value="real-world" selected>Real World Scenario</option>
        <option value="brutal">Brutal Mode</option>
    </select>
`;

// Main Action Button
const button = document.createElement("button");
button.id = "analyze";
button.innerText = "Analyze Resume";

// 4. Assemble
controlStack.appendChild(selectWrapper);
controlStack.appendChild(button);

surface.appendChild(header);
surface.appendChild(controlStack);
main.appendChild(surface);

// 5. Smooth Interaction Logic

button.addEventListener("click", fetchResultButtonCallback);

async function fetchResultButtonCallback(){
    const mode = document.getElementById("mode").value;
    const originalText = button.innerText;

    // A. Visual Feedback (Loading State)
    button.classList.add("loading");
    // Add spinner HTML + text
    button.innerHTML = `<span class="spinner"></span> Processing...`;

    // B. API CALL
    const result = await fetchResult(8)
    button.classList.remove("loading");
    button.innerText = "Done!";
    setTimeout(() => {
            button.innerText = originalText;
        }, 1500); 
}

async function fetchResult(analysisId){
    try{
        const res = await fetch(`http://localhost:8000/analysis_result/${analysisId}`);
        const data = await res.json()
        console.log("Final Result:", data);
        return data
    }catch(error){
        console.error(error)
    }
}

