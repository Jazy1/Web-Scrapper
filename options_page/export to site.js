

// Constructs the Link for ping
function constructLink(domain, consumerKey, consumerSecert) {    
    domain = domain.slice(domain.length - 1) != "/" ? domain : domain.slice(0,-1)
    return `https://${domain}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecert}`
}

// Populating all selects with sitemap field names
// function fieldSelectionForProd() {
//     let theBoxes = document.getElementsByClassName("selection-boxes")
//     let sitemap = JSON.parse(localStorage.getItem("sitemap"))

//     for (let i = 0; i < theBoxes.length; i++) {
//         const box = theBoxes[i];
        
//         let theSelect = box.getElementsByTagName("select")[0]
//         if (sitemap != null) {

//             sitemap.forEach(field => {
//                 let theOption = document.createElement("option")
//                 theOption.innerText = field.name
//                 theOption.value = field.name
//                 theSelect.appendChild(theOption)
//             });
//         }
//     }
// }

function getCategories() {
    let connection = JSON.parse(localStorage.getItem("connection"))
    let categories = []
    if (connection != null && connection.isAuthorized) {

    fetch(`https://${connection.domain}/wp-json/wc/v3/products/categories?consumer_key=${connection.consumer_key}&consumer_secret=${connection.consumer_secert}`)
    .then((response)=>{
        return response.json()
    })
    .then(data => {
        data.forEach(dataa => {
        categories.push({"id":dataa.id, "name": dataa.name})
        })
    })
    .catch(error => {
        switch (error.name) {
            case "TypeError":
                console.log("Please enter correct domain name with woocommerce installed on it.")
                break;
        
            default:
                console.log(error.name + " : " + error.message) 
                break;
        }            
    })

    return categories
    }
}

let categories = getCategories()

function addSelectionBox() {

    let thebBox = document.querySelector("#fields-selection-for-prod")
    let sitemap = JSON.parse(localStorage.getItem("sitemap"))
    let fields = scrapeThePreview()
    
    // wrapper
    let selectionBox = document.createElement("div")
    selectionBox.setAttribute("style", "display:flex;justify-content:space-between;margin: 10px 0px;")
    selectionBox.classList.add(["selection-boxes"])

    // Options for fields populated using sitemap
    let fieldOptions = `<option selected style="display: none;" value="none">none</option>` 

    fields[0].forEach(field => {
        fieldOptions = fieldOptions + `<option value="${field.name}" data-field-type="${field.type}">${field.name}</option>`
    });



    // Creating wrapper for properties 
    let propertiesWrapper = document.createElement("div")
    propertiesWrapper.setAttribute("style","width: 50%; display: flex; align-items: center; justify-content: center;")
    // Creating Select along with it's shit
    let propertiesSelect = document.createElement("select")
    propertiesSelect.setAttribute("name", "propertyName")
    propertiesSelect.setAttribute("style", "max-height: 50px; overflow: auto;")

    propertiesSelect.innerHTML = `<option selected style="display: none;" value="">none</option>` + `
        <option value="name" data-show-name="Name">Name</option>
        <option value="description" data-show-name="Description">Description</option>
        <option value="short_description" data-show-name="Short Description">Short Description</option>
        <option value="sku" data-show-name="SKU">SKU</option>
        <option value="regular_price" data-show-name="Regular Price">Regular Price</option>
        <option value="sale_price" data-show-name="Sale Price">Sale Price</option>
        <option value="images" data-show-name="Image">Image</option>
        <option value="attributes" data-show-name="Attribute">Attribute</option>
        <option value="categories" data-show-name="Category">Category</option>
        <option value="tags" data-show-name="Tag">Tag</option>
    ` 
    propertiesSelect.addEventListener("change", (e)=>{
        if (e.target.value == "categories") {
            let selectionBox = e.target.parentNode.parentNode
            // showing categories
            selectionBox.getElementsByTagName("select")[2].parentNode.removeAttribute("hidden")
            // hiding other shit
            selectionBox.getElementsByTagName("select")[1].parentNode.setAttribute("hidden", "")
        }else{
            // showing other shit
            selectionBox.getElementsByTagName("select")[1].parentNode.removeAttribute("hidden")
            // hiding categories
            selectionBox.getElementsByTagName("select")[2].parentNode.setAttribute("hidden", "")

        }
    })
    // Appending select into propertieswrapper
    propertiesWrapper.appendChild(propertiesSelect)



    // Creating wrapper fieldNames
    let fieldsWrapper = document.createElement("div")
    fieldsWrapper.setAttribute("style","width: 50%; display: flex; align-items: center; justify-content: center;")
    // Creating Select with it's shit
    let fieldsSelect = document.createElement("select")
    fieldsSelect.setAttribute("name", "fieldName")
    fieldsSelect.innerHTML = `
        ${fieldOptions}
    `
    // Appending select into fieldsName wrapper
    fieldsWrapper.appendChild(fieldsSelect)



    
    // Creating wrapper categories
    let catWrapper = document.createElement("div")
    catWrapper.setAttribute("style","width: 50%; display: flex; align-items: center; justify-content: center;")
    catWrapper.setAttribute("hidden","")
    // Creating Select with it's shit
    let catOptions = ``
    categories.forEach(category => {
        catOptions += `<option value="${category.name}" data-category-id="${category.id}">${category.name}</option>`
    });
    let catSelect = document.createElement("select")
    catSelect.setAttribute("name", "categories")
    catSelect.innerHTML = `
        <option selected style="display: none;" value="none">none</option>
        ${catOptions}
    `
    // Appending select into fieldsName wrapper
    catWrapper.appendChild(catSelect)


    
    // Appending both wrappers into selectionBox
    selectionBox.appendChild(propertiesWrapper)
    selectionBox.appendChild(fieldsWrapper)
    selectionBox.appendChild(catWrapper)



    thebBox.appendChild(selectionBox)
}

