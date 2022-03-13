
// Shows success message upon sucessfull scrapping
function showSuccessLog(url) {
    let successLog = document.createElement("div")
    successLog.classList.add("alert", "alert-success")
    successLog.role = "alert"
    successLog.innerHTML = `
    <p style="overflow-wrap: break-word; display:inline"> <a href=${url}>${url} </a> </p> scrapped successfully
    `

    document.getElementById("logs").appendChild(successLog)
}

function showFailLog(url) {
    let failLog = document.createElement("div")
    failLog.classList.add("alert", "alert-danger")
    failLog.role = "alert"
    failLog.innerHTML = `
    Cannot scrape ${url}. Invalid link.
    `
    document.getElementById("logs").appendChild(successLog)
}

// Takes table and convert it into CSV
function toCSV() {
    let table = document.getElementById("data-table")
    let anchor = document.getElementById("download-csv")
    
    ExcellentExport.csv(anchor, table, "products")
  
    setTimeout(()=>{
      anchor.style.display = "block"
    },1000)
  
}

// Open links one by one
async function getScrapedData (arrayOfLinks, sitemap, waitForLoad, waitForClose) {
    let j = 0
    
    for (let i = 0; i < arrayOfLinks.length; i++) {
        
        const link = arrayOfLinks[i].url
        const x = await new Promise(resolve => {

            let popup = window.open(link, "_blank", "height: 100px , width: 100px");
            let messageToSend = {context: "bulk export", from:"ext-settings", url: link, sitemap: sitemap, waitForClose: waitForClose}
            // console.log(waitForLoad);
            setTimeout(()=>{
                popup.postMessage(messageToSend,"*")

                if (j === (arrayOfLinks.length - 1) ) {
                    document.getElementById("notification-bulkscrape").innerText = `Scraping Completed. Download and Preview data by clicking on export and preview button respectively. 
                    If the files are still downloading, please let them download and don't close or refresh.`

                    alert("Scrapping Completed ! If the files are still downloading, don't close or refresh the page.")
                }

                j++

                resolve("Opened " + link)
            }, waitForLoad*1000)
        })
    }
    return 'done'
}

// Extract links to download
function gatherLinks(scrapedData) {
    let links = []
  
    for (let i = 0; i < scrapedData.length; i++) {
      const scrapedField = scrapedData[i];
      
      switch (scrapedField.type) {
        case "link-with-download":
          if (scrapedField.scraped != "") {
            links.push({ name: scrapedField.name, scraped:scrapedField.scraped})
          }
          break;
  
        case "image-with-download":
          if (scrapedField.scraped != "") {
            links.push({name: scrapedField.name, scraped:scrapedField.scraped})
          }
          break;
  
        default:
          break;
      }
    }
  
    return links
}

// Download the link
function downloadLink(link) {
    if (link != "") {
    
        let ext = link.slice(link.length - 3)

        if (ext == "rar" || ext == "PDF") {
            let filename = link.slice(link.lastIndexOf("/"),link.length ).slice(1)
    
            fetch(link)
            .then(resp => resp.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            })
    
        }else{
            let sliceOne = link.slice(link.lastIndexOf("/"))
            let filename = sliceOne.slice(0,sliceOne.lastIndexOf("?")).slice(1)
    
            fetch(link)
            .then(resp => resp.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            })
    
        }
    }
}

// Defining delay
const delayLoop = (fn, delay) => {
    return (link, i) => {
        setTimeout(() => {
        fn(link);
        }, i * delay);
    }
}

// Utils for prod export
let prodsArray = []

// Listerners for Bulk Export
document.getElementById("addUrlField").addEventListener("click",()=>{
    
    let urlField = document.createElement("div")
    urlField.classList.add("form-group","bulk-scrape-field")
    urlField.innerHTML = `
    <input type="text" class="form-control" placeholder="Enter url">
    `

    document.getElementById("main-bulk-scrape").appendChild(urlField)
})

document.getElementById("deleteAllFields").addEventListener("click",()=>{
    localStorage.removeItem("bulk-scrape-urls")
    setTimeout(() => {
        location.reload()
    }, 900);
})

document.getElementById("saveUrlFields").addEventListener("click",()=>{

    let mainSection = document.getElementById("main-bulk-scrape")
    let inps = mainSection.getElementsByTagName("input")

    let urls = []

    for (let i = 0; i < inps.length; i++) {
        const inp = inps[i];
        if (inp.value != "") {
            urls.push({url: inp.value})
        }
    }

    // Saving
    console.log("Saving urls..", urls);
    localStorage.setItem("bulk-scrape-urls", JSON.stringify(urls))
    console.log("Urls stored successfully");

    document.getElementById("bulk-scrape-success-banner").style.display = "block"
    setTimeout(() => {
        location.reload()
    }, 900);

})

document.getElementById("startBulkExport").addEventListener("click",()=>{

    // Getting sitemap
    let sitemap = JSON.parse(localStorage.getItem("sitemap"))

    // Gathering links for bulk scraping
    let inps = document.getElementById("main-bulk-scrape").getElementsByTagName("input")
    let urlFields = []
    for (let j = 0; j < inps.length; j++) {
        const url = inps[j].value
        if (url !== "") {
            urlFields.push({url: url})
        }   
    }

    // Getting other essential info
    let waitForLoad = document.querySelector("#waitForLoad").value 
    waitForLoad = waitForLoad !== "" ? waitForLoad : 4
    let waitForClose = document.querySelector("#interval").value 
    waitForClose = waitForClose !== "" ? waitForClose : 5

    // Starting the bulk scrape process
    if (sitemap != null) {

        if (confirm(`Do you want to start scraping ${urlFields.length} links ?`)) {

            // Showing Progress
            document.querySelector("#progress-box").style.display = "block"

            // Open up popup
            // Beam sitemap
            // Get beamed back with scraped Data
            getScrapedData(urlFields, sitemap, waitForLoad, waitForClose)
        }
        
    }else if(sitemap == null){
        alert("Create or import a sitemap first !")
    }
})

document.getElementById("export-btn-2").addEventListener("click", ()=>{
    clearTable()
    createInvisibleTable()
    toCSV()
})

window.addEventListener("message",(event)=>{
    let response = event.data

    if (response.context == "scraped data" && response.from == "ext") {
        
        if (response.status == "success") {
            let scrapedData = response.scrapeddata
            let urlScraped = response.url
            
            // Show Success Log
            showSuccessLog(urlScraped)

            // append preview
            createPreviewBox(scrapedData)

            // Append to json array for site export
            // prodsArray.push(scrapedData)
            
            // Append scraped data to table
            // appendDataRow(scrapedData)

            // Extract links from scraped data
            let linksToDownload = gatherLinks(scrapedData)

            // Download those links one by one
            downloadInExtContext(linksToDownload)
            .then(console.log)
            .catch(console.error)

        } else {
            showFailLog(response.url)
        }

        event.source.close()
    }

})
