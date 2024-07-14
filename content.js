function clickElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
  } else {
    console.error(`Element not found: ${selector}`);
  }
}

function fillInput(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.value = text;
  } else {
    console.error(`Element not found: ${selector}`);
  }
}

function clickHistoryButton() {
  // First, try to find the element by its href attribute
  let historyButton = document.querySelector('a[href="/feed/history"]');
  
  // If not found, try to find it by its title attribute
  if (!historyButton) {
    historyButton = document.querySelector('a[title="History"]');
  }
  
  // If still not found, try to find it by its text content
  if (!historyButton) {
    historyButton = Array.from(document.querySelectorAll('a')).find(el => 
      el.textContent.trim() === 'History'
    );
  }

  // If the button is found, click it
  if (historyButton) {
    historyButton.click();
    console.log('History button clicked');
  } else {
    console.error('History button not found');
  }
}

function parseInstructions(instructions) {
  // This is a simple parser. You'll need to expand this based on your needs.
  
  const actions = instructions.split(';').map(action => action.trim());
  actions.forEach(action => {
    const [command, ...params] = action.split(' ');
    switch (command) {
      case 'click':
        //clickElement(params.join(' '));
        clickHistoryButton();
        break;
      case 'fill':
        fillInput(params[0], params.slice(1).join(' '));
        break;
      default:
        console.error(`Unknown command: ${command}`);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "execute") {
    parseInstructions(request.instructions);
  }
});

/*
// click #loginButton; fill #username johndoe; fill #password secretpass; click .submitBtn

1. fill #fill #search.ytd-searchbox text
2. click #search-icon-legacy

 */