package com.todo.service;

import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public Todo save(Todo todo) {
        return this.todoRepository.save(todo);
    }

    public Todo update(Todo todo, long id){
        todo.setId(id);
        return this.todoRepository.save(todo);
    }
    public void remove(long id){
        this.todoRepository.deleteById(id);
    }
    public List<Todo> findAll(){
        return this.todoRepository.findAll();
    }
    public Todo findById(long id){
        return this.todoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Todo not found with this ID."));
    }
}
