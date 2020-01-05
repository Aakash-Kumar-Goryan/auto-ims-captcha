let changeColor = document.getElementById('changeColor');

changeColor.onclick = function (element) {
    console.log("Popup click")
    chrome.tabs.getCurrent(function (tab) {
        // alert(tab.title);
        console.log(tab)
    });
};