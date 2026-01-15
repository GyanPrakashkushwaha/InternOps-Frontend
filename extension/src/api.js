import { wait } from './utils.js';
import { JOB_DESCRIPTION } from './constants.js';

export async function fetchResult(analysisId){
    try{
        const res = await fetch(`http://localhost:8000/analysis_result/${analysisId}`);
        return await res.json();
    } catch(error){
        console.error(error);
        return null;
    }
}

export async function processResumeAnalysis(file, jobDescription, mode) {
    if (!file) throw new Error("No file provided");

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
            return data;
        }
        if (!data.task_id) throw new Error("Missing task_id");
        
        const taskId = data.task_id;
        const pollURL = `http://localhost:8000/result/${taskId}`;
        return await pollResult(pollURL);
    } catch (err) {
        throw err;
    }
}

async function pollAPI(url, interval = 1000, timeout = 20000) {
    const startTime = Date.now();
    while (true) {
        if (Date.now() - startTime > timeout) throw new Error("Polling timed out");

        let response;
        try {
            response = await fetch(url);
        } catch (err) {
            await wait(interval);
            continue;
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const status = data.status.toLowerCase();
        if (status == "completed") return data;

        await wait(interval);
    }
}

async function pollResult(url) {
    return pollAPI(url, 4000, 60000);
}