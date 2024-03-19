import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const loginForm = document.getElementById('login');

const email = document.getElementById('login-email');
const password = document.getElementById('login-password');

loginForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    const userdata = {
        email: email.value,
        password: password.value
    }

    loginUser(userdata);
    loginForm.reset();
})

async function loginUser(userdata){
    try {
        
        const response = await axios.post('/login', userdata, {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.status === 200) {
            console.log(response.data.message);
        }else if(response.status === 400) {
            console.log(response.data.message);
            throw new Error("Failed to log In:" + response.data.message);
        }else if(response.status === 401) {
            console.log(response.data.message);
            throw new Error("Failed to log In:" + response.data.message);
        }

    } catch (error) {
        console.error("Error logging User", error.message);
    }
}
