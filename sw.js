chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.alarms.create({ delayInMinutes: 0, periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener(async () => {
    console.log("Alarm has elapsed, time is " + (new Date()).toLocaleTimeString());
    // const tabs = await chrome.tabs.query({});
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [activeTab] = await chrome.tabs.query(queryOptions);

    console.log(activeTab);
    
    if(activeTab){
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ["content.js"]
        })
    };
})