

fetch("http://localhost:8000/analysis_id_list")
.then(res => res.json())
.then(data => console.log(data))