let userInput = prompt("Please enter what you are doing? Time is "+new Date().toLocaleTimeString());

if (userInput) {
    chrome.storage.local.set({ [(new Date()).toISOString()]: userInput }).then(() => {
        console.log("Synergist note saved");
    });
}