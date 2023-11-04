const startPage = document.getElementById('loading__page');
const mainPage = document.getElementById('main__page')
const getStarted_btn = document.getElementById('getStrated');
const userIp = document.getElementsByClassName('currentIp')[0];

let userLocation;

fetchUserIp();

async function fetchUserIp() {
    try {
        const response = await fetch(`https://api.ipify.org/?format=json`);
        const data = await response.json();
        // console.log(data);
        userIp.innerText = data.ip;
        storeIpToLocal(data);
    } catch (error) {
        console.log(error);
    }
}

getStarted_btn.addEventListener('click', async()=>{
    // await provideContent();
    await navigator.geolocation.getCurrentPosition(success, failure);
});

function success(positionData) {
    //(1) save position details to local
    // console.log(positionData);
    localStorage.setItem("lat", positionData.coords.latitude);
    localStorage.setItem("long", positionData.coords.longitude);

    toggleDivs();

}

function failure() {
    alert("give permission for Location Access. ");
}


function toggleDivs() {
    // console.log('class ran');
    setTimeout(() => {
        startPage.className = "hide";
        mainPage.classList.remove('hide');
    }, 2000);
}




function storeIpToLocal(data) {
    localStorage.setItem("myIp", data.ip);
}