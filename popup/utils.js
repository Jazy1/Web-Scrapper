
function isElementThere(selector) {
    let selection = document.querySelector(selector) !== null
    return selection
}

function createTableHeader(sitemap) {
  let dataTable = document.getElementById("data-table")
  let dataTableBody = document.createElement("tbody")
  dataTableBody.setAttribute("id","data-table-body")

  // Row for heading
  let rowHeading = document.createElement("tr")
  let haveProdAttriCameBefore = false
  let haveGroupedTextCameBefore = false

  for (let i = 0; i < sitemap.length; i++) {
      const headingType = sitemap[i].type
      const headingName = sitemap[i].name

      // Making heads
      let heading = document.createElement("th")

      switch (headingType) {

        case "product-attribute":
          if ( !haveProdAttriCameBefore ) {
            heading.innerHTML = `<input type="text" class="no-shit" value="Filered Attributes" readonly>`
            rowHeading.appendChild(heading) 

            haveProdAttriCameBefore = true
          }
          break;
      
        case "grouped-text":
          if ( !haveGroupedTextCameBefore ) {
            heading.innerHTML = `<input type="text" class="no-shit" value="Grouped Text" readonly>`
            rowHeading.appendChild(heading) 

            haveGroupedTextCameBefore = true
          }
          break;

        default:
          heading.innerHTML = `<input type="text" class="no-shit" value="${headingName}" readonly>`
          rowHeading.appendChild(heading) 
          break
      }

  }

  // appending head to table
  dataTableBody.appendChild(rowHeading)
  dataTable.appendChild(dataTableBody)

}

// function appendDataRow(scrapedDataFromPopup) {
//   let dataTableBody = document.getElementById("data-table-body")
//   let dataRow = document.createElement("tr")
//   let haveProdAttriCameBefore = false

//   for (let j = 0; j < scrapedDataFromPopup.length; j++) {
//     const field = scrapedDataFromPopup[j];
//     let type = field.type
//     let name = field.name
//     let data = field.scraped

//     // create seperate object for product attributes and then use that
//     let cell = document.createElement("td")
//     switch (type) {
//       case "product-attribute":
//         if ( !haveProdAttriCameBefore ) {

//           for (let k = 0; k < scrapedDataFromPopup.length; k++) {
//             const theField = scrapedDataFromPopup[k];
//             let theType = theField.type
//             let theName = theField.name
//             let theData = theField.scraped

//             if (theType == "product-attribute") {
//               cell.textContent += `${theName} | ${theData} \n `
//             }
//           }
          
//           haveProdAttriCameBefore = true
//           dataRow.appendChild(cell)    
//         }
        
//         break;
        
//       default:
//         cell.innerText = data  
//         dataRow.appendChild(cell)    
//     }
//   }

//   dataTableBody.appendChild(dataRow)
// }

function appendDataRow(scrapedData) {

  let dataTableBody = document.getElementById("data-table-body")
  let dataRow = document.createElement("tr")
  let haveProdAttriCameBefore = false
  let haveGroupedTextCameBefore = false

  for (let j = 0; j < scrapedData.length; j++) {
    const field = scrapedData[j];
    let type = field.type
    let name = field.name
    let data = field.scraped

    // create seperate object for product attributes and then use that
    let cell = document.createElement("td")
    switch (type) {
      case "product-attribute":
        if ( !haveProdAttriCameBefore ) {
          cell.innerHTML += `<input type="text" class="no-shit" value="" readonly>`

          for (let k = 0; k < scrapedData.length; k++) {
            const theField = scrapedData[k];
            let theType = theField.type
            let theName = theField.name
            let theData = theField.scraped

            if (theType == "product-attribute") {
              cell.getElementsByTagName("input")[0].value += `${theName} : ${theData} | \n`
              // cell.innerHTML += `<input type="text" class="no-shit" value="${theName} | ${theData} \n">  ` 
            }
          }
          
          haveProdAttriCameBefore = true
          dataRow.appendChild(cell)    
        }
        
        break;
      
      case "grouped-text":
        if ( !haveGroupedTextCameBefore ) {
          cell.innerHTML += `<input type="text" class="no-shit" value="" readonly>`

          for (let k = 0; k < scrapedData.length; k++) {
            const theField = scrapedData[k];
            let theType = theField.type
            let theName = theField.name
            let theData = theField.scraped

            if (theType == "grouped-text") {
              cell.getElementsByTagName("input")[0].value += `${theData} | \n`
              // cell.innerHTML += `<input type="text" class="no-shit" value="${theName} | ${theData} \n">  ` 
            }
          }
          
          haveGroupedTextCameBefore = true
          dataRow.appendChild(cell)    
        }
        
        break;
      
      case "empty":
        cell.innerHTML = `<input type="text" class="no-shit" value="${data}" readonly>`   
        dataRow.appendChild(cell)
        
        break;
        
      default:
        cell.innerHTML = `<input type="text" class="no-shit" value="${data}" readonly>`   
        dataRow.appendChild(cell)
        break;
    }
  }

  dataTableBody.appendChild(dataRow)
}

