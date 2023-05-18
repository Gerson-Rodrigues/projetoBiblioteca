package com.biblioteca.rest.database;

import com.biblioteca.rest.entidades.Book;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositoryBook extends JpaRepository<Book , Long>{
    
}
