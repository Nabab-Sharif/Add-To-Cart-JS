let iconCart = document.querySelector(".icon-cart");
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listProductHTML = document.querySelector(".listProductHTML");
let listCartHTML = document.querySelector(".listCart");
let iconCartSpan = document.querySelector('.icon-cart span');
let TotalItemInSideCart = document.querySelector(".TotalItem");
let TotalAmount = document.querySelector('.TotalAmount');


//.................cart open and close....................
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
})




//...................Start data fetch from products.json file.......
let listProducts = []

const getData = async () => {
  const response = await fetch('products.json')
  const data = await response.json()
  listProducts = data;
  addDataToHTML();
}
getData();
//................End data fetch from products.json file............


//.......................Show Data UI Start......................
const addDataToHTML = () => {
  listProductHTML.innerHTML = '';

  if (listProducts.length > 0) {

    listProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
        <img src="${product.image}" alt="">
        <h2>${product.name}</h2>
        <h5 class="price">${product.price}$/each</h5>
        <p class="text">${product.text}</p>
        <button class="addCart">Add To Order</button>
        <button class="customize">Customize</button>

      `;
      listProductHTML.appendChild(newProduct);
    })
  }
}
//.......................Show Data UI End......................


// For Sidebar cart
//.......................Select Product Part Start......................
listProductHTML.addEventListener('click', (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains('addCart')) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id, positionClick);
  }
})
//.......................Select Product Part End........................



//..................Add To Cart Product Part Start....................
let carts = [];

const addToCart = (product_id, positionClick) => {
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id)

  if (carts.length <= 0) {
    carts = [{
      product_id: product_id,
      quantity: 1
    }]

    if (positionClick.classList.contains('addCart')) {
      positionClick.style.backgroundColor = '#5E6472';
    }

  } else if (positionThisProductInCart < 0) {

    carts.push({
      product_id: product_id,
      quantity: 1
    });
    if (positionClick.classList.contains('addCart')) {
      positionClick.style.backgroundColor = '#5E6472';
    }

  }

  addCartToHTML();

}
//..................Add To Cart Product Part End......................



//................UI Side Add To Cart Product Part Start....................
const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  let TotalPriceAllItem = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity = totalQuantity + cart.quantity
      let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
      let info = listProducts[positionProduct]

      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.dataset.id = cart.product_id;
      newCart.innerHTML = `
         <div class="image">
            <img src="${info.image}" alt="" />
         </div>

         <div>
            <h2 class="name">${info.name}</h2>
            <p class="price">${info.price}$/each</p>
            
            <div class="quantity">
                <span class="minus">-</span>
                <span class="cart_quantity">${cart.quantity}</span>
                <span class="plus">+</span>
            </div>
         </div>
         <div class="totalPrice">${info.price * cart.quantity}$</div>
         <div class="cart-remove_parent">
         <i class='fa-solid fa-trash cart-remove'></i>
         </div>
         `

      listCartHTML.appendChild(newCart);

      TotalPriceAllItem = TotalPriceAllItem + info.price * cart.quantity;
    })
  }


  iconCartSpan.innerText = totalQuantity;
  TotalItemInSideCart.innerText = totalQuantity;
  TotalAmount.innerText = TotalPriceAllItem

}
//................UI Add To Cart Product Part End......................




//..............quantity Increment , Decrement and Remove cart Part Start.............
listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus') || positionClick.classList.contains('cart-remove')) {
    let product_id = positionClick.parentElement.parentElement.parentElement.dataset.id;
    let type = 'minus';

    if (positionClick.classList.contains('plus')) {
      type = 'plus';
    } else if (positionClick.classList.contains('cart-remove')) {
      type = 'cart-remove'
    }

    changeQuantityCart(product_id, type, positionClick);
  }

})


const changeQuantityCart = (product_id, type, positionClick) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);

  if (positionItemInCart >= 0) {

    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = carts[positionItemInCart].quantity - 1
        if (changeQuantity > 0) {
          carts[positionItemInCart].quantity = changeQuantity;
        } else {
          carts.splice(positionItemInCart, 1)
        }
        break;

    }

  }
  else if (type == 'cart-remove') {
    carts.splice(positionItemInCart, 1)
  }

  addCartToHTML();

}

//..............quantity Increment , Decrement and Remove cart Part End.............
