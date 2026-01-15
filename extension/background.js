// Listen for "START_POLLING" from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "START_POLLING") {
        pollResult(request.taskId);
    }
});

async function pollResult(taskId) {
    const pollURL = `http://localhost:8000/result/${taskId}`;
    const startTime = Date.now();

    // Poll for up to 60 seconds
    while (Date.now() - startTime < 60000) {
        try {
            const res = await fetch(pollURL);
            const data = await res.json();
            
            if (data.status.toLowerCase() === "completed") {
                // Save result to storage so Popup can read it later
                chrome.storage.local.set({ 
                    "latestAnalysis": data, 
                    "status": "completed" 
                });
                
                // Visual notification
                chrome.action.setBadgeText({ text: "DONE" });
                chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
                break;
            }
        } catch (e) {
            console.error("Polling error", e);
        }
        
        // Wait 4 seconds before next check
        await new Promise(r => setTimeout(r, 4000));
    }
}