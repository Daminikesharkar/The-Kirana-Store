import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm';
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

const body = document.querySelector("body");
const sidebar = body.querySelector("nav");
const sidebarToggle = body.querySelector(".sidebar-toggle");

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

const historyLink = document.getElementById("historyLink");
historyLink.addEventListener("click", (e)=> {
    e.preventDefault();

    window.location.href = "/history";
});

const premiumLink = document.getElementById("buyPremiumLink");
premiumLink.addEventListener("click", (e)=> {
    e.preventDefault();

    window.location.href = "/premium";
});

const form = document.querySelector('form');

const item = document.getElementById('item');
const quantity = document.getElementById('quantity');
const category = document.getElementById('category');
const price = document.getElementById('price');

const logout = document.getElementById('logout');
  
form.addEventListener('submit', (e)=> {
    e.preventDefault();

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
    manageData.innerHTML += `<span class="data-list" id="${uniqueId}"> <a class="delete" href="#" data-user-data='${JSON.stringify(userdata)}'>remove</a> </span>`;

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

const pagination = document.getElementById('pagination');

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){
    pagination.innerHTML='';

    if(hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click',()=>{
            getProducts(previousPage);
        })
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click',()=>{
        getProducts(currentPage);
    })
    pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click',()=>{
            getProducts(nextPage);
        })
        pagination.appendChild(btn3);
    }
}

async function getProducts(page){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/getAllProducts/?page=${page}`,{headers:{"Authorization":token}});

        displayProducts(response.data.products);
        showPagination(response.data);
        
    } catch (error) {
        console.error("Error getting all products", error.message);
    }
}

async function displayProducts(products){

    const itemData = document.querySelector('.item');
    const quantityData = document.querySelector('.quantity');
    const categoryData = document.querySelector('.category');
    const priceData = document.querySelector('.price');
    const manageData = document.querySelector('.manage');

    itemData.innerHTML = '';
    quantityData.innerHTML = '';
    categoryData.innerHTML = '';
    priceData.innerHTML = '';
    manageData.innerHTML = '';

    itemData.innerHTML += '<span class="data-title data-title-item">Item</span>';
    quantityData.innerHTML += '<span class="data-title data-title-quantity">Quantity</span>';
    categoryData.innerHTML += '<span class="data-title data-title-category">Category</span>';
    priceData.innerHTML += '<span class="data-title data-title-price">Price</span>';
    manageData.innerHTML += '<span class="data-title data-title-manage">Manage</span>';


    const length = Object.keys(products).length;

    for(let i=0;i<length;i++){
        const product = products[i];
        addProductsToUI(product)
    }
}

const productsPerPageSelect = document.getElementById('productsPerPage');
const savePreferenceBtn = document.getElementById('savePreferenceBtn');

function getProductsPerPage() {
    return localStorage.getItem('productsPerPage') || 10; 
}

function setProductsPerPage(value) {
    localStorage.setItem('productsPerPage', value);
}

function displayProductsPerPagePreference() {
    productsPerPageSelect.value = getProductsPerPage();
}

savePreferenceBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const value = productsPerPageSelect.value;
    setProductsPerPage(value);
    location.reload();
});

displayProductsPerPagePreference();

async function displayAllProducts(){
    const page = 1;
    const itemsPerPage = getProductsPerPage();

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/getAllProducts/?page=${page}&itemsPerPage=${itemsPerPage}`,{headers:{"Authorization":token}});

        displayProducts(response.data.products);
        showPagination(response.data);
        
    } catch (error) {
        console.error("Error getting all products", error.message);
    }
}

logout.addEventListener('click',async (e)=>{
    e.preventDefault();
    try {
        localStorage.removeItem('token');
        alert('User logged out successfully');
        window.location.href = `/`;
        
    } catch (error) {
        console.error("Error logging out", error.message);
    }
})

window.addEventListener('load',()=>{
    displayAllProducts();
})