function fieldSelectionForProd() {
    let theBoxes = document.getElementsByClassName("selection-boxes")
    let sitemap = JSON.parse(localStorage.getItem("sitemap"))



    for (let i = 0; i < theBoxes.length; i++) {
        const box = theBoxes[i];
        
        let thePropertySelect = box.getElementsByTagName("select")[0]
        
        // thePropertySelect.addEventListener("focus",()=>{this.size=10; console.log("doggy");})
        // thePropertySelect.addEventListener("blur",()=>{this.size=1})
        // thePropertySelect.addEventListener("change",()=>{this.size=1;this.blur})

        let theFieldSelect = box.getElementsByTagName("select")[1]
        // if (sitemap != null) {

    //         sitemap.forEach(field => {
    //             let theOption = document.createElement("option")
    //             theOption.innerText = field.name
    //             theOption.value = field.name
    //             theSelect.appendChild(theOption)
    //         });
        // }
    }
}

// Authorizes the credentials entered by user. If right, will "connect" to that site or just save credentials and update isAuthorized variable. If not or in case of any error, will show that something is not correct so try again.
function authorize() {

    // scraping user input. Any of them could not be empty
    let domain = (document.querySelector("#site-domain").value).trim()
    let consumerKey = (document.querySelector("#consumer-key").value).trim()
    let consumerSecert = (document.querySelector("#consumer-secert").value).trim()

    if (domain == "" || consumerKey == "" || consumerSecert == "") {
        alert("Cannot connect with empty fields.")
    }else{
        // Ping the products api
        let pingLink = constructLink(domain, consumerKey, consumerSecert);
        // console.log(pingLink);

        document.querySelector("#spinner").removeAttribute("hidden")
        fetch(pingLink)
        .then(response =>
            response.status
        )
        .then(data => {
            document.querySelector("#spinner").setAttribute("hidden", "")
            // Check for response code
            switch (data) {
                case 200:
                    // If 200, then save all 3 in json and show success message in alert and then update the status
                    let conEntry = {
                        "isAuthorized": true,
                        "domain": domain,
                        "consumer_key": consumerKey,
                        "consumer_secert": consumerSecert
                    }
                    localStorage.setItem("connection", JSON.stringify(conEntry))
                    updateConnectionStatus()
                    alert("Authorized. You can now import products directly into your site.")
                    break;
                
                // In case of 401, or any error, handle it 
                case 401:
                    alert("Cannot Authorize. Please enter correct consumer key and consumer secert.")
                    revokeAuthorization()
                    break;
                    
                case 404:
                    alert("Page Not Found.")
                    revokeAuthorization()
                    break;
                    
                default:
                    alert(`Some Error Occured. Response Code: ${data}`)
                    revokeAuthorization()
                    break;
            }
        })
        .catch(error => {
            document.querySelector("#spinner").setAttribute("hidden", "")
            switch (error.name) {
                case "TypeError":
                    alert("Please enter correct domain name with woocommerce installed on it.")
                    break;
            
                default:
                    alert(error.name + " : " + error.message) 
                    break;
            }
        })
    }
}

function showSpinner() {
    document.querySelector("#gol-gol").removeAttribute("hidden")
}

function hideSpinner() {
    document.querySelector("#gol-gol").setAttribute("hidden", "")
}

function resetProgress() {
    document.querySelector("#progress-heading").innerText = "Exporting..."
    document.querySelector("#notification-bulkscrape").innerText = "Export in progress. Don't reload or close this window"
    document.querySelector("#logs").innerHTML = ""
}

function successfullyExported() {
    let successLog = document.createElement("div")
    successLog.classList.add("alert", "alert-success")
    successLog.role = "alert"
    successLog.innerHTML = `
    <p style="overflow-wrap: break-word; display:inline"> Product</p> added successfully.
    `
    document.getElementById("logs").appendChild(successLog)
}

