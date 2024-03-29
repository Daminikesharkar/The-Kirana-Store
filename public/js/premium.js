import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const premiumButton = document.getElementById('premiumButton');
const leaderBoardButton = document.getElementById('show-leaderboard');
const downLoadButton = document.getElementById('show-download');

premiumButton.addEventListener('click',async()=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/buyPremium',{headers:{"Authorization":token}});

        //open razorpay
        const options = {
            "key":response.data.key_id,
            "order_id":response.data.orderId,
            "amount":response.data.amount,
            "handler":async function (response){
                console.log('handler')
                const updateResponse = await axios.post('/updateTransaction',{
                    order_id : response.razorpay_order_id,
                    payment_id:response.razorpay_payment_id,
                },{headers:{"Authorization":token}})
                console.log(updateResponse)

                alert(updateResponse.data.msg);

                document.querySelector('.overview').style.display = 'none';
                document.querySelector('.premium-features').style.display = 'block';
                document.querySelector('.premium-user').style.display = 'block';

                localStorage.setItem('token',updateResponse.data.token);
            }
        }

        var razorpay = new Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', (response)=>{
            alert('Transaction failed');
        })

    } catch (error) {
        console.error("Error making payment", error.message);
    }
})

leaderBoardButton.addEventListener('click', async ()=> {
    document.querySelector('.premium-features-leaderboard').style.display = 'block';
    document.querySelector('.premium-features-download').style.display = 'none';
    try {
        console.log("inside")
        const token = localStorage.getItem('token');
        const response = await axios.get('/leaderboard',{headers:{"Authorization":token}});
        addLeaderboardDataToUI(response.data.userdata);

    } catch (error) {
        console.error("Error fetching leaderboard data", error.message);
    }
});

function addLeaderboardDataToUI(userdata){
    const tableBody = document.querySelector('.leaderboard-table tbody');
    tableBody.innerHTML = '';
    const length = Object.keys(userdata).length;

    for(let i=0;i<length;i++){
        const user = userdata[i];
        const row = document.createElement('tr');
        row.innerHTML = `  
            <td>${i+1}</td>
            <td>${user.username}</td>
            <td>${user.total_spend}</td>
        `;
    
        tableBody.appendChild(row);
    }
}

downLoadButton.addEventListener('click', ()=> {
    document.querySelector('.premium-features-download').style.display = 'block';
    document.querySelector('.premium-features-leaderboard').style.display = 'none';
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener('load',()=>{
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    console.log(decoded);
    if(decoded.ispremiumuser){
        document.querySelector('.overview').style.display = 'none';
        document.querySelector('.premium-features').style.display = 'block';
        document.querySelector('.premium-user').style.display = 'block';
    }else{
        document.querySelector('.container').style.display = 'block';
    }
})
