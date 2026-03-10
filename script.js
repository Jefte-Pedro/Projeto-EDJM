/* ===== TRADUÇÕES ===== */

const traducoes = {
    pt: {
        idioma: "Português",
        inicio: "Início",
        lista: "Minha Lista",
        reservados: "Livros Reservados",
        lidos: "Livros Lidos",
        prazos: "Meus Prazos",
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


/* ===== CARREGAR HTML ===== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===== SISTEMA DE IDIOMA ===== */

    const botaoIdioma = document.querySelector(".idioma");
    const menuIdioma = document.querySelector(".idioma-menu");
    const idiomaTexto = document.getElementById("idioma-texto");

    if (botaoIdioma && menuIdioma) {

        botaoIdioma.addEventListener("click", () => {
            menuIdioma.classList.toggle("ativo");
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".idioma-container")) {
                menuIdioma.classList.remove("ativo");
            }
        });

        function trocarIdioma(lang) {

            idiomaTexto.textContent = traducoes[lang].idioma;

            document.getElementById("nav-inicio").textContent = traducoes[lang].inicio;
            document.getElementById("nav-lista").textContent = traducoes[lang].lista;
            document.getElementById("nav-reservados").textContent = traducoes[lang].reservados;
            document.getElementById("nav-lidos").textContent = traducoes[lang].lidos;

            document.getElementById("busca-texto").placeholder = traducoes[lang].busca;
            document.getElementById("sugestoes").textContent = traducoes[lang].sugestoes;

            const descricoes = document.querySelectorAll("#descricao");
            descricoes.forEach(d => d.textContent = traducoes[lang].descricao);

            localStorage.setItem("idioma", lang);
        }

        document.querySelectorAll(".idioma-menu button").forEach(btn => {
            btn.addEventListener("click", () => {
                trocarIdioma(btn.dataset.lang);
                menuIdioma.classList.remove("ativo");
            });
        });

        const idiomaSalvo = localStorage.getItem("idioma") || "pt";
        trocarIdioma(idiomaSalvo);
    }


    /* ===== ACESSIBILIDADE - FONTE ===== */

    const btnAumentar = document.getElementById("aumentar-fonte");
    const btnDiminuir = document.getElementById("diminuir-fonte");

    let tamanhoFonte = localStorage.getItem("fonte") || 16;

    document.documentElement.style.fontSize = tamanhoFonte + "px";

    if (btnAumentar) {
        btnAumentar.addEventListener("click", () => {

            tamanhoFonte++;
            document.documentElement.style.fontSize = tamanhoFonte + "px";
            localStorage.setItem("fonte", tamanhoFonte);

        });
    }

    if (btnDiminuir) {
        btnDiminuir.addEventListener("click", () => {

            tamanhoFonte--;
            document.documentElement.style.fontSize = tamanhoFonte + "px";
            localStorage.setItem("fonte", tamanhoFonte);

        });
    }
    /* ===== INICIALIZAÇÃO INTELIGENTE ===== */
    const paginaSalva = localStorage.getItem("paginaAtual") || "pag-inicio";

    if (paginaSalva === "pag-livro") {
        const idLivroSalvo = localStorage.getItem("livroAbertoID");
        if (idLivroSalvo) {
            // Se estava na página do livro, recarrega os dados dele
            abrirLivro(parseInt(idLivroSalvo));
        } else {
            mostrarPagina("pag-inicio");
        }
    } else {
        mostrarPagina(paginaSalva);
    }

});


/* ===== SISTEMA DE PÁGINAS ===== */

