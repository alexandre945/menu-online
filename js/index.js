const menu = document.getElementById("menu");
const dialog = document.getElementById("dialog-adicionais");
const nomeLanche = document.getElementById("nome-lanche");
const precoLanche = document.getElementById("preco-lanche");
const quantidadeInput = document.getElementById("quantidade-lanche");
const adicionaisCheckbox = document.querySelectorAll(".adicional");
const confirmarBtn = document.getElementById("confirmar-opcionais");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartBtn = document.getElementById("cart-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const addressInput = document.getElementById("address");
const nameInput = document.getElementById("name");
const observerInput = document.getElementById("observer");

let cart = [];
let currentItem = { name: "", price: 0 };

cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
  cartBtn.style.display = "none";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
  cartBtn.style.display = "flex";
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
    cartBtn.style.display = "flex";
  }
});

// Abrir modal com dados do lanche
document.querySelectorAll(".add-to-dialog-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentItem.name = btn.dataset.name;
    currentItem.price = parseFloat(btn.dataset.price.replace(",", "."));

    nomeLanche.textContent = currentItem.name;
    precoLanche.textContent = `R$ ${currentItem.price.toFixed(2)}`;
    quantidadeInput.value = 1;

    adicionaisCheckbox.forEach((checkbox) => {
      checkbox.checked = false;
    });

    dialog.showModal();
  });
});

// Confirmar e adicionar ao carrinho
confirmarBtn.addEventListener("click", () => {
  const quantidade = parseInt(quantidadeInput.value);
  const adicionais = [];

  let adicionaisTotal = 0;
  adicionaisCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      const name = checkbox.dataset.name;
      const price = parseFloat(checkbox.dataset.price);
      adicionais.push({ name, price });
      adicionaisTotal += price;
    }
  });

  const item = {
    name: currentItem.name,
    price: currentItem.price,
    quantity: quantidade,
    adicionais,
  };

  const existingIndex = cart.findIndex(
    (i) =>
      i.name === item.name &&
      JSON.stringify(i.adicionais) === JSON.stringify(item.adicionais)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantidade;
  } else {
    cart.push(item);
  }

  dialog.close();
  updateCartModal();
});

// Atualizar carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const adicionaisText = item.adicionais
      .map((a) => `${a.name} (+R$ ${a.price.toFixed(2)})`)
      .join(", ");
    const adicionaisTotal = item.adicionais.reduce((acc, a) => acc + a.price, 0);
    const itemTotal = (item.price + adicionaisTotal) * item.quantity;
    total += itemTotal;

    const el = document.createElement("div");
    el.className = "flex justify-between mb-4 flex-col";
    el.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          ${
            adicionaisText
              ? `<p class="text-sm text-gray-600">Adicionais: ${adicionaisText}</p>`
              : ""
          }
         
          <p class="font-medium">R$ ${itemTotal.toFixed(2)}</p>
        </div>
        <button class="remove-btn text-red-500 border p-2 rounded bg-slate-300 hover:text-emerald-600" data-index="${index}">remover</button>
      </div>
    `;
    cartItemsContainer.appendChild(el);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.textContent = cart.length;
}

// Remover item
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.dataset.index);
    if (!isNaN(index)) {
      cart.splice(index, 1);
      updateCartModal();
    }
  }
});

// Finalizar pedido via WhatsApp
checkoutBtn.addEventListener("click", () => {
  const address = addressInput.value.trim();
  const name = nameInput.value.trim();
  const observer = observerInput.value.trim();

  if (!address || !name) {
    alert("Preencha o nome e o endereço.");
    return;
  }

  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let msg = `*NOVO PEDIDO*%0A%0A`;
  cart.forEach((item) => {
    const adicionais = item.adicionais
      .map((a) => `${a.name} (+R$ ${a.price.toFixed(2)})`)
      .join(", ");
    msg += `• ${item.name} (x${item.quantity})%0A`;
    if (adicionais) msg += `   Adicionais: ${adicionais}%0A`;
  });

  const total = cart.reduce((acc, item) => {
    const adicionais = item.adicionais.reduce((a, b) => a + b.price, 0);
    return acc + (item.price + adicionais) * item.quantity;
  }, 0);

  msg += `%0ATotal: R$ ${total.toFixed(2)}%0A`;
  msg += `Endereço: ${address}%0A`;
  msg += `Cliente: ${name}%0A`;
  if (observer) msg += `Obs: ${observer}%0A`;

  const phone = "5535999346299";
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");

  cart = [];
  updateCartModal();
});
