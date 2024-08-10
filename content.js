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
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);  // Ensure the input event is dispatched
  } else {
    console.error(`Element not found: ${selector}`);
  }
}

function clickThumbnail() {
  // Target the video title link, which is the clickable element for a video
  const videoLink = document.querySelector('a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer');
  
  if (videoLink) {
    videoLink.click(); // Click the video link
    console.log('Clicked on video:', videoLink.textContent.trim());
  } else {
    console.error('No video link found');
  }
}


function executeInstructions(instructions) {
  function executeNext(index) {
    if (index >= instructions.length) return;

    const { command, params } = instructions[index];

    switch (command) {
      case 'click':
        clickElement(params[0]);
        // Wait for 5 seconds after clicking search before proceeding
        setTimeout(() => {
          clickThumbnail();
          // Wait for 10 seconds after clicking thumbnail before proceeding
          setTimeout(() => {
            executeNext(index + 1);
          }, 10000); // 10 seconds wait time
        }, 5000); // 5 seconds wait time
        break;
      case 'fill':
        fillInput(params[0], params[1]);
        executeNext(index + 1);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        executeNext(index + 1);
    }
  }

  executeNext(0);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "execute") {
    executeInstructions(request.instructions);
    sendResponse({ status: "Instructions execution started" });
  }
});

