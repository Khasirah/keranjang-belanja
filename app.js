// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********

// submit form
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);

// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********

// add item
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if(value && !editFlag){
        createList(id, value)

        // display alert
        displatAlert('berhasil menambahkan ke keranjang', 'success');

        // show container
        container.classList.add('show-container');

        // add to local storage
        addToLocalStorage(id, value);

        // set back to default
        setBackToDefault();
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displatAlert('berhasil mengubah item', 'success');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{
        displatAlert('please enter value', 'danger');
    }
}

// displat alert
function displatAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 2000)
}

// set back to default
function setBackToDefault(){
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item)
        });
    }

    container.classList.remove('show-container');
    displatAlert('keranjang di kosongkan', 'danger');
    setBackToDefault();
    localStorage.removeItem('list')
}

// edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;

    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;

    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}
// delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if(list.children.length === 0){
        container.classList.remove('show-container'); 
    }
    displatAlert('item dihapus', 'danger');
    setBackToDefault()

    // remove from local storage
    removeFromLocalStorage(id)

}

// create list items
function createList(id, value){
    const elemenArticle = document.createElement('article');
    // add class
    elemenArticle.classList.add('grocery-item');
    // add id
    const attrId = document.createAttribute('data-id');
    attrId.value = id;
    elemenArticle.setAttributeNode(attrId);
    elemenArticle.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
        </button>
    </div>`;
    
    const deleteBtn = elemenArticle.querySelector('.delete-btn');
    const editBtn = elemenArticle.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // append elemen attr
    list.appendChild(elemenArticle);
}


// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value){
    const itemGrocery = {id:id, value:value};
    let items = getLocalStorage();
    items.push(itemGrocery);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id) {
            return item
        }
    });

    localStorage.setItem('list', JSON.stringify(items));
    if(items.length ==0) {
        localStorage.removeItem('list');
    }
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item
    });

    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

// local storage API
// set item
// get item
// remove item
// save as strings
// localStorage.setItem('orange', JSON.stringify(['item','item2']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
// localStorage.removeItem('orange'); 

// ****** SETUP ITEMS **********

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item) {
            createList(item.id, item.value);
        });
        container.classList.add('show-container');
    }
    
}