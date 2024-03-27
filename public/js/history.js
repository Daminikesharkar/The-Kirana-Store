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
const monthlyDownload = document.getElementById('monthly-downloadn');
const yearlyDownload = document.getElementById('yearly-download');

        
weeklyButton.addEventListener('click', function () {
    showTable(weeklyTable);
    hideTables([monthlyTable, yearlyTable,dowloadHistoryTable]);
    getWeeklydata();
});

monthlyButton.addEventListener('click', function () {
    showTable(monthlyTable);
    hideTables([weeklyTable, yearlyTable,dowloadHistoryTable]);
});

yearlyButton.addEventListener('click', function () {
    showTable(yearlyTable);
    hideTables([weeklyTable, monthlyTable,dowloadHistoryTable]);
});

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

        console.log(response.data.history);
        
    } catch (error) {
        console.error("Error showing history", error.message);
    }
}

weeklyDownload.addEventListener('click',async ()=>{

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/downloadFile',{headers:{"Authorization":token}})

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
    
})


//show weekly products
async function getWeeklydata(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getWeeklyData',{headers:{"Authorization":token}});

        const length = Object.keys(response.data.products).length;

        for(let i=0;i<length;i++){
            const product = response.data.products[i];
            addProductsToUI(product)
        }
        
    } catch (error) {
        console.error("Error getting weekly data", error);
    }
}

function addProductsToUI(userdata) {
    const tableBody = document.querySelector('.tbl-content tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userdata.item}</td>
        <td>${userdata.quantity}</td>
        <td>${userdata.category}</td>
        <td>${userdata.price}</td>
    `;

    tableBody.appendChild(row);
}
