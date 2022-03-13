// function createTableHeader(sitemap) {
//     let headerWrapper = document.getElementById("table-body")

//     let header = document.createElement("tr")
//     for (let i = 0; i < sitemap.length; i++) {
//         const name = sitemap[i].name;

//         let head = document.createElement("th")
//         head.innerText = name
//         header.appendChild(head)  

//     }
//     headerWrapper.appendChild(header)
// }

// Creates Table Headers for Preview
function createTableHeader(sitemap) {
  let dataTable = document.getElementById("data-table")
  let dataTableBody = document.createElement("tbody")
  dataTableBody.setAttribute("id","table-body")

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
            heading.innerHTML = `<input type="text" class="no-shit" value="Filered Attributes">`
            rowHeading.appendChild(heading) 

            haveProdAttriCameBefore = true
          }
          break;
        
        case "grouped-text":
          if ( !haveGroupedTextCameBefore ) {
            heading.innerHTML = `<input type="text" class="no-shit" value="Grouped Text">`
            rowHeading.appendChild(heading) 

            haveGroupedTextCameBefore = true
          }
          break;

        default:
          heading.innerHTML = `<input type="text" class="no-shit" value="${headingName}">`
          rowHeading.appendChild(heading) 
      }

  }

  // appending head to table
  dataTableBody.appendChild(rowHeading)
  dataTable.appendChild(dataTableBody)
}

// Takes scraped data and append it for preview
function appendDataRow(scrapedData) {

  let dataTableBody = document.getElementById("table-body")
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
          cell.innerHTML += `<input type="text" class="no-shit" value="">`

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
          cell.innerHTML += `<input type="text" class="no-shit" value="">`

          for (let k = 0; k < scrapedData.length; k++) {
            const theField = scrapedData[k];
            let theType = theField.type
            let theName = theField.name
            let theData = theField.scraped

            if (theType == "grouped-text") {
              cell.getElementsByTagName("input")[0].value += `${theName} : ${theData} | \n`
              // cell.innerHTML += `<input type="text" class="no-shit" value="${theName} | ${theData} \n">  ` 
            }
          }
          
          haveGroupedTextCameBefore = true
          dataRow.appendChild(cell)    
        }
        
        break;
      
      case "empty":
        cell.innerHTML = `<input type="text" class="no-shit" value="${data}">`   
        dataRow.appendChild(cell)
        
        break;
        
      default:
        cell.innerHTML = `<input type="text" class="no-shit" value="${data}">`   
        dataRow.appendChild(cell)
        break
    }
  }

  dataTableBody.appendChild(dataRow)
}

// function appendTable(scrapedData) {
//     let tableBody = document.getElementById("table-body")
//     let dataRow = document.createElement("tr")

//     for (let i = 0; i < scrapedData.length; i++) {
//         const data = scrapedData[i].scraped;
//         data == undefined ? data : ""

//         let dataCell = document.createElement("td")

//         dataCell.innerText = data
//         dataRow.appendChild(dataCell)
        
//     }

//     tableBody.appendChild(dataRow)
// }

async function downloadInExtContext (arrayOfLinks) {
    // console.log(arrayOfLinks);
      for (let i = 0; i < arrayOfLinks.length; i++) {
        const link = arrayOfLinks[i].scraped
        let filename = arrayOfLinks[i].name
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

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}

// Update the connection message in config box
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

function revokeAuthorization() {
  localStorage.removeItem("connection")
  document.querySelector("#site-domain").value = ""
  document.querySelector("#consumer-key").value = ""
  document.querySelector("#consumer-secert").value = ""
  updateConnectionStatus()
}

