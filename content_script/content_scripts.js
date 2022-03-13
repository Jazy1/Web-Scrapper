// function sanitise(scrapedData) {
//   for (let i = 0; i < sitemap.length; i++) {
//     const field = sitemap[i];
//     switch (field.type) {
//       case "sub-category":

//     }
//   }
// }

function scrape(sitemap) {
  
  let scrapedData = []

  for (let i = 0; i < sitemap.length; i++) {
    const field = sitemap[i];
    switch (field.type) {
      case "text":
        let text = isElementThere(field.selector) ? document.querySelector(field.selector).innerText : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:text})
        break;
      case "sub-category":
        let subCategory = isElementThere(field.selector) ? document.querySelector(field.selector).innerText : ""
        subCategory = subCategory.replaceAll("\n","") 
        subCategory = subCategory.replaceAll(/[\u00A0-\u9999<>\&]/g, "")
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:subCategory})
        break;
      case "product-attribute":
        let prodAttr = isElementThere(field.selector) ? document.querySelector(field.selector).innerText : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:prodAttr})
        break;
      case "link":
        let link = isElementThere(field.selector) ? document.querySelector(field.selector).getAttribute("href") : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:link})
        break;
      case "image":
        let pic = isElementThere(field.selector) ? document.querySelector(field.selector).currentSrc : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:pic})
        break;
      case "image-with-download":
        let picWDownload = isElementThere(field.selector) ? document.querySelector(field.selector).currentSrc : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:picWDownload})
        break;
      case "link-with-download":
        let linkWithDownload = isElementThere(field.selector) ? document.querySelector(field.selector).getAttribute("href") : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:linkWithDownload})
        break;
      case "grouped-text":
        let theText = isElementThere(field.selector) ? document.querySelector(field.selector).innerText : ""
        scrapedData.push({type: field.type, selector: field.selector, name: field.name, scraped:theText})
        break;
      case "empty":
        scrapedData.push({type: field.type, name: field.name})
        break;
    }
  }
  return scrapedData
}

function isElementThere(selector) {
  let selection = document.querySelector(selector) !== null
  return selection
}

// Inform the background page that this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

chrome.runtime.onConnect.addListener((port)=>{
  console.log("Connected to popup now");

  // Asking for sitemap
  port.postMessage({sender:"content", recipient: "popup", action:"give-sitemap"})

  port.onMessage.addListener((message)=>{

    if ( message.sender == "popup" && message.recipient == "content" && message.action =="give-scrapedData") {

      let sitemap = message.data
      localStorage.setItem("sitemap",sitemap)

      let scrapedData = scrape(sitemap)
      console.log(scrapedData);
      
      let messageToSend = {
        sender: "content",
        recipient: "popup",
        action: "giving-scrapedData",
        data: scrapedData
      }
      port.postMessage(messageToSend)
    }
  })
})

window.addEventListener("message",(event)=>{
  let message = event.data
  
  if (message.context == "bulk export" && message.from == "ext-settings") {
    let url = message.url
    let sitemap = message.sitemap
    let waitForClose = message.waitForClose

    let scrapedData = scrape(sitemap)

    let messageToSendBack = {
      context: "scraped data",
      from: "ext",
      status: "success",
      url: url,
      scrapeddata: scrapedData
    }

    setTimeout(()=>{
      event.source.postMessage(messageToSendBack, event.origin)     
    },waitForClose * 1000)
  }

})