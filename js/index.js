// import '../css/style.css';
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const nameIpunt = document.getElementById("name")
const addressWarn = document.getElementById("address-warn")
const nameWarn = document.getElementById("name-warn")
const observerIpunt = document.getElementById("observer")

let cart = [];

// Função para carregar o carrinho salvo no localStorage ao iniciar a aplicação

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Inicialização: Carregar o carrinho salvo no localStorage ao iniciar a aplicação

loadCartFromLocalStorage();
updateCartModal();

// Limpar o carrinho ao atualizar a página

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('cart');
});

// Carregar o carrinho salvo no localStorage ao iniciar a aplicação
loadCartFromLocalStorage();

//abrir o madal

cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar modal clicando fora

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar modal clicando no botão de fechar

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

//adicionar item ao carrinho

menu.addEventListener("click", function(event) {
    let parrentButton = event.target.closest(".add-to-cart-btn")
    const name = parrentButton.getAttribute("data-name")
    const price = parseFloat(parrentButton.getAttribute("data-price"))

    addToCart(name, price)
})

//função para adicionar imtem ao carrinho verificando se for o mesmo soma + um

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        }) 
    }
    // Atualiza o carrinho no localStorage

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartModal()
}

//atualiza carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="">
                    <p class="font-medium">${item.name}</p>
                    <p>qtd: ${item.quantity}</p>
                    <p class="font-medium"> R$ ${item.price.toFixed(2)}</p>
                </div>

                <div>
                    <button class="remove-btn text-red-500 border p-2 rounded bg-slate-300 hover:text-emerald-600" data-name="${item.name}">remover</button>
                </div>
            </div>
        `;
        
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCount.innerHTML = cart.length;
}

// Inicialização: Atualizar o carrinho modal
updateCartModal();

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-btn")){
       const name = event.target.getAttribute("data-name")

       removeItemCart(name);
    }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
    }

        cart.splice(index, 1);
        updateCartModal();
  }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-500")
        addressWarn.classList.add("hidden")
    }
  
})

checkoutBtn.addEventListener("click", function() {
 
      
    const isOpen = checkLanchonetOpen();
    //  if(!isOpen){
    //      Toastify({
    //         text: "Lanchonete fechada",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", // `top` or `bottom`
    //         position: "center", // `left`, `center` or `right`
    //         stopOnFocus: true, // Prevents dismissing of toast on hover
    //         style: {
    //           background: "#ef4444",
    //         },
    //      }).showToast();
    //     return;
    //  }

    if(addressInput.length === 0) {
        return;
    }

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    if(nameIpunt.value === ""){
        nameWarn.classList.remove("hidden")
        nameIpunt.classList.add("border-red-500")
        return;
    }

   

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)}`
        );
    }).join('\n');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const message = encodeURIComponent(`NOVO PEDIDO\n\n${cartItems}
                                                    \nTotal: R$${total.toFixed(2)}
                                                    \n\nEndereço: ${addressInput.value}
                                                    \n\nEntregar para: ${nameIpunt.value}
                                                    \n\nObservação ${observerIpunt.value}`);
    
    const phone = "+5535998464219";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    
    cart = [];
    updateCartModal();

    })

function checkLanchonetOpen(){

   const data = new Date();
   const hora = data.getHours();
   const diaDaSemana = data.getDay();
   return (diaDaSemana !== 1) && (hora > 19 && hora < 24); // true ou false
   
}

const dataEspan = document.getElementById("data-span")
const isOpen = checkLanchonetOpen();

if(isOpen){
    dataEspan.classList.remove("bg-red-500");
    dataEspan.classList.add("bg-green-600") 
}else{
    dataEspan.classList.add("bg-red-500");
    dataEspan.classList.remove("bg-green-600") 
}