// Scrapes data in popup and saves it into localstorage
function scrapeInPopup() {
  let inps = document.querySelector("#section-fields").getElementsByTagName("input")
  let scrapedDataFromPopup = []

  for (let i = 0; i < inps.length; i++) {
    const inp = inps[i];
    const type = inp.dataset.type
    const name = inp.id
    const scraped = inp.value

    scrapedDataFromPopup.push({type: type, name: name, scraped:scraped})
  }

  localStorage.setItem("scrapedInPopup",JSON.stringify(scrapedDataFromPopup))
  // console.log(scrapedDataFromPopup);

  return scrapedDataFromPopup
}

function createTable(sitemap, scrapedDataFromPopup) {

  let dataTable = document.getElementById("data-table")

  // create table header
  createTableHeader(sitemap)

  // Append table with data
  appendDataRow(scrapedDataFromPopup)

  // return back 
  return dataTable

}

function toTable() {
    // Table components
    let dataTable = document.getElementById("data-table")
    let dataTableBody = document.createElement("tbody")

    // Removal of previous table
    dataTable.innerHTML = ""

    let labels = document.querySelectorAll("label")
    let fields = document.querySelectorAll("input")

    // Row for heading
    let rowHeading = document.createElement("tr")
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        
        // Making heads
        let heading = document.createElement("th")
        heading.innerText = `${label.innerText}`
        rowHeading.appendChild(heading)  
    }
    // appending head
    dataTableBody.appendChild(rowHeading)


    // row for data
    let rowBody = document.createElement("tr")
    for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        
        let data = document.createElement("td")
        data.innerText = `${field.value}`
        rowBody.appendChild(data)
    }
    dataTableBody.appendChild(rowBody)

    // Final appending
    dataTable.appendChild(dataTableBody)

    return dataTable
}
  
function toCSV() {
    let table = document.getElementById("data-table")
    let anchor = document.getElementById("download-csv")

    ExcellentExport.csv(anchor, table, "product")

    setTimeout(()=>{
        anchor.style.display = "block"
    },800)

}

function scrape(sitemap) {
  
  let scrapedData = []

  for (let i = 0; i < sitemap.length; i++) {
    const field = sitemap[i];
    switch (field.type) {
      case "text":
        let text = isElementThere(field.selector) ? document.querySelector(field.selector).innerText : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:text})
        break;
      case "link":
        let link = isElementThere(field.selector) ? document.querySelector(field.selector).getAttribute("href") : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:link})
        break;
      case "image":
        let pic = isElementThere(field.selector) ? document.querySelector(field.selector).currentSrc : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped: pic})
        break;
      case "link-with-download":
        let linkWithDownload = isElementThere(field.selector) ? document.querySelector(field.selector).getAttribute("href") : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:linkWithDownload})
        break;
      case "image-with-download":
        let picWithDownload = isElementThere(field.selector) ? document.querySelector(field.selector).currentSrc : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:picWithDownload})
        break;
      case "empty":
        scrapedData.push({type: field.type, name: field.name})
        break;
    }
  }
 
  return scrapedData
}

