const formLivro = document.querySelector("#formLivro");
const formEditarLivro = document.querySelector("#formEditarLivro");

const modalCadastrarLivro = document.querySelector("#modal-cadastrar-livro");
const modalEditarLivro = document.querySelector("#modal-editar-livro");

document.getElementById("btn-cadastrar-livro").addEventListener("click", function () {
    formLivro.reset();
    modalCadastrarLivro.style.display = "block";
  });

document.getElementById("btn-editar-livro").addEventListener("click", function () {
    const id = formEditarLivro.livroId.value;
    abrirModalEditarLivro(id);
  });

formLivro.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão de submit do formulário

  const titulo = formLivro.titulo.value;
  const autor = formLivro.autor.value;
  const anoPublicacao = formLivro.anoPublicacao.value;

  cadastrarLivro(titulo, autor, anoPublicacao);
});

formEditarLivro.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão de submit do formulário

  const id = formEditarLivro.livroId.value;
  const titulo = formEditarLivro.livroTitulo.value;
  const autor = formEditarLivro.livroAutor.value;
  const anoPublicacao = formEditarLivro.livroAnoPublicacao.value;

  editarLivro(id, titulo, autor, anoPublicacao);
});

function listarLivros() {
  fetch("/api/book")
    .then((response) => response.json())
    .then((livros) => {
      let tbody = document.querySelector("#livros-body");

      livros.forEach((livro) => {
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", livro.id);

        for (let j = 1; j < 4; j++) {
          const td = document.createElement("td");
          const texto = document.createTextNode(livro[j]);
          td.appendChild(texto);
          tr.appendChild(td);
        
          /*td.addEventListener("click", function () {
            marcarLivro(livro.id);
          });*/
        }
        
        tr.addEventListener("click", function () {
          marcarLivro(livro.id);
        });        
        tr.innerHTML = `
                    <td class="col-md-1" style="display: none;">${livro.id}</td>
                    <td class="col-md-6">${livro.titulo}</td>
                    <td class="col-md-3">${livro.autor}</td>
                    <td class="col-md-1">${livro.anoPublicacao}</td>
                    <td class="col-md-1">
                    <input type="radio" class="livro-radio" name="livro-radio" data-id="${livro.id}" data-titulo="${livro.titulo}" data-autor="${livro.autor}" data-ano="${livro.anoPublicacao}" style="display: none;">
                    </td>
                `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error(error);
      alert("Não foi possível carregar a lista de livros.");
    });
    const radios = document.querySelectorAll(".livro-radio");

    radios.forEach((radio) => {
      radio.addEventListener("click", function () {
        const livroId = radio.getAttribute("data-id");
        marcarLivro(livroId);
      });
    });
  }

const btnEditarLivro = document.getElementById("btn-editar-livro");
const btnExcluirLivro = document.getElementById("btn-excluir-livro");

function cadastrarLivro(titulo, autor, anoPublicacao) {
  const url = "http://localhost:8080/api/book";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titulo, autor, anoPublicacao }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Livro cadastrado com sucesso!");
        formLivro.reset();
        modalCadastrarLivro.style.display = "none";
        listarLivros();
        location.reload();
      } else {
        alert("Ocorreu um erro ao cadastrar o livro.");
        formLivro.reset();
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro ao cadastrar o livro:", error);
      alert("Ocorreu um erro ao cadastrar o livro.");
    });
}

function abrirModalEditarLivro() {
  const livroSelecionado = document.querySelector(".livro-radio:checked");

  if (livroSelecionado) {
    const livroId = livroSelecionado.getAttribute("data-id");
    const livroTitulo = livroSelecionado.getAttribute("data-titulo");
    const livroAutor = livroSelecionado.getAttribute("data-autor");
    const livroAno = livroSelecionado.getAttribute("data-ano");

    const livroIdInput = formEditarLivro.querySelector("#livroId");
    const livroTituloInput = formEditarLivro.querySelector("#livroTitulo");
    const livroAutorInput = formEditarLivro.querySelector("#livroAutor");
    const livroAnoInput = formEditarLivro.querySelector("#livroAnoPublicacao");

    livroIdInput.value = livroId;
    livroTituloInput.value = livroTitulo;
    livroAutorInput.value = livroAutor;
    livroAnoInput.value = livroAno;

    modalEditarLivro.style.display = "block";
  } else {
    alert("Selecione um livro para editar.");
  }
}

function abrirFormularioEdicao() {
  const radioSelecionado = document.querySelector(".livro-radio:checked");

  if (radioSelecionado) {
    const livroId = checkboxSelecionado.getAttribute("data-id");
    abrirModalEditarLivro(livroId);
  } else {
    alert("Selecione um livro para editar.");
  }
}

function editarLivro(id, titulo, autor, anoPublicacao) {
  const url = `/api/book/${id}`;

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titulo, autor, anoPublicacao }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Livro atualizado com sucesso!");
        formEditarLivro.reset();
        modalEditarLivro.style.display = "none";
        listarLivros();
        location.reload();
      } else {
        alert("Ocorreu um erro ao atualizar o livro.");
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro ao atualizar o livro:", error);
      alert("Ocorreu um erro ao atualizar o livro.");
    });
}

function excluirLivro() {
  const livroSelecionado = document.querySelector(".livro-radio:checked");

  if (livroSelecionado) {
    const livroId = livroSelecionado.getAttribute("data-id");
    const livroTitulo = livroSelecionado.dataset.titulo;
    const confirmacao = confirm(
      `Tem certeza que deseja excluir "${livroTitulo}"?`
    );

    if (confirmacao) {
      const url = `/api/book/${livroId}`;

      fetch(url, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Livro excluído com sucesso!");
            location.reload();
          } else {
            alert("Ocorreu um erro ao excluir o livro.");
          }
        })
        .catch((error) => {
          console.error("Ocorreu um erro ao excluir o livro:", error);
          alert("Ocorreu um erro ao excluir o livro.");
        });
    }
  } else {
    alert("Selecione um livro para excluir.");
  }
}

function fecharFormulario() {
  const formularioLivro = document.querySelector("#formLivro");
  formularioLivro.reset(); 
  modalCadastrarLivro.style.display = "none"; 
}

function fecharEditar() {
  const formularioEditar = document.querySelector("#formEditarLivro");
  formularioEditar.reset();
  modalEditarLivro.style.display = "none"; 
}

function marcarLivro(event) {
  const checkbox = event.target.querySelector('.livro-checkbox');
  if (checkbox) {
    checkbox.checked = true;
    exibirOpcoesLivro(checkbox.value); // Chame a função que exibe as opções de edição/exclusão passando o valor do checkbox
  }
}

function marcarLivro(id) {
  const livroSelecionado = document.querySelector(`tr[data-id="${id}"]`);
  const radio = livroSelecionado.querySelector(".livro-radio");
  const isChecked = livroSelecionado.classList.contains("livro-selecionado");

  if (isChecked) {
    livroSelecionado.classList.remove("livro-selecionado");
    radio.checked = false;
  } else {
    const trs = document.querySelectorAll("tr[data-id]");

    trs.forEach((tr) => {
      tr.classList.remove("livro-selecionado");
    });

    livroSelecionado.classList.add("livro-selecionado");
    radio.checked = true;
  }
}

function exibirBotao(elemento) {
  elemento.style.display = "block";
}

function ocultarBotao(elemento) {
  elemento.style.display = "none";
}