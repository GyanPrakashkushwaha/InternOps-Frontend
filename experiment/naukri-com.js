tags = [
    "styles_JDC__dang-inner-html__h0K4t",
    "styles_other-details__oEN4O",
    "styles_education__KXFkO",
]

// 1st Tag -- JD
jd = document.querySelector(".styles_JDC__dang-inner-html__h0K4t")
pTag = jd.querySelectorAll("p")
finalJD = "  "
pTag.forEach(tag => {
    finalJD += tag.innerText
    console.log(tag.innerText)
})

// 2nd Tag -- Role Details
details = document.querySelector(".styles_other-details__oEN4O")
detail = details.querySelectorAll(".styles_details__Y424J")
data = {}
detail.forEach((ele) => {
    name = ele.querySelector("label").innerText
    val = ele.querySelector("span").innerText
    data[name] = val
    console.log(name, val)
})

// 3rd Tag -- Education
edu = document.querySelector(".styles_education__KXFkO")
eduDetails = edu.querySelectorAll(".styles_details__Y424J")
data = {}
eduDetails.forEach((ele) => {
    name = ele.querySelector("label").innerText
    val = ele.querySelector("span").innerText
    data[name] = val
    console.log(name, val)
})

