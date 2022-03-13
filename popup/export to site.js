
// Populating all selects with sitemap field names
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

// Get Categories from the woocommerce site
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
    let fields = scrapeThePreview()
    
    // wrapper
    let selectionBox = document.createElement("div")
    selectionBox.setAttribute("style", "display:flex;justify-content:space-between;margin: 10px 0px;")
    selectionBox.classList.add(["selection-boxes"])

    // Options for fields populated using fields in preview box
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


// populates the box on load
function showSelections() {
    let categories = getCategories()
    let selections = JSON.parse(localStorage.getItem("siteExportSelections"))
    let loadTime = localStorage.getItem("cat-load-time") != "" && localStorage.getItem("cat-load-time") != undefined ? localStorage.getItem("cat-load-time") : 5

    if (selections != undefined) {
        
        setTimeout(() => {
          
          
          selections.forEach(selection => {
    
            let thebBox = document.querySelector("#fields-selection-for-prod")
            let sitemap = JSON.parse(localStorage.getItem("sitemap"))
            let fields = scrapeThePreview()
            
            // wrapper
            let selectionBox = document.createElement("div")
            selectionBox.setAttribute("style", "display:flex;justify-content:space-between;margin: 10px 0px;")
            selectionBox.classList.add(["selection-boxes"])
        
            // Options for fields populated using sitemap
            let fieldOptions
            switch (selection.property) {
              case "categories":
                
                break;
            
              default:
                fieldOptions = `<option selected style="display: none;" value="${selection.field}">${selection.field}</option>` 
                break;
            }
            
            fields.forEach(data => {
                data.forEach(field => {
                    fieldOptions = fieldOptions + `<option value="${field.name}" data-field-type="${field.type}">${field.name}</option>`
                });
            });
        
        
        
            // Creating wrapper for properties 
            let propertiesWrapper = document.createElement("div")
            propertiesWrapper.setAttribute("style","width: 50%; display: flex; align-items: center; justify-content: center;")
            // Creating Select along with it's shit
            let propertiesSelect = document.createElement("select")
            propertiesSelect.setAttribute("name", "propertyName")
            propertiesSelect.setAttribute("style", "max-height: 50px; overflow: auto;")
            
            propertiesSelect.innerHTML =  `<option selected style="display: none;" data-show-name="${selection.propertyShowName}" value="${selection.property}">${selection.propertyShowName}</option>` + `
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
            if (selection.property=="categories") {
              fieldsWrapper.setAttribute("hidden", "")
            }
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
            catWrapper.setAttribute("hidden", "")
            // Creating Select with it's shit
            let catOptions = ``
            if (selection.property == "categories") {
              catWrapper.removeAttribute("hidden")
              catOptions = `<option style="display:none;" selected value="${selection.catName}" data-category-id="${selection.catId}">${selection.catName}</option>`
            }
    
            // console.log(categories.length );
            // console.log(categories);
            for (let i = 0; i < categories.length; i++) {
              const cat = categories[i];
            //   console.log(cat);
            }
    
            categories.forEach(category => {
                catOptions += `<option value="${category.name}" data-category-id="${category.id}">${category.name}</option>`
            });
    
            let catSelect = document.createElement("select")
            catSelect.setAttribute("name", "categories")
            catSelect.innerHTML = `
              ${catOptions}
            `
            // Appending select into fieldsName wrapper
            catWrapper.appendChild(catSelect)
        
        
            
            // Appending both wrappers into selectionBox
            selectionBox.appendChild(propertiesWrapper)
            selectionBox.appendChild(fieldsWrapper)
            selectionBox.appendChild(catWrapper)
        
        
        
            thebBox.appendChild(selectionBox)
    
          });
    
        }, loadTime * 1000);
        
    }
    
}

function saveSelections() {
    let selectionBoxes = Array.from(document.querySelector("#fields-selection-for-prod").getElementsByClassName("selection-boxes"))
    let data = []

    selectionBoxes.forEach(box => {
        let selects = box.getElementsByTagName("select")
        let selectedProperty = selects[0].value
        let propertyShowName = selects[0].options[selects[0].selectedIndex].dataset.showName
        let selectedField = selects[1].value

        if (selectedProperty != "none" || selectedField != "none") {
            switch (selectedProperty) {
                case "categories":
                    let catName = selects[2].value
                    let catId = selects[2].options[selects[2].selectedIndex].dataset.categoryId
                    data.push({"property":selectedProperty, "propertyShowName":propertyShowName, "catName":catName, "catId":catId})
                    break;
            
                default:
                    data.push({"property":selectedProperty, "propertyShowName": propertyShowName ,"field":selectedField })
                    break;
        }

        
        }
    });

    if (data.length != 0) {
        localStorage.setItem("siteExportSelections", JSON.stringify(data))
        document.querySelector("#success-banner-selections-saved").style.display = "block"
    }
}

// Derive the woocommerce compatible json from the fields
function ExportToSite() {
    let theBoxes = document.querySelector("#fields-selection-for-prod").getElementsByClassName("selection-boxes")
    let scrapedData = scrapeThePreview()
    let connectionInfo = localStorage.connection != undefined ? JSON.parse(localStorage.connection) : undefined
    let productInfo = {}
    document.querySelector("#spinner").removeAttribute("hidden")
    
    // Validation to see if the required fields don't have none OR if we are not connected to site yet.
    if (connectionInfo == undefined ) {
        alert("You are not connected to any site.")
    }else{
        // Creating json that is woocommerce compatible and that can be directly used by fetch api 
        let images = []
        let attributes = []
        let tags = []
        let categories = []
        
        for (let i = 0; i < theBoxes.length; i++) {
            const theBox = theBoxes[i];

            let selects = theBox.getElementsByTagName("select")
            let selectedProperty = selects[0].value
            let propertyShowName = selects[0].options[selects[0].selectedIndex].dataset.showName
            let selectedField = selects[1].value
            let selectedFieldType = selects[1].options[selects[1].selectedIndex].dataset.fieldType
            // For properties that don't utilizes values from sitemap
            switch (selectedProperty) {
                case "categories":
                    let catId = selects[2].options[selects[2].selectedIndex].dataset.categoryId
                    let value = selects[2].value
                    if (value!="none") {
                        categories.push({"id": catId})
                    }
                    break;
            }
            
            scrapedData.forEach((data)=>{
                data.forEach(scraped => {
                    console.log(scraped);
                    
                    if (selectedField == scraped.name) {

                        switch (selectedProperty) {
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
                                productInfo[selectedProperty] = scraped.scraped
                                break;
                        }
                    }
                })
            })

            productInfo.images = images
            productInfo.attributes = attributes
            productInfo.tags = tags
            productInfo.categories = categories
        }
        console.log(productInfo);

        let isPackageEmpty = Object.keys(productInfo).length === 0 ? true : false
        if (!isPackageEmpty && !(Object.keys(productInfo).length === 4)) {
            // Then finally by using fetch api, post data to site so that product is added
            let api = constructLink(connectionInfo.domain, connectionInfo.consumer_key, connectionInfo.consumer_secert)
            let secondAlertBreaker = true
            fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            })
            .then(response => {
                document.querySelector("#spinner").setAttribute("hidden", "")
                if (response.ok) {
                    alert("Product added successfully.")
                    secondAlertBreaker = false
                    // alert(`${response.message}. Code: ${response.status}`)
                }
                return response.json()
            })
            .then(result =>{
                if (secondAlertBreaker) {
                    alert(result.message);
                }
            })
            .catch((error) => {
                document.querySelector("#spinner").setAttribute("hidden", "")
                switch (error.name) {
                    default:
                        alert(error.name + " : " + error.message) 
                        break;
                }
            });
        }
    }
}


// Listner
document.querySelector("#add-to-site-btn").addEventListener("click", ()=>{
    ExportToSite()
})

document.querySelector('#add-selection-box-btn').addEventListener("click", ()=>{
    addSelectionBox()
})

document.querySelector('#save-selection-btn').addEventListener("click", saveSelections)

document.querySelector('#delete-selection-btn').addEventListener("click", ()=>{
    if (confirm("Are u sure?")) {
        localStorage.removeItem("siteExportSelections")
        document.querySelector("#success-banner-selections-deleted").style.display = "block"
        setTimeout(() => {
            location.reload()
        }, 1500);
    }
})