async function downloadInExtContext (arrayOfLinks) {
  // console.log(arrayOfLinks);
    for (let i = 0; i < arrayOfLinks.length; i++) {
      const link = arrayOfLinks[i].scraped
      let filename = arrayOfLinks[i].name
      console.log(link);
      let ext = link.slice(link.length - 3)
      const x = await new Promise(resolve => {
        // Solution if using within popup or any file used by extension

        if (ext == "rar" || ext == "zip") {
          setTimeout(function(){
            chrome.tabs.create({url: link, active: false }, tab =>{
              setTimeout(function(){
                chrome.tabs.remove(tab.id);
                resolve("Downloaded" + link)
              },2000);
            }); 
          },1000);
        }
        
        else{
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
          resolve("Downloaded" + link)
          })
        }

      })
    }
    return 'done'
}
  
async function downloadInWebContext (arrayOfLinks) {
    for (let i = 0; i < arrayOfLinks.length; i++) {
        const link = arrayOfLinks[i]
        const x = await new Promise(resolve => {

        // If using within js running within browser and you don't want to loose extension popup
        setTimeout(()=>{
            // window.open(link,"_blank")
            // window.open(link, "_blank", "height: 100px , width: 100px");
            resolve("Downloaded" + link)
        },2000)
        
        })
    }
    return 'done'
}
  
function showDataIntoFields(dataArray) {
    let inps = document.getElementsByClassName("form-group")

    for (let i = 0; i < inps.length; i++) {
      const inputWrapper = inps[i];
      let scrapedData = dataArray[i].scraped == undefined ? "" : dataArray[i].scraped 
      inputWrapper.getElementsByTagName("input")[0].value = scrapedData
    }
}

function getScrapedData(sitemap, callback) {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs)=> {
    let portToContent = chrome.tabs.connect(tabs[0].id)

    portToContent.onMessage.addListener((message)=>{

      if (message.sender == "content" && message.recipient == "popup" && message.action =="give-sitemap") {
        let messageToSend = {
          sender: "popup",
          recipient: "content",
          action: "give-scrapedData",
          data: sitemap
        }
        portToContent.postMessage(messageToSend)
      }
      else if(message.sender == "content" && message.recipient == "popup" && message.action =="giving-scrapedData"){
        callback(message.data)
      }   
      else{
        console.log("Wrong headers")
      }
    })
  })

}

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

function downloadWithCSV() {
  // let scrapedData = JSON.parse(localStorage.getItem("scraped-data"))
  let sitemap = JSON.parse(localStorage.getItem("sitemap"));
  // let scrapedDataFromPopup = JSON.parse(localStorage.scrapedInPopup)
  let scrapedDataFromPreview = scrapeThePreview()
  console.log(scrapedDataFromPreview[0]);
  
  // For csv
  // let table = createTable(sitemap,scrapedDataFromPopup)
  let table = document.getElementById("data-table")
  let anchor = document.getElementById("download-csv")
  ExcellentExport.csv(anchor, table, "product")
  anchor.click()
  
  // For Download
  let links = gatherLinks(scrapedDataFromPreview[0])
  console.log(links);
  downloadInExtContext(links)
  .then(console.log)
  .catch(console.error)

}

// Update the connection message in popup
function updateConnectionStatus() {
  let connection = localStorage.getItem("connection")
  if (connection != null && !connection.isAuthorized) {
    document.querySelector("#status-not-connected").setAttribute("hidden", "")
    document.querySelector("#status-connected").removeAttribute("hidden")
  } else {
    document.querySelector("#status-connected").setAttribute("hidden", "")
    document.querySelector("#status-not-connected").removeAttribute("hidden")
  }
}

// Constructs the Link for product upload
function constructLink(domain, consumerKey, consumerSecert) {    
  domain = domain.slice(domain.length - 1) != "/" ? domain : domain.slice(0,-1)
  return `https://${domain}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecert}`
}

