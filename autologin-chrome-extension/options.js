let rollNumBtn
let passwordBtn
let rollNum 
let password
let autologin,autocaptcha

window.onload = () => {
    console.log("==Options.js==");
    
    // Buttons
    rollNumBtn = $("#setRollnum");
    passwordBtn = $("#setPassword")

    // Input Fields
    rollNum = $("#rollnum")
    password = $("#password")
    autologin = $("#autologin")
    autocaptcha = $("#autocaptcha")

    // Fill saved values back
    fillValues()
    
    rollNumBtn.click(() => {
        // console.log("RollNum Click");
        
        chrome.storage.sync.set({ rollnum: rollNum.val() }, function () {
            // console.log('rollnum is ' + rollNum.val());
        })
    });

    passwordBtn.click(() => {
        chrome.storage.sync.set({ password: password.val() }, function () {
            console.log("Value set");
            
        })
    });

    autologin.click(() => {
        console.log(autologin.prop("checked"));
        chrome.storage.sync.set({ autologin: autologin.prop("checked") }, function () {
            console.log("Value set");
        })
    })

    autocaptcha.click(() => {
        console.log(autocaptcha.prop("checked"));
        chrome.storage.sync.set({ autocaptcha: autocaptcha.prop("checked") }, function () {
            console.log("Value set");
        })
    })
}

const fillValues = () => {
    chrome.storage.sync.get(["rollnum", "password", "autologin", "autocaptcha"], function (d) {
        console.log(d);
        
        rollNum.val(d["rollnum"]);
        password.val(d["password"])
        autologin.prop("checked", d["autologin"])
        autocaptcha.prop("checked", d["autocaptcha"])
    })
}