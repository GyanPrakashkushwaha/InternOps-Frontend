
window.addEventListener("scroll", scrapDetails)

function scrapDetails() {
    try {
    // 1st Tag -- JD
        const jd = document.querySelector(".styles_JDC__dang-inner-html__h0K4t")
        console.log(jd)
        const pTag = jd.querySelectorAll("p")
        let finalJD = "  "
        pTag.forEach(tag => {
            finalJD += tag.innerText
            // console.log(tag.innerText)
        })
        console.log(finalJD)

        // 2nd Tag -- Role Details
        const details = document.querySelector(".styles_other-details__oEN4O")
        const detail = details.querySelectorAll(".styles_details__Y424J")
        const roleDetails = {}
        detail.forEach((ele) => {
            name = ele.querySelector("label").innerText
            val = ele.querySelector("span").innerText
            roleDetails[name] = val
        })
        console.log(roleDetails)

        // 3rd Tag -- Education
        const edu = document.querySelector(".styles_education__KXFkO")
        const eduDetails = edu.querySelectorAll(".styles_details__Y424J")
        const data = {}
        eduDetails.forEach((ele) => {
            name = ele.querySelector("label").innerText
            val = ele.querySelector("span").innerText
            data[name] = val
        })
        console.log(data)

    } catch (err) {
        console.error("Scraping failed", err);
    }
}
