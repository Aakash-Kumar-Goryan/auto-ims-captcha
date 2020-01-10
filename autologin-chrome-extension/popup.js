// let changeColor = document.getElementById('changeColor');

// changeColor.onclick = function (element) {
//     console.log("Popup click")
//     chrome.tabs.getCurrent(function (tab) {
//         // alert(tab.title);
//         console.log(tab)
//     });
// };

window.onload = () => {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request);
        let th = "";
        for(let i=0;i<request.subjectCode.length;i++)
        {
            th += "<th>" + request.subjectCode[i] + "</th>";
        }
        table = `<thead>
                    <tr>
                        ${th}
                    </tr>
                </thead>`;
        console.log(table);
        document.getElementById("table").innerHTML = table;
    });
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