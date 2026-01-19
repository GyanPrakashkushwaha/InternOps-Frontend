
export async function fetchHistory(){
    try{
        const res = await fetch("http://localhost:8000/web/dashboard/history")
        const data = await res.json()
        if(data.status == "success"){
            return data.data.history
        }
        return []
    }catch(err){
        console.log(err)
    }
}

export async function fetchAnalysisHistory() {
    try{
        const res = await fetch("http://localhost:8000/web/analysis/history")
        const data = await res.json()
        if(data.status == "success"){
            return data.data.history
        }
        return []
    }catch(err){
        console.log(err)
    }
}

export async function fetchAnalysisReport(id) {
    try{
        const res = await fetch(`http://localhost:8000/web/analysis/report/${id}`)
        const data = await res.json()
        if (data.status == "success"){
            return data.report
        }
        return {}
    }catch{

    } 
}