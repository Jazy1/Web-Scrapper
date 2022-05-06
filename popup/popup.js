window.addEventListener('DOMContentLoaded', () => {

  updateConnectionStatus()

  if (sitemap != null) {

    // Showing fields according to sitemap
    if (sitemap != null) {
      for (let i = 0; i < sitemap.length; i++) {
        const scrapedField = sitemap[i];

        let inputWrapper = document.createElement("div")
        inputWrapper.classList.add("form-group")
        inputWrapper.innerHTML = `
            <label for="${scrapedField.name}">${scrapedField.name}</label>
            `
        // <input type="text" class="form-control" id="${scrapedField.name}" placeholder="${scrapedField.name}" data-type="${scrapedField.type}">

        let theInp = document.createElement("input")
        theInp.classList.add("form-control")
        theInp.id = scrapedField.name
        theInp.placeholder = scrapedField.name
        theInp.dataset.type = scrapedField.type
        theInp.oninput = () => {
          clearPreview();
          makePreview()
        }
        inputWrapper.appendChild(theInp)

        document.getElementById("section-fields").appendChild(inputWrapper)
      }
    }

    // Getting Scraped Data
    getScrapedData(sitemap, function (scrapedData) {
      showDataIntoFields(scrapedData)
    })


    // Get preview ready
    setTimeout(() => {
      makePreview()
    }, 500)

    // Show saved fields selections, if any
    showSelections()

  }

});

let sitemap = JSON.parse(localStorage.getItem("sitemap"));

// Listners
document.getElementById("preview-btn-1").addEventListener("click", () => {
  clearPreview()
  makePreview()
})

document.getElementById("preview-btn-2").addEventListener("click", () => {
  clearPreview()
  makePreview()
})

document.getElementById("export-btn-1").addEventListener("click", () => {
  clearTable()
  createInvisibleTable()
  toCSV()
})

document.getElementById("export-btn-2").addEventListener("click", () => {
  clearTable()
  createInvisibleTable()
  toCSV()
})

document.getElementById("download-csv-with-files").addEventListener("click", () => {
  clearTable()
  createInvisibleTable()
  downloadWithCSV()
})