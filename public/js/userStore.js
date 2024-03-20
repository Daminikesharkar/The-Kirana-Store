import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm';
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

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

const item = document.getElementById('item');
const quantity = document.getElementById('quantity');
const category = document.getElementById('category');
const price = document.getElementById('price');
  
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const userdata = {
        item:item.value,
        quantity:quantity.value,
        category:category.value,
        price:price.value
    }

    addProducts(userdata);  
    form.reset();
});

function addProductsToUI(userdata){

    const uniqueId = uuidv4();

    const itemData = document.querySelector('.item');
    const quantityData = document.querySelector('.quantity');
    const categoryData = document.querySelector('.category');
    const priceData = document.querySelector('.price');
    const manageData = document.querySelector('.manage');
  
    // itemData.innerHTML += `<span class="data-list">${userdata.item}</span>`;
    // quantityData.innerHTML += `<span class="data-list">${userdata.quantity}</span>`;
    // categoryData.innerHTML += `<span class="data-list">${userdata.category}</span>`;
    // priceData.innerHTML += `<span class="data-list">${userdata.price}</span>`;
    // manageData.innerHTML += `<span class="data-list"><a href="">remove</a></span>`;

    itemData.innerHTML += `<span class="data-list" id="item-${uniqueId}">${userdata.item}</span>`;
    quantityData.innerHTML += `<span class="data-list" id="quantity-${uniqueId}">${userdata.quantity}</span>`;
    categoryData.innerHTML += `<span class="data-list" id="category-${uniqueId}">${userdata.category}</span>`;
    priceData.innerHTML += `<span class="data-list" id="price-${uniqueId}">${userdata.price}</span>`;
    manageData.innerHTML += `<span class="data-list" id="${uniqueId}"> <a class="delete" href="#" data-user-data='${JSON.stringify(userdata)}'>remove</a> </span>`;;

}

async function addProducts(userdata){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/addProducts',userdata,{headers:{"Authorization":token}});

        addProductsToUI(response.data.product);
    } catch (error) {
        console.error("Error adding product", error.message);
    }
    
}   

const row = document.getElementById('activity-data');
row.addEventListener('click',(e)=>{
    if(e.target.classList.contains('delete')){

        const tagId = e.target.parentElement.getAttribute('id');
        const userdata = JSON.parse(e.target.getAttribute('data-user-data'));

        removeProduct(userdata.id,tagId);
    }
})

async function removeProduct(id,tagId){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/deleteProduct'+`/${id}`,{headers:{"Authorization":token}});
        alert(response.data.message);
        removeProductFromUI(tagId);

    } catch (error) {
        console.error("Error deleting product", error.message);
    }    
}

function removeProductFromUI(tagId){
    document.getElementById(`item-${tagId}`).remove;
    document.getElementById(`quantity-${tagId}`).remove;
    document.getElementById(`category-${tagId}`).remove;
    document.getElementById(`price-${tagId}`).remove;
    document.getElementById(`${tagId}`).remove;
}

async function displayAllProducts(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getAllProducts',{headers:{"Authorization":token}});

        const length = Object.keys(response.data.products).length;

        for(let i=0;i<length;i++){
            const product = response.data.products[i];
            addProductsToUI(product)
        }
        
    } catch (error) {
        console.error("Error getting all products", error.message);
    }
}

window.addEventListener('load',()=>{
    displayAllProducts();
})
