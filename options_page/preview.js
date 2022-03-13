
// Create preview box inside preview section with updated data
function createPreviewBox(scrapedData) {
    let previewBoxesWrapper = document.querySelector("#preview-boxes")
    let previewBoxWrapper = document.createElement("div")
    previewBoxWrapper.classList.add("section")
    let haveGroupedTextCameBefore = false
    
    scrapedData.forEach(data => {
        let type = data.type
        let name = data.name
        let scraped = data.scraped

        let formGroup = document.createElement("div")
        formGroup.classList.add("form-group")


        switch (type) {
            
            case "grouped-text":
                if ( !haveGroupedTextCameBefore ) {
                    formGroup.innerHTML = `
                    <label for="Groupies">Grouped Text</label>
                    <input type="text" class="form-control" id="" placeholder="Grouped Text" data-name="grouped-text" data-type="${type}" value="">
                    `

                    for (let k = 0; k < scrapedData.length; k++) {
                        const theField = scrapedData[k];
                        let theType = theField.type
                        let theName = theField.name
                        let theData = theField.scraped

                        if (theType == "grouped-text") {
                            formGroup.getElementsByTagName("input")[0].value += `${theName} : ${theData} | \n`
                        }
                    }
                    
                    haveGroupedTextCameBefore = true
                    previewBoxWrapper.appendChild(formGroup)
                }
                
                break;
            
            case "empty":
                formGroup.innerHTML = `
                    <label for="${name}">${name}</label>
                    <input type="text" class="form-control" id="${name}" placeholder="${name}" data-name="${name}" data-type="${type}" value="">
                `
                previewBoxWrapper.appendChild(formGroup)
                
                break;
                
            default:
                formGroup.innerHTML = `
                    <label for="${name}">${name}</label>
                    <input type="text" class="form-control" id="${name}" placeholder="${name}" data-name="${name}"  data-type="${type}" value="${scraped}">
                `
                previewBoxWrapper.appendChild(formGroup)
                break;
        }

    });

    previewBoxesWrapper.appendChild(previewBoxWrapper)
}

// Scrapes the preview section
function scrapeThePreview() {
    let scrapedData = []
    let currentProd = []
    let previewBoxes = document.querySelector("#preview-boxes").getElementsByClassName("section")

    for (let i = 0; i < previewBoxes.length; i++) {
        const previewBox = previewBoxes[i];
        
        let inps = previewBox.getElementsByTagName("input")
        for (let j = 0; j < inps.length; j++) {
            const inp = inps[j];
            
            let type = inp.dataset.type
            let name = inp.dataset.name
            let scraped = inp.value
            
            currentProd.push({"type":type, "name": name, "scraped":scraped})
        }

        scrapedData.push(currentProd)
        currentProd= []
    }

    return scrapedData
}

// Creating the invisible table from the preview fields
function createInvisibleTable() {
    let sitemap = JSON.parse(localStorage.getItem("sitemap"));
    let scrapedFromPreview = scrapeThePreview()
    if (sitemap != null) {
        createTableHeader(sitemap)
        scrapedFromPreview.forEach(scraped => {
            appendDataRow(scraped)
        });
    }
}

// Clears Table
function clearTable() {
    document.getElementById("data-table").innerHTML= ""
}

// Create preview boxes and invisible table
function makePreview() {
    createPreviewBox(scrapeInPopup())
    createInvisibleTable()
}

// Clears preview boxes and table of any content
function clearPreview() {
    document.getElementById("preview-boxes").innerHTML= ""
    document.getElementById("data-table").innerHTML= ""
}