function notSuccessfullyExported(url, error) {
    let failLog = document.createElement("div")
    failLog.classList.add("alert", "alert-danger")
    failLog.role = "alert"
    failLog.innerHTML = `
    Cannot export <a href=${url}> ${url} </a>. ${error}.
    `
    document.getElementById("logs").appendChild(failLog)
}


function ExportToSite() {
    let theBoxes = Array.from(document.querySelector("#fields-selection-for-prod").getElementsByClassName("selection-boxes"))
    let connectionInfo = localStorage.connection != undefined ? JSON.parse(localStorage.connection) : undefined
    let payload = []
    resetProgress()

    // Validation to see if the required fields don't have none OR if we are not connected to site yet.

    if (connectionInfo == undefined ) {
        alert("You are not connected to any site.")
    }else{

        // Creation of  payload
        prodsArray.forEach(product => { 
            let prodForPayload = {}
            let images = []
            let attributes = []
            let tags = []
            let categories = []
                    
            theBoxes.forEach(box => { 
                let selects = box.getElementsByTagName("select")
                let propertyName = selects[0].value
                let fieldName = selects[1].value

                switch (propertyName) {
                    case "categories":
                        let catId = selects[2].options[selects[2].selectedIndex].dataset.categoryId
                        let value = selects[2].value
                        if (value!="none") {
                            categories.push({"id": catId})
                        }
                        break;
                }
                
                product.forEach(scraped => {

                    switch (scraped.type) {
                    
                        default:
                            if (fieldName == scraped.name) {
                                
                                switch (propertyName) {
                                    case "images":
                                        let picLink = scraped.scraped
            
                                        // filters can go here
                                        // Remove params
                                        picLink = picLink.substring(0,picLink.lastIndexOf("?")) == "" ? picLink : picLink.substring(0,picLink.lastIndexOf("?"))
                                        // Dealing with extensions
                                        let extension = picLink.split(".").pop()
                                        let allowedExtensions = ["jpg", "jpeg", "png"]
                                        
                                        allowedExtensions.forEach((allowedExt, iteration) => {
                                            if (extension == allowedExt) {
                                                picLink = picLink.substring(0, picLink.indexOf(extension) + extension.length)
                                            }else if(extension == "webp"){
                                                // To deal with aliexpress multiple exntesions case, trying to fix it
                                                if (iteration == 0) {
                                                    let firstExt = picLink.split(".")[4]
                                                    picLink = picLink.substring(0, picLink.indexOf(firstExt) + (firstExt.length - 1))
            
                                                    if (picLink.split(".").pop() == "webp") {
                                                        console.log("tried to fix but fuck u webp format");
                                                    }
                                                }
                                            }
                                        },);
            
                                        images.push({"src": picLink})
                                        break;
            
                                    case "attributes":
                                        attributes.push({"name": scraped.name, "visible": true, "options":[scraped.scraped]})
                                        break;
                                    
                                    case "tags":
                                        tags.push({"name": scraped.scraped})
                                        break;
                                
                                    default:
                                        prodForPayload[propertyName] = scraped.scraped
                                        break;
                                }
                            }
                            break;
                    }   

                });
            
            }) 
            
            prodForPayload.images = images
            prodForPayload.attributes = attributes
            prodForPayload.tags = tags
            prodForPayload.categories = categories

            payload.push(prodForPayload)
        });
        
        // Then finally by using fetch api, post data to site so that product is added
        let isPackageEmpty = payload.length == 0 ? true : false
        let api = constructLink(connectionInfo.domain, connectionInfo.consumer_key, connectionInfo.consumer_secert)
        let secondAlertBreaker = true
        if (!isPackageEmpty) {
            
            showSpinner()
            payload.forEach(productInfo => {
                fetch(api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productInfo),
                })
                .then(response => {
                    if (response.ok) {
                        successfullyExported(response.url)
                        secondAlertBreaker = false
                    }
                    hideSpinner()
                    return response.json()
                    
                })
                .then(result =>{
                    if (secondAlertBreaker) {
                        console.log(result);
                    }
                })
                .catch((error) => {
                    hideSpinner()
                    switch (error.name) {
                        default:
                            console.log(error.name + " : " + error.message) 
                            break;
                    }
                });   
                
            });
        }
    }
}

// Listeners 
document.querySelector("#connect-to-site").addEventListener("click", authorize)
document.querySelector("#delete-connection").addEventListener("click", ()=>{
    if (confirm("Are u sure?")) {
        revokeAuthorization()
        setTimeout(() => {
            location.reload()
        }, 900);
    }
})

document.querySelector('#add-selection-box-btn').addEventListener("click", addSelectionBox)


document.querySelector("#add-to-site-modal-opener").addEventListener("click", ()=>{
    prodsArray = scrapeThePreview()
})

document.querySelector("#add-to-site-btn").addEventListener("click", ()=>{
    ExportToSite()
})