function mostrarPagina(idPagina) {
    const paginaAtual = localStorage.getItem("paginaAtual");

    // Só salva como anterior se realmente estivermos mudando de uma página válida
    if (paginaAtual && paginaAtual !== idPagina) {
        localStorage.setItem("paginaAnterior", paginaAtual);
    }

    localStorage.setItem("paginaAtual", idPagina);

    // Esconde todas as páginas
    const paginas = document.querySelectorAll(".conteudo-pag");
    paginas.forEach(p => p.style.display = "none");

    // Mostra a página solicitada
    const pagina = document.getElementById(idPagina);
    if (pagina) {
        pagina.style.display = "block";
    }

    // --- SINCRONIZAÇÃO DA SIDEBAR ---
    // Remove o "ativo" de todos os botões da lateral
    const botoesSidebar = document.querySelectorAll(".sidebar button");
    botoesSidebar.forEach(btn => btn.classList.remove("ativo"));

    // Procura na sidebar qual botão tem o onclick que chama essa página específica
    const botaoParaAtivar = document.querySelector(`.sidebar button[onclick*="'${idPagina}'"]`);

    if (botaoParaAtivar) {
        botaoParaAtivar.classList.add("ativo");
    }
}


/* ===== BOTÃO VOLTAR ===== */

/* ===== BOTÃO VOLTAR (Ajustado) ===== */
function voltarPagina() {
    const paginaAnterior = localStorage.getItem("paginaAnterior");

    // Se houver histórico e não for a própria página do livro, volta. 
    // Caso contrário, manda para o início por segurança.
    if (paginaAnterior && paginaAnterior !== "pag-livro") {
        mostrarPagina(paginaAnterior);
    } else {
        mostrarPagina("pag-inicio");
    }
}


/* ===== MOSTRAR LIVROS ===== */

function mostrarLivro() {

    const container = document.getElementById("lista-livros");

    if (!container) return;

    container.innerHTML = "";

    livros.forEach(livro => {

        container.innerHTML += `
        <div class="card-livro">

            <img 
                src="${livro.capa}" 
                alt="${livro.titulo}" 
                onclick="abrirLivro(${livro.id})"
                class="capa-livro"
            >

            <h3>${livro.titulo}</h3>

            <p><strong>Autor:</strong> ${livro.autor}</p>

        </div>
        `;

    });

}


function abrirLivro(idLivro) {
    const livro = livros.find(l => l.id === idLivro);
    if (!livro) return;

    // Preenche os dados na tela
    document.getElementById("livro-titulo").textContent = livro.titulo;
    document.getElementById("livro-capa").src = livro.capa;
    document.getElementById("livro-autor").textContent = livro.autor;
    document.getElementById("livro-prateleira").textContent = "Prateleira: " + livro.prateleira;
    document.getElementById("livro-unidades").textContent = "Unidades: " + livro.unidades;
    document.getElementById("livro-codigo").textContent = "Codigo: " + livro.codigo;
    document.getElementById("livro-status").textContent = livro.disponivel ? "Disponível" : "Emprestado";
    document.getElementById("livro-sinopse").innerText = livro.sinopse || "Sinopse não disponível.";

    // --- LOGICA DE MEMÓRIA ---
    const paginaAtual = localStorage.getItem("paginaAtual");
    // Só salva como anterior se a página atual NÃO for a do próprio livro (evita erro no Voltar)
    if (paginaAtual && paginaAtual !== "pag-livro") {
        localStorage.setItem("paginaAnterior", paginaAtual);
    }

    // SALVA O ID DO LIVRO para que ele não suma no F5
    localStorage.setItem("livroAbertoID", idLivro);

    mostrarPagina("pag-livro");
}

let totalAvaliacoes = 0
let somaAvaliacoes = 0

const estrelas = document.querySelectorAll("#estrelas-avaliacao .estrela")
const media = document.getElementById("media-avaliacao")

estrelas.forEach(estrela => {

    estrela.addEventListener("click", () => {

        let valor = parseInt(estrela.dataset.valor)

        somaAvaliacoes += valor
        totalAvaliacoes++

        let mediaFinal = (somaAvaliacoes / totalAvaliacoes).toFixed(1)

        media.textContent = mediaFinal + " / 5"

        estrelas.forEach(e => {
            e.classList.remove("ativa")

            if (e.dataset.valor <= valor) {
                e.classList.add("ativa")
            }
        })

    })

})

/* ===== INICIAR SISTEMA ===== */

console.log("mostrarLivros foi chamada");

mostrarLivro();
