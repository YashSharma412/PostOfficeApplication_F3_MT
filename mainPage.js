// getting data from local storage
const ip = localStorage.getItem("myIp");
const userLatitude = localStorage.getItem("lat");
const userLongitude = localStorage.getItem("long");

const mainPage_ip_display = document.getElementsByClassName('currentIp')[1];
const map_container = document.getElementById("mainMap_container");

let msg;
let ArrOf_POs = [];
const date = new Date();

//set inner text for heder ip display
mainPage_ip_display.innerText = ip;

// 1.)
async function fetchApiFromIP(ip){
    try {
        console.log("user: ", ip)
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        console.log("The data", data);
        
        renderMap(); // A
        await fetchPostOfficesFromApi(data.postal); // B
        renderData(data); // C

    } catch (error) {
        console.log(error);
        alert('failed to fetch data from ap1, refresh page')
    }
}
fetchApiFromIP(ip);


//  A
function renderMap() {
    // console.log("latitude:", lati);
    // console.log("longitude:", longi);
    map_container.innerHTML = `
    <iframe src="https://maps.google.com/maps?q=${userLatitude}, ${userLongitude}&output=embed" frameborder="0" style="border: 0;"></iframe>
    `;
}

// B
async function fetchPostOfficesFromApi(pincode) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        console.log("Postal api data: ", data);
        msg = data[0].Message;
        renderPostOffices_Cards(data[0].PostOffice); // passing the array of post offices fetched from the API
        ArrOf_POs = data[0].PostOffice;
    } catch (error) {
        console.log(error);
    }
}


const postalCard__container = document.getElementById('postOffice__LocationCards_container');

function renderPostOffices_Cards(cards_Arr){
    postalCard__container.innerHTML = "";

    cards_Arr.forEach(postOffice => {
        const container = document.createElement("div");
        container.className = "postOffice__card";
        container.innerHTML = `
        <div> Name: ${postOffice.Name}</div>
        <div> Branch Type: ${postOffice.BranchType}</div>
        <div> Delivery Status: ${postOffice.DeliveryStatus}</div>
        <div> District: ${postOffice.District}</div>
        <div> Division: ${postOffice.Division}</div>
        `
        postalCard__container.appendChild(container);
    });
}

// C

const mainPage__header_details = document.getElementById("location__details_container");
const user__moredetails_section = document.getElementById("moreDetails__section");
function renderData(data){
    mainPage__header_details.innerHTML = `
        <div> Lat: <span>${data.latitude}</span></div>
        <div> Long: <span>${data.longitude}</span></div>
        <div> Region: <span>${data.region}</span></div>
        <div> City: <span>${data.city}</span></div>
        <div> Hostname: <span>${data.network}</span></div>
        <div> Organiztion: <span>${data.org}</span></div>
    `;
    user__moredetails_section.innerHTML = `
        <h1>More Information About You</h1>
        <div >Time Zone: <span>${data.timezone}</span></div>
        <div >Date And Time: <span>${date}</span></div>
        <div >Pincode: <span>${data.postal}</span></div>
        <div >Message: <span>${msg}</span></div>
    `;
}


const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (event)=>{
    const searhQuerry = event.target.value.toLowerCase();
    filterPostOffices(searhQuerry, ArrOf_POs);
});


function filterPostOffices(searchQuerry, allPostOffices) {
    const filteredArr = allPostOffices.filter((office)=>{
        return office.Name.toLowerCase().includes(searchQuerry);
    })

    renderPostOffices_Cards(filteredArr);
}
