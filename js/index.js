function abrirModal(nome, descricao, preco, exibirOpcionais = true) {
  document.getElementById('modal-nome').textContent = nome;
  document.getElementById('modal-descricao').textContent = descricao;
  document.getElementById('modal-preco').textContent = `R$ ${preco.toFixed(2)}`;
  document.getElementById('modal-quantidade').value = 1;

  const precosOpcionais = {
    Ovo: 2.00,
    Bacon: 7.00,
    Cheddar: 4.00,
    Catupiry: 4.00,
    Frango: 5.00,
    Calabresa: 7.00,
    Presunto: 2.00,
    Mussarela: 3.00,
    Cebola: 2.00,
    'catchup sachê 3unid': 1.00, 
    'Milho verde': 2.00,
   'Hambúrguer 90g': 7.00,
   'Hambúrguer 56g': 5.00,
    'Batata Palha':2.00,
  };

  const container = document.getElementById('modal-opcionais');
  container.innerHTML = ''; // Limpa antes

  if (exibirOpcionais) {
    container.style.display = 'block'; // Mostra opcionais
 
    const opcionais = ['Ovo', 'Bacon', 'Cheddar', 'Batata Palha', 'Catupiry', 'Calabresa', 'Hambúrguer 90g', 'Hambúrguer 56g', 'Frango', 'Presunto', 'Mussarela', 'catchup sachê 3unid', 'Milho verde', 'Cebola'];
    opcionais.forEach(opcional => {
      const precoOpcional = precosOpcionais[opcional] || 0;
      const div = document.createElement('div');
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${opcional}" data-preco="${precoOpcional}"> ${opcional} (R$ ${precoOpcional.toFixed(2)})
        </label>
      `;
      container.appendChild(div);
    });
  } else {
    container.style.display = 'none'; // Oculta opcionais
  }

  // Atualiza o preço total exibido ao mudar a quantidade ou opcionais
  function atualizarPrecoTotal() {
    let quantidade = parseInt(document.getElementById('modal-quantidade').value) || 1;
    
    let totalLanches = preco * quantidade;
    let totalAdicionais = 0;
  
    const checkboxes = container.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(cb => {
      totalAdicionais += parseFloat(cb.dataset.preco);
    });
  
    let total = totalLanches + totalAdicionais;
  
    document.getElementById('modal-preco').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('modal-preco').dataset.precoBase = preco.toFixed(2);

  }

  document.getElementById('modal-quantidade').addEventListener('input', atualizarPrecoTotal);
  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', atualizarPrecoTotal);
  });

  atualizarPrecoTotal();

  document.getElementById('dialog-lanche').showModal();
}
function fecharModal() {
  const dialog = document.getElementById('dialog-lanche');
  if (dialog && dialog.open) {
    dialog.close();
  }
}

//adicionar ao carrinho 
function adicionarAoCarrinho() {
  const nome = document.getElementById('modal-nome').textContent;
  const descricao = document.getElementById('modal-descricao').textContent;
  const precoBase = parseFloat(document.getElementById('modal-preco').dataset.precoBase);
  const quantidade = parseInt(document.getElementById('modal-quantidade').value);

  // Captura os opcionais marcados
  const opcionais = [];
  let precoAdicionais = 0;
  document.querySelectorAll('#modal-opcionais input[type="checkbox"]:checked').forEach(checkbox => {
    opcionais.push(checkbox.value);
    precoAdicionais += parseFloat(checkbox.dataset.preco);
  });

  const item = {
    nome,
    descricao,
    precoBase,
    precoAdicionais,
    quantidade,
    opcionais
  };

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(item);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  exibirCarrinho();
  document.getElementById('carrinho').scrollIntoView({ behavior: 'smooth' });
  alert('Item adicionado ao carrinho!');
  fecharModal();
}



  //exibir o carrinho 
    function exibirCarrinho() {
  const container = document.getElementById('carrinho');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    container.innerHTML = '<p class="text-gray-600">Carrinho vazio</p>';
    return;
  }

  // 🔸 Verifica se já havia um tipo de pedido selecionado
  const tipoSelecionadoAnterior = document.querySelector('input[name="tipoPedido"]:checked');
  const tipoPedidoValor = tipoSelecionadoAnterior ? tipoSelecionadoAnterior.value : 'retirar';


  let html = '<h3 class="text-lg font-bold mb-2 text-center">Carrinho</h3>';
  let total = 0;

  carrinho.forEach((item, index) => {

    const subtotal = (item.precoBase * item.quantidade) + item.precoAdicionais;
    total += subtotal;
    html += `
      <div class="mb-2 p-2 bg-white rounded shadow">
        <p><strong>${item.nome}</strong> <br/>quantidade:${item.quantidade}</p>
        ${item.opcionais.length > 0 ? `<p>Adicionais: ${item.opcionais.join(', ')}</p>` : ''}
        <p>Subtotal: R$ ${(subtotal).toFixed(2)}</p>
        <button onclick="removerDoCarrinho(${index})" class="text-red-500 text-sm mt-1">Remover</button>
      </div>
    `;
  });

  // 🔸 Tipo de Pedido
  html += `
    <div class="mt-4">
      <label class="block font-bold mb-1">Tipo de Pedido:</label>
      <label>
        <input type="radio" name="tipoPedido" value="retirar" ${tipoPedidoValor === 'retirar' ? 'checked' : ''} onchange="toggleEntrega()"> Retirar na lanchonete
      </label><br>
      <label>
        <input type="radio" name="tipoPedido" value="entrega" ${tipoPedidoValor === 'entrega' ? 'checked' : ''} onchange="toggleEntrega()"> Entrega (R$ 7,00)
      </label>
    </div>

    <div id="campos-retirada" class="mt-4 ${tipoPedidoValor === 'retirar' ? '' : 'hidden'}">
      <label class="block mt-2">Nome: <input type="text" id="nomeCliente" class="border p-1 w-full"></label>
      <label class="block mt-2">WhatsApp: <input type="text" id="zapCliente" class="border p-1 w-full"></label>
    </div>

    <div id="campos-entrega" class="mt-4 ${tipoPedidoValor === 'entrega' ? '' : 'hidden'}">
      <label class="block mt-2">Nome: <input type="text" id="nomeClienteEntrega" class="border p-1 w-full"></label>
      <label class="block mt-2">WhatsApp: <input type="text" id="zapClienteEntrega" class="border p-1 w-full"></label>
      <label class="block mt-2">Bairro: <input type="text" id="bairro" class="border p-1 w-full"></label>
      <label class="block mt-2">Rua: <input type="text" id="rua" class="border p-1 w-full"></label>
      <label class="block mt-2">Número: <input type="text" id="numero" class="border p-1 w-full"></label>
      <label class="block mt-2">Referência: <input type="text" id="referencia" class="border p-1 w-full"></label>
    </div>
    <div class="mt-4">
    <label class="block mt-2">Observação:</label>
    <textarea id="observacao" class="border p-1 w-full rounded" placeholder="Ex: sem cebola, troco para 100..."></textarea>
    </div>
  `;
  //tipo de pagamento
    html += `
  <div class="mt-4">
    <label class="block font-bold mb-1">Forma de Pagamento:</label>
    <label>
      <input type="radio" name="formaPagamento" value="dinheiro" onchange="togglePagamento()"> Dinheiro
    </label><br>
    <label>
      <input type="radio" name="formaPagamento" value="cartao" onchange="togglePagamento()"> Cartão
    </label>
  </div>

  <div id="campoTroco" class="mt-2 hidden">
    <label>Troco para quanto?
      <input type="text" id="valorTroco" class="border p-1 w-full" placeholder="Ex: 100,00">
    </label>
  </div>

  <div id="campoCartao" class="mt-2 hidden">
    <label>Tipo de cartão:
      <select id="tipoCartao" class="border p-1 w-full">
        <option value="credito">Crédito</option>
        <option value="debito">Débito</option>
        <option value="pix_maquina">Pix na maquina</option>
      </select>
    </label>
  </div>
`;



  // 🔸 Soma a taxa de entrega se estiver selecionado
  if (tipoPedidoValor === 'entrega') {
    total += 7;
  }

  html += `<p class="font-bold mt-2 bg-white p-2">Total: R$ ${total.toFixed(2)}</p>`;
  html += `<button onclick="enviarPedido()" class="bg-green-500 text-white px-4 py-2 rounded mt-2">Enviar Pedido</button>`;

  container.innerHTML = html;
}

  function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho();
  }

  // Exibir carrinho ao carregar a página
  window.onload = exibirCarrinho;

  function togglePagamento() {
  const pagamentoSelecionado = document.querySelector('input[name="formaPagamento"]:checked')?.value;
  const campoTroco = document.getElementById('campoTroco');
  const campoCartao = document.getElementById('campoCartao');

  if (pagamentoSelecionado === 'dinheiro') {
    campoTroco.classList.remove('hidden');
    campoCartao.classList.add('hidden');
  } else if (pagamentoSelecionado === 'cartao') {
    campoCartao.classList.remove('hidden');
    campoTroco.classList.add('hidden');
  } else {
    campoTroco.classList.add('hidden');
    campoCartao.classList.add('hidden');
  }
}


  function toggleEntrega() {
  const tipo = document.querySelector('input[name="tipoPedido"]:checked').value;
  const entregaCampos = document.getElementById('campos-entrega');
  const retiradaCampos = document.getElementById('campos-retirada');

  if (tipo === 'entrega') {
    entregaCampos.classList.remove('hidden');
    retiradaCampos.classList.add('hidden');
  } else {
    entregaCampos.classList.add('hidden');
    retiradaCampos.classList.remove('hidden');
  }

  // Reexibir carrinho para recalcular total com ou sem entrega
  exibirCarrinho();
}

function enviarPedido() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0)
  return alert('Carrinho vazio');

  let mensagem = '*🛒 PEDIDO AMIGÃO LANCHES*%0A%0A';
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = (item.precoBase * item.quantidade) + item.precoAdicionais;
    total += subtotal;
  
    mensagem += ` ${item.nome}%0A`;
    mensagem += ` quantidade ${item.quantidade}%0A`;
    mensagem += ` observação ${item.observation || ''}%0A`;
  
    if (item.opcionais.length > 0) {
      mensagem += `  Adicionais: ${item.opcionais.join(', ')}%0A`;
    }
  
    mensagem += `  Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}%0A%0A`;
  });
  

  // Tipo de pedido
  const tipoPedido = document.querySelector('input[name="tipoPedido"]:checked').value;
  mensagem += `*Tipo de Pedido:* ${tipoPedido === 'entrega' ? 'Entrega' : 'Retirar na lanchonete'}%0A`;
  const observacao = document.getElementById('observacao')?.value || '';
  if (tipoPedido === 'entrega') {
    total += 7;

    const nome = document.getElementById('nomeClienteEntrega').value;
    const zap = document.getElementById('zapClienteEntrega').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const referencia = document.getElementById('referencia').value;
    


    if (!nome || !zap || !bairro || !rua || !numero) {
      alert('Preencha todos os campos de entrega.');
      return;
    }

    mensagem += `*Nome:* ${nome}%0A`;
    mensagem += `*WhatsApp:* ${zap}%0A`;
    mensagem += `\n📝 Observação: ${observacao}`;

    mensagem += `*Endereço:* Rua ${rua}, nº ${numero}, Bairro ${bairro}%0A`;
    if (referencia) mensagem += `*Referência:* ${referencia}%0A`;
  } else {
    const nome = document.getElementById('nomeCliente').value;
    const zap = document.getElementById('zapCliente').value;
    

    if (!nome || !zap) {
      alert('Preencha nome e WhatsApp.');
      return;
    }

    mensagem += `*Nome:* ${nome}%0A`;
    mensagem += `*WhatsApp:* ${zap}%0A`;
    mensagem += `\n📝 Observação: ${observacao}%0A`;
  }
  const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked')?.value || '';
let pagamentoTexto = '';

if (formaPagamento === 'dinheiro') {
  const valorTroco = document.getElementById('valorTroco').value;
  pagamentoTexto = `Dinheiro (troco para R$ ${valorTroco})`;
} else if (formaPagamento === 'cartao') {
  const tipoCartao = document.getElementById('tipoCartao').value;
  pagamentoTexto = `Cartão (${tipoCartao})`;
}


mensagem += `*Forma de Pagamento:* ${pagamentoTexto}%0A`;


  mensagem += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;



  const nunberLanchonete = '5535999999999';
  const NunberHost = '5535998464219';

  const url = `https://wa.me/${NunberHost}?text=${mensagem}`;
  window.open(url, '_blank');

  //  limpar carrinho
  localStorage.removeItem('carrinho');
  exibirCarrinho();
}
function verificarStatusLoja() {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const hora = agora.getHours();

  const statusTexto = document.getElementById("statusTexto");

  if (diaSemana === 1) {
    // Segunda-feira
    statusTexto.textContent = "❌ Fechado. Abriremos amanhã às 19h.";
    statusTexto.className = "text-sm text-red-600";
  } else if (hora >= 19 && hora < 24) {
    // Dentro do horário de funcionamento
    statusTexto.textContent = "✅ Estamos abertos!";
    statusTexto.className = "text-sm text-green-600";
  } else {
    // Fora do horário
    statusTexto.textContent = "❌ Fechado. Abrimos hoje às 19h.";
    statusTexto.className = "text-sm text-red-600";
  }
}

verificarStatusLoja();

