package com.targeteer.service;

import com.targeteer.entity.Task;
import com.targeteer.entity.User;
import com.targeteer.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> findAllByAuthor(User author) {
        return taskRepository.findAllByAuthor(author);
    }

    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> findAllByAssignee(User user) {return taskRepository.findAllByAssignee(user);};
}
