chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runAutomation") {

    var instructions = request.instructions;

    const finalInstructions = [
      { command: 'fill', params: ['#search.ytd-searchbox', 'Tom and Jerry'] },
      { command: 'click', params: ['#search-icon-legacy'] },
      { command: 'fill', params: ['#search.ytd-searchbox', 'Mickey Mouse Clubhouse'] },
      { command: 'click', params: ['#search-icon-legacy'] },
      { command: 'fill', params: ['#search.ytd-searchbox', 'Paw Patrol'] },
      { command: 'click', params: ['#search-icon-legacy'] },
    ];

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "execute", instructions: finalInstructions});
    });

  }
});