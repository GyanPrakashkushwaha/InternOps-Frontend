async function analyzeResume() {
  const mode = "brutal"; // REQUIRED

  const fileInput = document.getElementById("resume");
  const file = fileInput.files[0];

  if (!file) {
    console.error("No file selected");
    return;
  }

  const jobDescription = `        
  Job Description                   
    Job Title: Data Science and AI Intern  

Company: GEODISHA 

Location: Hyderabad - Onsite 

Duration: 1- 4 Months 

About GEODISHA 

At GEODISHA, we are at the forefront of Data Analytics and AI, leveraging data to solve  complex problems and drive innovation. Our team is a dedicated group of researchers, engineers,  and strategists who believe in the power of technology. We are passionately committed to  developing cutting-edge AI that is not only powerful but also ethical, transparent, and fair. We're  looking for the next generation of innovators to join us. 

The Opportunity: This Isn't Your Typical Internship 

We are seeking truly exceptional interns to join our core Data & AI team. This is a unique  opportunity to move beyond theory and apply your skills to high-impact, real-world challenges  across the full data lifecycle. 

You won't be on the sidelines. You'll be paired with a senior mentor and embedded directly into  projects at the intersection of data engineering, data analytics, artificial intelligence, and human  behavior. We are looking for a candidate who is not just an outstanding programmer, but a  critical thinker who understands that great AI starts with great data, is passionate about the  "why" behind the data, and sees the critical importance of building Responsible AI. 

What You’ll Do (Key Responsibilities): 

∉ Assist in developing AI-driven recommendation engines and personalization workflows. ∉ Analyze structured and unstructured datasets to derive insights and patterns. ∉ Work with senior team members on customer segmentation, predictive modeling, and LLM integrated analytics tools. 

∉ Learn and support the development of modular data pipelines and models using industry  tools. 

∉ Use Python, SQL, scikit-learn, and other libraries for experimentation and development. ∉ Present findings through visualization tools such as seaborn, matplotlib, or BI tools like  Power BI. 

∉ Document code, experiments, and insights for further development. 

Who You Are (Our Ideal Candidate):

We are looking for a rising star who is driven, curious, and eager to make a tangible impact. 

Core Requirements: 

∉ Currently pursuing, recently completed a degree in Data Science, Computer Science,  Statistics, Mathematics, or related field. 

∉ Good understanding of Python and SQL (R is a plus). 

∉ Familiarity with basic ML algorithms: classification, regression, clustering. ∉ Exposure to libraries such as pandas, NumPy, scikit-learn, etc. 

∉ Interest in GenAI/NLP concepts like transformers or LLMs is a bonus. ∉ Strong analytical mindset, curiosity, and willingness to learn. 

Passion & Interest (What Sets You Apart): 

∉ A genuine and demonstrable passion for the entire Data Analytics space, from robust  engineering to insightful analysis. 

∉ Academic or project-based exposure to Behavioral Analytics or computational social  science. 

∉ A strong, well-articulated interest in the field of Responsible AI, ethics, and algorithmic  fairness 

Bonus Points: 

∉ Exposure to tools like TensorFlow, Hugging Face, or BI dashboards. 

∉ Basic understanding of cloud platforms (AWS/GCP/Azure), Git, or APIs. ∉ Academic projects, personal experiments, or GitHub repositories demonstrating interest in  AI/ML. 

What You’ll Gain: 

● Hands-on experience in a startup environment working on cutting-edge AdTech & MarTech  products. 

● Mentorship from senior Data Science and AI professionals. 

● A chance to convert the internship into a full-time position based on performance.

Type of Opportunity: Internship 

Job Title: Data Science & AI Intern


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
