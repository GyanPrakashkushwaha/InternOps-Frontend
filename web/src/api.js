const BASE_URL = "https://internops-2.onrender.com"


export async function fetchHistory(){
    try{
        const res = await fetch(`${BASE_URL}/web/dashboard/history`)
        const data = await res.json()
        if(data.status == "success"){
            return data.data.history
        }
        return []
    }catch(err){
        console.log(err)
        return []
    }
}

export async function fetchAnalysisHistory() {
    try{
        const res = await fetch(`${BASE_URL}/web/analysis/history`)
        const data = await res.json()
        if(data.status == "success"){
            return data.data.history
        }
        return []
    }catch(err){
        console.log(err)
        return []
    }
}

export async function fetchAnalysisReport(id) {
    try{
        const res = await fetch(`${BASE_URL}/web/analysis/report/${id}`)
        const data = await res.json()
        if (data.status == "success"){
            return data.report
        }
        return {}
    }catch(err){
        console.log(err)
        return {}
    }
}

// --- NEW: Analysis Integration Logic (Ported from Extension) ---

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeApplication(file, jobDescription, mode) {
    if (!file) throw new Error("No file provided");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    // Using the direct analysis endpoint (same as extension)
    // Adjust if your backend requires a specific /web/ prefix for this action
    const url = `${BASE_URL}/analyze/${mode}`;

    try {
        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const status = data.status.toLowerCase();
        
        // Immediate completion
        if (status === "completed") {
            return data.final_result || { };
        }

        throw new Error("Invalid server response");

    } catch (err) {
        throw err;
    }
}

