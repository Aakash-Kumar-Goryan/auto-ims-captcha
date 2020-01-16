// let changeColor = document.getElementById('changeColor');

// changeColor.onclick = function (element) {
//     console.log("Popup click")
//     chrome.tabs.getCurrent(function (tab) {
//         // alert(tab.title);
//         console.log(tab)
//     });
// };
let SubjectData;
fetch("./Subject.json").then(function(resp) {
    return resp.json();
}).then(function(data) {
    SubjectData = data;
})
let changeClass = (id) => {
    console.log(id);
    let element = document.getElementById(id);
    element.classList.toggle("active");
}
window.onload = () => {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request);
        let menuContent = `<a id = ${request.subjectCode[0]} class="active item">` + SubjectData[request.subjectCode[0]] + `<div class="ui red label">${request.AbsentList[0].length}</div></a>`;
        for(let i=1;i<request.subjectCode.length;i++)
        {
            menuContent += `<a id = ${request.subjectCode[i]} class="item">` + SubjectData[request.subjectCode[i]] +`<div class="ui red label">${request.AbsentList[i].length}</div></a>`;
        }
        document.getElementById("subMenu").innerHTML = menuContent;
        document.getElementById("subMenuValue").innerHTML = request.AbsentList[0];
        let buttonList = document.getElementById("subMenu").getElementsByTagName('a');
        for(let i=0;i<buttonList.length;i++)
        {
            buttonList[i].onclick = function() {
                let tempList = document.getElementById("subMenu").getElementsByTagName('a');
                for(let j=0;j<tempList.length;j++)
                {
                    if (tempList[j].classList.contains("active")) {
                        tempList[j].classList.remove("active");
                    }
                }
                this.classList.add("active");
                document.getElementById("subMenuValue").innerHTML = request.AbsentList[request.subjectCode.indexOf(this.id)];
            }
        }
    });

    let attendance = document.getElementById("attendance")
    let login = document.getElementById("login")
    console.log(attendance);
    let subjectLink = null;
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