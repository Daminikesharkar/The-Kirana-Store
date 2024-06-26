import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm';

const weeklyButton = document.getElementById('weeklyButton');
const monthlyButton = document.getElementById('monthlyButton');
const yearlyButton = document.getElementById('yearlyButton');
const downloadHistoryButton = document.getElementById('downloadHistoryButton');

const weeklyTable = document.getElementById('weeklyTable');
const monthlyTable = document.getElementById('monthlyTable');
const yearlyTable = document.getElementById('yearlyTable');
const dowloadHistoryTable = document.getElementById('dowloadHistoryTable');

const weeklyDownload = document.getElementById('weekly-download');
const monthlyDownload = document.getElementById('monthly-download');
const yearlyDownload = document.getElementById('yearly-download');

        
weeklyButton.addEventListener('click', function () {
    showTable(weeklyTable);
    hideTables([monthlyTable, yearlyTable,dowloadHistoryTable]);
    getWeeklydata();
});

monthlyButton.addEventListener('click', function () {
    showTable(monthlyTable);
    hideTables([weeklyTable, yearlyTable,dowloadHistoryTable]);
    getMonthlydata();
});

yearlyButton.addEventListener('click', function () {
    showTable(yearlyTable);
    hideTables([weeklyTable, monthlyTable,dowloadHistoryTable]);
    getYearlydata();
});


monthlyDownload.addEventListener('click',()=>{
    downloadReports('monthly');
})
yearlyDownload.addEventListener('click',()=>{
    downloadReports('yearly');
})
weeklyDownload.addEventListener('click',()=>{
    downloadReports('weekly');
})

async function downloadReports(when){
    try {
        console.log(when);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/downloadFile/?when=${when}`,{headers:{"Authorization":token}})

        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileurl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }
        
    } catch (error) {
        console.error("Error downloading file", error.message);
    }
}

downloadHistoryButton.addEventListener('click', function () {
    showTable(dowloadHistoryTable);
    hideTables([weeklyTable, monthlyTable,yearlyTable]);
    showDownloadedHistory();
});
       
function showTable(table) {
    table.style.display = 'block';
}
       
function hideTables(tablesToHide) {
    tablesToHide.forEach(table => {
        table.style.display = 'none';
    });
}

async function showDownloadedHistory(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/downloadHistory',{headers:{"Authorization":token}});

        addUrlsToUI(response.data.history);
        
    } catch (error) {
        console.error("Error showing history", error.message);
    }
}

function addUrlsToUI(urls){
    const tableBody = document.querySelector('.tbl-content-history tbody');
    tableBody.innerHTML = '';

    const length = Object.keys(urls).length;

    for(let i=0;i<length;i++){
        const url = urls[i];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i+1}</td>
            <td><a href="${url.downloadUrl}">myDownload-${url.createdAt}</a></td>
        `;
    
        tableBody.appendChild(row);        
    }
}

// weeklyDownload.addEventListener('click',async ()=>{

//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('/downloadFile',{headers:{"Authorization":token}})

//         if(response.status === 200){
//             var a = document.createElement("a");
//             a.href = response.data.fileurl;
//             a.download = 'myexpense.csv';
//             a.click();
//         } else {
//             throw new Error(response.data.message)
//         }
        
//     } catch (error) {
//         console.error("Error downloading file", error.message);
//     }
    
// })


//show weekly products
async function getWeeklydata(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getWeeklyData',{headers:{"Authorization":token}});
        const classname = '.tbl-content tbody';

        const tableBody = document.querySelector('.tbl-content tbody');
        tableBody.innerHTML = '';

        const length = Object.keys(response.data.products).length;

        for(let i=0;i<length;i++){
            const product = response.data.products[i];
            addProductsToUI(product,classname)
        }
        
    } catch (error) {
        console.error("Error getting weekly data", error);
    }
}

//show monthly products
async function getMonthlydata(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getMonthlyData',{headers:{"Authorization":token}});
        const classname = '.tbl-content-monthly tbody';

        const tableBody = document.querySelector('.tbl-content-monthly tbody');
        tableBody.innerHTML = '';

        const length = Object.keys(response.data.products).length;

        for(let i=0;i<length;i++){
            const product = response.data.products[i];
            addProductsToUI(product,classname)
        }
        
    } catch (error) {
        console.error("Error getting weekly data", error);
    }
}

//show yearly products
async function getYearlydata(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getYearlyData',{headers:{"Authorization":token}});
        const classname = '.tbl-content-yearly tbody';

        const tableBody = document.querySelector('.tbl-content-yearly tbody');
        tableBody.innerHTML = '';

        const length = Object.keys(response.data.products).length;

        for(let i=0;i<length;i++){
            const product = response.data.products[i];
            addProductsToUI(product,classname)
        }
        
    } catch (error) {
        console.error("Error getting weekly data", error);
    }
}

function addProductsToUI(userdata,classname) {
    const tableBody = document.querySelector(classname);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userdata.item}</td>
        <td>${userdata.quantity}</td>
        <td>${userdata.category}</td>
        <td>${userdata.price}</td>
    `;

    tableBody.appendChild(row);
}

window.addEventListener('load',()=>{
    getWeeklydata();
})