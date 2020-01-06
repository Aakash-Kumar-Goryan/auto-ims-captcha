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
    console.log(attendance);
    attendance.onclick = () => {
        console.log("Attendance Click");

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
                console.log(response.farewell);
            });
        });

        // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //     chrome.tabs.executeScript(
        //         tabs[0].id,
        //         { code: `
        //         console.log("Hello")
        //         console.log("Hello2")
        //         let frame = document.getElementById("banner").contentWindow.document;
        //         frame.getElementsByClassName("tm-bg")[1].getElementsByTagName("a")[0].click()
        //         let sidebar = document.getElementById("top").contentWindow.document
        //         sidebar.getElementById("tree").childNodes[6].childNodes[0].childNodes[2].childNodes[0].childNodes[0].click()


        //         frame = sidebar = null
        //         ` });
        // });
    }
}