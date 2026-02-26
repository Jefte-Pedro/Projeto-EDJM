/* ===== TRADUÇÕES ===== */

const traducoes = {
    pt: {
        idioma: "Português",
        inicio: "Início",
        lista: "Minha Lista",
        lendo: "Continuar Lendo",
        lidos: "Livros Lidos",
        reservados: "Livros Reservados",
        busca: "Digite o nome do livro ou autor(a) que deseja buscar",
        sugestoes: "Sugestões de leitura",
        descricao: "Escolha livros que deseja ler e armazene em sua lista para acessar rapidamente quando precisar."
    },

    en: {
        idioma: "English",
        inicio: "Home",
        lista: "My List",
        lendo: "Continue Reading",
        lidos: "Read Books",
        reservados: "Reserved Books",
        busca: "Type the book or author name you want to search",
        sugestoes: "Reading Suggestions",
        descricao: "Choose books you want to read and store them in your list for quick access."
    },

    es: {
        idioma: "Español",
        inicio: "Inicio",
        lista: "Mi Lista",
        lendo: "Continuar Leyendo",
        lidos: "Libros Leídos",
        reservados: "Libros Reservados",
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
        document.getElementById("nav-lendo").textContent = traducoes[lang].lendo;
        document.getElementById("nav-lidos").textContent = traducoes[lang].lidos;
        document.getElementById("nav-reservados").textContent = traducoes[lang].reservados;

        document.getElementById("busca-texto").placeholder = traducoes[lang].busca;
        document.getElementById("sugestoes").textContent = traducoes[lang].sugestoes;
        document.getElementById("descricao").textContent = traducoes[lang].descricao;

        localStorage.setItem("idioma", lang);
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