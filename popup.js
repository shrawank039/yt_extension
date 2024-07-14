document.getElementById('runButton').addEventListener('click', function() {
  const instructions = document.getElementById('instructions').value;
  chrome.runtime.sendMessage({action: "runAutomation", instructions: instructions});
});