/* ===== TRADUÇÕES ===== */

/* ===== TRADUÇÕES ATUALIZADAS ===== */
const traducoes = {
    pt: {
        idioma: "Português",
        inicio: "Início",
        lista: "Minha Lista",
        reservados: "Livros Reservados",
        lidos: "Livros Lidos",
        prazos: "Meus Prazos", // Nome novo
        busca: "Digite o nome do livro ou autor(a) que deseja buscar",
        sugestoes: "Sugestões de leitura",
        descricao: "Escolha livros que deseja ler e armazene em sua lista para acessar rapidamente quando precisar."
    },
    en: {
        idioma: "English",
        inicio: "Home",
        lista: "My List",
        reservados: "Reserved Books",
        lidos: "Read Books",
        prazos: "My Deadlines",
        busca: "Type the book or author name you want to search",
        sugestoes: "Reading Suggestions",
        descricao: "Choose books you want to read and store them in your list for quick access."
    },
    es: {
        idioma: "Español",
        inicio: "Inicio",
        lista: "Mi Lista",
        reservados: "Libros Reservados",
        lidos: "Libros Leídos",
        prazos: "Mis Plazos",
        busca: "Escribe el nombre del libro o autor que deseas buscar",
        sugestoes: "Sugerencias de lectura",
        descricao: "Elige libros que deseas leer y guárdalos en tu lista para acceder rápidamente."
    }
};

/* ===== ESPERAR HTML CARREGAR ===== */

document.addEventListener("DOMContentLoaded", () => {

    const botaoIdioma = document.querySelector(".idioma");
    const menuIdioma = document.querySelector(".idioma-menu");
    const idiomaTexto = document.getElementById("idioma-texto");

    if (!botaoIdioma || !menuIdioma) return;

    /* ===== ABRIR MENU ===== */

    botaoIdioma.addEventListener("click", () => {
        menuIdioma.classList.toggle("ativo");
    });

    /* ===== FECHAR AO CLICAR FORA ===== */

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".idioma-container")) {
            menuIdioma.classList.remove("ativo");
        }
    });

    /* ===== TROCAR IDIOMA ===== */

    function trocarIdioma(lang) {
        idiomaTexto.textContent = traducoes[lang].idioma;

        document.getElementById("nav-inicio").textContent = traducoes[lang].inicio;
        document.getElementById("nav-lista").textContent = traducoes[lang].lista;
        document.getElementById("nav-reservados").textContent = traducoes[lang].reservados;
        document.getElementById("nav-lidos").textContent = traducoes[lang].lidos;
        //document.getElementById("nav-prazo").textContent = traducoes[lang].prazos; // ID atualizado

        document.getElementById("busca-texto").placeholder = traducoes[lang].busca;
        document.getElementById("sugestoes").textContent = traducoes[lang].sugestoes;

        // Atualiza todas as descrições que usam o ID descricao
        const descricoes = document.querySelectorAll("#descricao");
        descricoes.forEach(d => d.textContent = traducoes[lang].descricao);
    }

    /* ===== CLICAR OPÇÃO ===== */

    document.querySelectorAll(".idioma-menu button").forEach(btn => {
        btn.addEventListener("click", () => {
            trocarIdioma(btn.dataset.lang);
            menuIdioma.classList.remove("ativo");
        });
    });

    /* ===== CARREGAR IDIOMA SALVO ===== */

    const idiomaSalvo = localStorage.getItem("idioma") || "pt";
    trocarIdioma(idiomaSalvo);

});
/* ===== ACESSIBILIDADE - TAMANHO DA FONTE ===== */

const btnAumentar = document.getElementById("aumentar-fonte");
const btnDiminuir = document.getElementById("diminuir-fonte");

let tamanhoFonte = 16;

/* carregar tamanho salvo */
if (localStorage.getItem("fonte")) {
    tamanhoFonte = parseInt(localStorage.getItem("fonte"));
    document.documentElement.style.fontSize = tamanhoFonte + "px";
}

/* aumentar */
btnAumentar.addEventListener("click", () => {
    tamanhoFonte += 1;
    document.documentElement.style.fontSize = tamanhoFonte + "px";
    localStorage.setItem("fonte", tamanhoFonte);
});

/* diminuir */
btnDiminuir.addEventListener("click", () => {
    tamanhoFonte -= 1;
    document.documentElement.style.fontSize = tamanhoFonte + "px";
    localStorage.setItem("fonte", tamanhoFonte);
});

function mostrarPagina(idPagina) {
    // 1. Esconde as seções
    const paginas = document.querySelectorAll('.conteudo-pag');
    paginas.forEach(pag => pag.style.display = 'none');

    // 2. Mostra a clicada
    const paginaAlvo = document.getElementById(idPagina);
    if (paginaAlvo) {
        paginaAlvo.style.display = 'block';
    }



    // 3. Gerenciar botões ativos na sidebar
    const botoes = document.querySelectorAll('.sidebar button');
    botoes.forEach(btn => btn.classList.remove('ativo'));

    // Adiciona 'ativo' ao botão que foi clicado
    if (window.event) {
        window.event.currentTarget.classList.add('ativo');
    }
}

function mostrarLivro() {
    const container = document.getElementById("lista-livros");
    container.innerHTML = "";

    livros.forEach(livro => {
        container.innerHTML += `
        <div class="card-livro">
            <img src="${livro.capa}" alt="${livro.titulo}" class="capa-livro">
            <h3>${livro.titulo}</h3>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Prateleira:</strong> ${livro.prateleira}</p>
            <p><strong>Status:</strong> ${livro.disponivel ? "Disponível" : "Emprestado"}</p>
        </div>
        `;
    });
}

console.log("mostrarLivros foi chamada");
mostrarLivro();