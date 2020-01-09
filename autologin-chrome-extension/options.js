window.onload = () => {
    let rollNumBtn = $("#setRollnum");
    let passwordBtn = $("#setPassword")

    let rollNum = $("#rollnum")
    let password = $("#password")

    rollNumBtn.onclick = () => {
        chrome.storage.sync.set({ rollnum: rollNum.value }, function () {
            console.log('rollnum is ' + rollNum.value);
        })
    }
}