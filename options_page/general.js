document.querySelector("input#category-load-time").addEventListener("input", (e)=>{
    let time = document.querySelector("input#category-load-time").value.trim()
    if (time != "" || time != null) {
        localStorage.setItem("cat-load-time",time)
    }
    
})