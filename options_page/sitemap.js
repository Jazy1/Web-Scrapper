
// Save
document.getElementById("save-sitemap").addEventListener("click",()=>{
    let sitemap = document.getElementById("display-sitemap").value

    if (sitemap != "" || sitemap != null){
        console.log("Saving sitemap..", sitemap);
        localStorage.setItem("sitemap", sitemap)
        console.log("Sitemap saved successfully");
    }

    document.getElementById("success-banner-sitemap").style.display = "block"
    setTimeout(() => {
        location.reload()
    }, 900);
    
})

// Delete
document.getElementById("delete-sitemap").addEventListener("click",()=>{
    localStorage.removeItem("sitemap")
    localStorage.removeItem("siteExportSelections")
    setTimeout(() => {
        location.reload()
    }, 900);
})

// Export
document.getElementById("export-sitemap").addEventListener("click", ()=>{
    let sitemap = document.getElementById("display-sitemap").value
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(sitemap);
    var dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "sitemap.json");
    dlAnchorElem.click();
})