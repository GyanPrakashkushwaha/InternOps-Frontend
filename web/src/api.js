
export async function fetchHistory(){
    try{
        const res = await fetch("http://localhost:8000/web/dashboard/history")
        const data = res.json()
        return data
    }catch(err){
        console.log(err)
    }
}