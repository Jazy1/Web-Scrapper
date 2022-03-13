chrome.runtime.onInstalled.addListener(function() {

    const ruleOne = {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: "www.gamak.com"},
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([ruleOne]);
    });

});

chrome.runtime.onMessage.addListener((request, sender) => {
  if ((request.from === 'content') && (request.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
});


