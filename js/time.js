
function getStatusLanchonete() {
    const agora = new Date();
    const diaDaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const horaAtual = agora.getHours();
    const minutosAtuais = agora.getMinutes();

    // Segunda-feira (folga)
    if (diaDaSemana === 1) {
        return {
            aberta: false,
            mensagem: "Fechada - Abre amanhã às 19:00"
        };
    }

    // Horário de funcionamento: 19:00h às 24:00h
    if (horaAtual >= 19 && horaAtual < 24) {
        return {
            aberta: true,
            mensagem: `Aberta agora - Fecha às 24:00`
        };
    }

    // Fora do horário de funcionamento
    return {
        aberta: false,
        mensagem: "Fechada - Abre hoje às 19:00"
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const status = getStatusLanchonete();
    const statusContainer = document.getElementById("status-container");
    const botaoContainer = document.getElementById("botao-container");

    // Atualiza o status no cabeçalho
    statusContainer.innerHTML = `
        <div class="${status.aberta ? 'bg-green-500 p-4 rounded text-white' : 'bg-red-500 p-4 rounded text-white'}">
            ${status.mensagem}
        </div>
    `;

    // Define a visibilidade do container dos botões
    botaoContainer.style.display = status.aberta ? "block" : "none";
});
