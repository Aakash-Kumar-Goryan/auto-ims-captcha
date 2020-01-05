console.log("Content Script")
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async () => {
    sleep(4000)
    console.log("After load");
    let c = document.getElementById('banner').contentWindow.document.getElementById('captchaimg');
    // document.getElementById("banner")
    console.log(c)
    if(c === null) return;
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
    })

    // let jsondata = await data.json();
    
    // console.log("data", data)

}