// let changeColor = document.getElementById('changeColor');

// changeColor.onclick = function (element) {
//     console.log("Popup click")
//     chrome.tabs.getCurrent(function (tab) {
//         // alert(tab.title);
//         console.log(tab)
//     });
// };

window.onload = () => {
    let attendance = document.getElementById("attendance")
    let login = document.getElementById("login")

    console.log(attendance);
    attendance.onclick = () => {
        console.log("Attendance Click");

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { msg: 0 }, function (response) {
                console.log(response.farewell);
            });
        });
    }

    login.onclick = () => {
        console.log("Login Click");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { msg: 1 }, function (response) {
                console.log(response.farewell);
            });
        });
    }
}