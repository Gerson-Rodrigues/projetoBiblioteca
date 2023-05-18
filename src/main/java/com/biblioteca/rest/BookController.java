package com.biblioteca.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.rest.database.RepositoryBook;
import com.biblioteca.rest.entidades.Book;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/book")
@AllArgsConstructor
public class BookController {

    private final RepositoryBook repositoryBook;

    @GetMapping
    public List<Book> listarLivros(){
        return repositoryBook.findAll();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Book book){
        repositoryBook.save(book);
        return ResponseEntity.ok().build();
    }

    /*public void alterar(@RequestBody Book book){
        if(book.getId()>0)
            repo.save(book);
    }*/
    @PutMapping("/{id}")
    public ResponseEntity<?> editarLivro(@PathVariable("id") Long id, @RequestBody Book livro) {
        Book livroExistente = repositoryBook.findById(id).orElse(null);

        if (livroExistente != null) {
            livroExistente.setTitulo(livro.getTitulo());
            livroExistente.setAutor(livro.getAutor());
            livroExistente.setAnoPublicacao(livro.getAnoPublicacao());

            repositoryBook.save(livroExistente);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /*public void excluir(@RequestBody Book book){
        repositoryBook.delete(book);
    }*/
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirLivro(@PathVariable("id") Long id) {
        Book livroExistente = repositoryBook.findById(id).orElse(null);

        if (livroExistente != null) {
            repositoryBook.delete(livroExistente);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
