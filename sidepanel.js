// Function to update the side panel list
function updateSidePanelList(data) {
    const resultObject = groupByRelativeTime(data)

    const jobsContainer = document.querySelector(".jobs-container");
    jobsContainer.innerHTML = ""; // Clear the existing list
    Object.entries(resultObject).reverse().forEach(([relativeTime, jobs], index) => {
        const list = document.createElement("ul");
        list.classList.add("jobs");

        const listItems = Array.from(jobs)
            .reverse()
            .map(({ timestamp, value }) => {
                const li = document.createElement("li");

                console.log({ timestamp, value });

                const time = document.createElement("time");
                time.textContent = new Date(timestamp).toLocaleTimeString();
                li.appendChild(time);

                const p = document.createElement("p");
                p.textContent = value;
                li.appendChild(p);

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-btn");
                deleteBtn.setAttribute("data-item-id", timestamp);
                deleteBtn.textContent = "Delete";
                li.appendChild(deleteBtn);

                deleteBtn.addEventListener("click", () => {
                    const itemId = deleteBtn.getAttribute("data-item-id");
                    if (itemId) {
                        chrome.storage.local.remove(itemId).then(refreshSidePanel);
                    }
                });

                return li;
            });

        listItems.forEach((li) => list.appendChild(li));

        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = relativeTime;

        details.appendChild(summary);
        details.appendChild(list);
        if (index === 0) details.setAttribute("open", "true");

        jobsContainer.appendChild(details);
    })
}

// Function to refresh the side panel
function refreshSidePanel() {
    chrome.storage.local.get(null, (resultObject) => {
        const resultCopy = Object.assign({}, resultObject);
        delete resultCopy.lastItem;

        updateSidePanelList(resultCopy);
        console.log("Successful refresh");
    });
}

function groupByRelativeTime(data) {
    const entries = Object.entries(data);

    const groupedByRelativeTime = entries.reduce((acc, [timestamp, value]) => {

        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        const thisWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

        let relativeTime;
        if (date.toDateString() === today.toDateString()) {
            relativeTime = "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            relativeTime = "Yesterday";
        } else if (date >= thisWeekStart && date < today) {
            relativeTime = "This Week";
        } else if (date >= lastWeekStart && date < thisWeekStart) {
            relativeTime = "Last Week";
        } else {
            relativeTime = "Older";
        }

        if (!acc[relativeTime]) {
            acc[relativeTime] = [];
        }
        acc[relativeTime].push({ timestamp, value });
        return acc;
    }, {});

    return groupedByRelativeTime;
}

// Listen for storage changes and refresh the side panel
chrome.storage.local.onChanged.addListener(() => {
    refreshSidePanel();
});

// Listen for messages from the content script and refresh the side panel
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "storageUpdated") {
        console.log("Storage updated");
        refreshSidePanel();
    }
});

refreshSidePanel();