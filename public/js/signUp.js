import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const signUpForm = document.getElementById('signup');
const username = document.getElementById('signUp-username');
const email = document.getElementById('signUp-email');
const password = document.getElementById('signUp-password');


signUpForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    const userdata = {
        username: username.value,
        email: email.value,
        password: password.value
    }    
    addUserData(userdata);
    signUpForm.reset();
})

async function addUserData(userdata){
    try {
        const response = await axios.post('/signup',userdata,{
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.status === 200) {
            alert("Signed Up successfully, please login now!");
            console.log("User successfully added!");
            window.location.href = `/`;
        }else if(response.status === 400) {
            alert(response.data.message);
            throw new Error("User already exists with this email" + response.status);
        }else {
            alert(response.data.message)
            throw new Error("Failed to add user" + response.status);
        }

    } catch (error) {
        console.error("Error adding User", error.message);
    } 
}
