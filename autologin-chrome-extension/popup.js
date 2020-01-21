let SubjectData;
fetch("./Subject.json").then(function(resp) {
    return resp.json();
}).then(function(data) {
    SubjectData = data;
})
window.onload = () => {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request);
        HideLoading();
        attendanceListAppend(request);
    });

    let attendance = document.getElementById("attendance")
    let login = document.getElementById("login")
    console.log(attendance);
    let subjectLink = null;
    attendance.onclick = () => {
        console.log("Attendance Click");
        AddLoading();
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

    document.getElementById('github').onclick = () => {
        console.log("Gthub Click");
        let newURL = "https://github.com/abhishekr700/auto-ims-captcha";
        chrome.tabs.create({ url: newURL });
    }
}

let AddLoading = () => {
    if (document.getElementById("loading").classList.contains("hidden")) {
        document.getElementById("loading").classList.remove("hidden");
    }
}

let HideLoading = () => {
    if (!document.getElementById("loading").classList.contains("hidden")) {
        document.getElementById("loading").classList.add("hidden");
    }
}

let attendanceListAppend = (request) => {
    let menu = `<div class="eight wide column">
                        <div class="ui large vertical menu" id="subMenu">
                            <!-- FILLED THROUGH JAVASCRIPT -->
                        </div>
                    </div>
                    <div class="eight wide stretched column">
                        <div class="ui segment">
                            <p id="subMenuValue">
                                <!-- FILLED THROUGH JAVASCRIPT -->
                            </p>
                        </div>
                    </div>`
    document.getElementById('container').innerHTML = menu;
    let menuContent = `<a id = ${request.subjectCode[0]} class="active item" data-content="${request.subjectCode[0]}">` + SubjectData[request.subjectCode[0]] + `<div class="ui red label">${request.AbsentList[0].length}</div></a>`;
    for(let i=1;i<request.subjectCode.length;i++)
    {
        menuContent += `<a id = ${request.subjectCode[i]} class="item" data-content="${request.subjectCode[i]}">` + SubjectData[request.subjectCode[i]] +`<div class="ui red label">${request.AbsentList[i].length}</div></a>`;
    }
    document.getElementById("subMenu").innerHTML = menuContent;
    $('.item').popup();
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
}