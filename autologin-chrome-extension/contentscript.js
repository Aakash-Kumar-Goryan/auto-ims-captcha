console.log("Content Script")
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gotoAttendance = async () => {
    console.log("Click My Activites");
    let frame = document.getElementById("banner").contentWindow.document;
    frame.getElementsByClassName("tm-bg")[1].getElementsByTagName("a")[0].click()

    let sidebar = document.getElementById("top").contentWindow.document

    while (sidebar.getElementById("tree") === null) {
        sidebar = document.getElementById("top").contentWindow.document
        console.log("Not found", sidebar.getElementById("tree"))
        await sleep(500)
    }
    console.log("Sidebar loaded")

    // console.log("Wait 5 sec")
    // await sleep(5000)

    // sidebar = document.getElementById("top").contentWindow.document
    // console.log(sidebar);
    
    console.log("Click My Attendance Report");
    sidebar.getElementById("tree").childNodes[6].childNodes[0].childNodes[2].childNodes[0].childNodes[0].click()

    // console.log("Wait 5 sec")
    // await sleep(5000)
    // await skee

    // await sleep(500)

    let attendanceWindow = document.getElementById("data").contentWindow.document
    
    // while (true) {
    //     if (attendanceWindow.readyState === 'complete') {
    //         break
    //     }
    // }

    while (attendanceWindow.getElementById("year") === null) {
        attendanceWindow = document.getElementById("data").contentWindow.document
        await sleep(500)
    }
    attendanceWindow.getElementById("year").selectedIndex = 2
    attendanceWindow.getElementById("sem").selectedIndex = 7
    attendanceWindow.getElementsByTagName("input")[7].click()

}

window.onload = async () => {

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            
            if (request.msg === 0){
                gotoAttendance()
                sendResponse({ farewell: "goodbye" });
            }
            else if(request.msg === 1) {

            }
                
            
            
        });

    sleep(4000)
    console.log("After load");
    let c = document.getElementById('banner').contentWindow.document.getElementById('captchaimg');
    // document.getElementById("banner")
    console.log(c)
    if(c === null) {
        console.log("No Captcha found");
        return;
    }
    console.log(c.src);
    
    // let data = await fetch("http://localhost:5000/solveCaptcha", {
    //     mode: 'no-cors',
    //     method: "post",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     contentType: "application/json; charset=utf-8",
    //     body: JSON.stringify({
    //         link: c.src
    //     })
    // })

    fetch(`http://localhost:5000/solveCaptcha?link=${c.src}`, {
        // mode: 'no-cors'
    })
    .then((data) => {
        console.log("converting to json");
        return data.json();
    })
    .then((data) => {
        console.log("json:",data);
        let captcha = data.captcha
        let input = document.getElementById('banner').contentWindow.document.getElementById('cap');
        input.value = captcha
        let btn = document.getElementById('banner').contentWindow.document.getElementById('login');
        console.log(btn);
        
        btn.click()
        sleep(5000)
    })

    // let jsondata = await data.json();
    
    // console.log("data", data)

    

}

