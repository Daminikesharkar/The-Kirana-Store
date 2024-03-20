const body = document.querySelector("body");
const modeToggle = body.querySelector(".mode-toggle");
const sidebar = body.querySelector("nav");
const sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})


const form = document.querySelector('form');
  
form.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const item = document.getElementById('item').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = document.getElementById('price').value.trim();
  
    const itemData = document.querySelector('.item');
    const quantityData = document.querySelector('.quantity');
    const categoryData = document.querySelector('.category');
    const priceData = document.querySelector('.price');
    const manageData = document.querySelector('.manage');
  
    itemData.innerHTML += `<span class="data-list">${item}</span>`;
    quantityData.innerHTML += `<span class="data-list">${quantity}</span>`;
    categoryData.innerHTML += `<span class="data-list">${category}</span>`;
    priceData.innerHTML += `<span class="data-list">${price}</span>`;
    manageData.innerHTML += `<span class="data-list"><a href="">remove</a></span>`
  
    form.reset();
});
