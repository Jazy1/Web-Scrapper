let curr = new Date()
let aj = curr.getDate()
let mahi = curr.getMonth() + 1
console.log(`Today: ${aj}/${mahi}`);

// if( mahi == 3 ) {
    // check starrt

    // if (aj<=15) {
        
        window.addEventListener("DOMContentLoaded",()=>{
            
            let sitemap = JSON.parse(localStorage.getItem("sitemap"));
            let bulkScrapeUrls = JSON.parse(localStorage.getItem("bulk-scrape-urls"));
            let connection = JSON.parse(localStorage.getItem("connection"));
            let loadTime = localStorage.getItem("cat-load-time");
    
            // General
            document.querySelector("input#category-load-time").value = loadTime
    
            // Connection
            if (connection != null) {
                if (connection.isAuthorized) {
                    document.querySelector("#site-domain").value = connection.domain
                    document.querySelector("#consumer-key").value = connection.consumer_key
                    document.querySelector("#consumer-secert").value = connection.consumer_secert
                    updateConnectionStatus()
                }
            }else{
                updateConnectionStatus()
            }
    
            // Sitemap
            if (sitemap != null) {
                document.getElementById("display-sitemap").value = JSON.stringify(sitemap)
    
                for (let i = 0; i < sitemap.length; i++) {
                    const field = sitemap[i];
            
                    let inputWrapper = document.createElement("div")
                    inputWrapper.classList.add("form-group", "form-group-fields")
                    inputWrapper.innerHTML = `
                    <label>Type</label>
                    <select class="form-select field-type" >
                        <option value="${field.type}" selected>${field.type}</option>
                        <option value="empty">Empty</option>
                        <option value="text">Text</option>
                        <option value="sub-category">Sub Category</option>
                        <option value="product-attribute">Filered Attributes</option>
                        <option value="link">Link</option>
                        <option value="image">Image Link</option>
                        <option value="link-with-download">Link with Download</option>
                        <option value="image-with-download">Image with Download</option>
                        <option value="grouped-text">Grouped Text</option>
                    </select>
            
                    <label>Selector</label>
                    <input type="text" class="form-control field-selector" placeholder="Enter selector" value="${field.selector}">
            
                    <label>${field.name}</label>
                    <input type="text" class="form-control field-name" placeholder="Enter Name" value="${field.name}">
                    `
            
                    document.getElementById("main-fields").appendChild(inputWrapper)
                }
            }
            
            // BulkScrape URLS
            if(bulkScrapeUrls != null){
                for (let i = 0; i < bulkScrapeUrls.length; i++) {
                    const url = bulkScrapeUrls[i].url;
    
                    let urlField = document.createElement("div")
                    urlField.classList.add("form-group","bulk-scrape-field")
                    urlField.innerHTML = `
                    <input type="text" class="form-control" placeholder="Enter url" value="${url}">
                    `
            
                    document.getElementById("main-bulk-scrape").appendChild(urlField)
                } 
            }
    
            // Table Headers
            // if (sitemap != null) {
            //     createTableHeader(sitemap)
            // }
            
        })

    // }

    // check ends

// } 