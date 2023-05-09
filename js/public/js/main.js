

class Cart{
    constructor(){
        this.carts = []
        this.numberOfProduct = 0
    }

    add(product) {
        // let idx = this.carts.indexOf()
        for(let i = 0; i < this.carts.length;i++) {
            if(this.carts[i].product_id == product.product_id) {
                this.carts[i].quantity++
                return;
            }
        }
        this.carts.push(product)
        this.numberOfProduct++
        // console.log(this.carts)
    }

    remove(id){
        for(let i = 0; i< this.carts.length;i++){
            if (this.carts[i].product_id == id) {
                this.carts.splice(i,1)
                this.numberOfProduct--
            }
        }
    }

    isExist(id) {
        for(let i = 0; i < this.carts.length;i++) {
            if(this.carts[i].product_id == id) {
                return true;
            }
        }
    }

    getTotalPrice (){
        return this.carts.reduce((total,p) => total + p.product_price * p.quantity,0);
    }
}


var cartIcon = document.querySelector("#cart-icon");
var cart= document.querySelector(".cart");
var closeCart= document.querySelector("#close-cart");

var c = new Cart()

//open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};
//Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};
//Cart working JS
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
}else{
    ready();
}
//Creating a function
function ready() {
    // Remove Items From Cart
    var reomveCartButtons = document.getElementsByClassName('cart-remove');
    for(var i = 0; i < reomveCartButtons.length; i++){
        var button = reomveCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for(var i=0; i < quantityInputs.length;i++){
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    //Add To cart
    var addCart = document.getElementsByTagName('button');
    for(var i=0; i < addCart.length;i++){
        var button =addCart[i];
        button.addEventListener("click", addCartClicked);
    }
}

//Remove Items From Cart
function removeCartItem(event){
    var button = event.target;
    var shopProducts= button.parentElement.parentElement;
    console.log(shopProducts)
    var price = shopProducts.getElementsByClassName("price")[0].value;
    console.log(price)
    var id = shopProducts.getElementsByClassName("p_id")[0].value;
    console.log(id)
    c.remove(id)
    button.parentNode.parentNode.remove();
    updatetotal();
}
//quantity changes
function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value <=0) {
        input.value = 1;

    }
    updatetotal();
}


//add to cart
function addCartClicked(event){
        var button = event.target;
        var shopProducts= button.parentElement.parentElement;
        console.log(shopProducts)
        var title = shopProducts.getElementsByClassName("product-title")[0].innerHTML;
        var price = shopProducts.getElementsByClassName("price")[0].value;
        console.log(price)
        var product_id = shopProducts.getElementsByClassName("p_id")[0].value;
        console.log(product_id)
        var productImg = shopProducts.getElementsByClassName("product-img")[0].src
    
        let product = {
            order_id:generateUUID(),
            product_id,
            product_price:price,
            quantity:1,
            product_image:productImg,
            customer_id:'sdkfjfie',
            product_name:title

        }
        console.log(product)
        if (!c.isExist(product_id)) addProductToCart(product_id,title,price,productImg);
        c.add(product)
        updatetotal();
}
function addProductToCart(product_id,title, price, productImg){
    var cartShopBox = document.createElement("div");
    var cartItems = document.getElementsByClassName("cart-content")[0];

var cartBoxContent = `<div class="cart-box">
<img src="${productImg}" alt="" class="cart-img">
<div class="detail-box"> 
     <div class="cart-product-title"> ${title}</div>
     <div class="cart-price">${price}</div>
     <input type="number" value="1" class="cart-quantity">
</div>
<input type="number" class="p_id" value=${product_id} hidden>
<input type="number" class="price" value=${price} hidden>
<!----> Remove Cart 
<i class='bx bxs-trash-alt cart-remove' ><img src="../../img/trash-alt-solid-24.png"/></i>--> `;

cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click",removeCartItem);
cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change",quantityChanged);
}

//update Total
function updatetotal(){

        document.getElementsByClassName('total-price')[0].innerText ='GHS' + c.getTotalPrice();
}


var BuyButton= document.getElementById("btn");
BuyButton.onclick = function sendOrder(){

    fetch("http://localhost:8080/place_order", {
    method: 'POST',
    body: JSON.stringify({orders:c.carts}),
    headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
}).then((response) => {
    return response
}).then((res) => {
    if (res.status === 201) {
        console.log("Post successfully created!")
    }
}).catch((error) => {
    console.log(error)
})
}




function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
} 



// function httpSend(url="localhost:5000", data){
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             var json = JSON.parse(xhr.responseText);
//             console.log(json);
//         }
//     };
//     var data = JSON.stringify(data);
//     xhr.send(data);
// }