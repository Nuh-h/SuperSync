chrome.storage.local.get(null, (resultObject) => {
    updateList(resultObject);
});

chrome.storage.local.onChanged.addListener((changes) => {
    const key = Object.keys(changes)[0];
    const value = changes[key].newValue;
    let list = document.querySelector(".jobs");
    list = `<li>
        <time>${new Date(key).toLocaleTimeString()}</time>
        <p>${value}</p>
    </li>`+ list.innerHTML;
    // chrome.storage.session.get(null, (resultObject) => {
    //     updateList(resultObject);
    // });
});

function updateList(resultObject) {

    let list = document.querySelector(".jobs");
    let listChildren = "";

    Object.entries(resultObject).reverse().forEach(([key, value]) => {
        listChildren += `<li>
        <time>${new Date(key).toLocaleTimeString()}</time>
        <p>${value}</p>
    </li>`
    });

    if (listChildren.length > 0) {
        list.innerHTML = "";
        list.innerHTML += listChildren;
    }
}