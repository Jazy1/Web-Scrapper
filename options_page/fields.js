
// Add Field
document.getElementById("add-fields").addEventListener("click",()=>{
    
    let field = document.createElement("div")
    field.classList.add("form-group", "form-group-fields")
    field.innerHTML = `
    <label>Type</label>
    <select class="form-select field-type" >
        <option value="empty" selected>Empty</option>
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
    <input type="text" class="form-control field-selector" placeholder="Enter selector">

    <label>Enter name for new field</label>
    <input type="text" class="form-control field-name" placeholder="Enter Name">
    `

    document.getElementById("main-fields").appendChild(field)
})

// Save Fields
document.getElementById("save-fields").addEventListener("click",()=>{

    // Retreiving data
    let inps = document.getElementsByClassName("form-group-fields")
    inps = Array.from(inps)
    let sitemap = []

    // Creating site map
    for (let i = 0; i < inps.length; i++) {
        const inp = inps[i];

        // Type
        let type = inp.getElementsByClassName("field-type")[0]
        type = type.options[type.selectedIndex].value
        
        // Selector
        let selector = inp.getElementsByClassName("field-selector")[0].value

        // Name
        let name = inp.getElementsByClassName("field-name")[0].value
        
        // Validation and then pushing
        if (name != "") {
            sitemap.push({type: type, selector: selector, name: name})
        }
    }

    // Saving the sitemap
    console.log("Saving fields..", sitemap);
    localStorage.setItem("sitemap", JSON.stringify(sitemap))
    console.log("Sitemap saved successfully");

    // Showing message and then reloading page
    document.getElementById("success-banner-fields").style.display = "block"
    setTimeout(() => {
        location.reload()
    }, 900);

})