package com.targeteer.controller;

import com.targeteer.DTO.TaskDTO;
import com.targeteer.entity.*;
import com.targeteer.entity.tasks.TaskRequest;
import com.targeteer.service.TaskService;
import com.targeteer.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest requestBody,
                                        HttpServletRequest request) {

        User author = userService.findByHttpRequest(request);
        User assignee = null;

        if (author.getRole() != Role.MANAGER && author.getRole() != Role.ADMIN) {
            return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
        }

        if (requestBody.getAssigneeId() != null) {
            assignee = userService.findById(requestBody.getAssigneeId());

            if (author.getRole() == Role.MANAGER &&
                    !author.getSubordinates().contains(assignee)) {
                return new ResponseEntity<>("Assignee must be subordinate of manager",
                        HttpStatus.BAD_REQUEST);
            }
        }

        Task task = Task.builder()
                .title(requestBody.getTitle())
                .description(requestBody.getDescription())
                .priority(TaskPriority.valueOf(requestBody.getPriority()))
                .author(author)
                .assignee(assignee)
                .startDate(requestBody.getStartDate())
                .dueDate(requestBody.getDueDate())
                .status(assignee == null ? TaskStatus.OPEN : TaskStatus.IN_PROGRESS)
                .build();

        Task saved = taskService.save(task);

        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(HttpServletRequest request) {
        User author = userService.findByHttpRequest(request);
        List<Task> tasks = taskService.findAllByAuthor(author);

        List<TaskDTO> dtos = tasks.stream().map(task -> {
            String assigneeName = "не назначен";
            Long assigneeId = null;
            if (task.getAssignee() != null) {
                assigneeName = task.getAssignee().getLastName() + " " +
                        task.getAssignee().getFirstName() +
                        " (" + task.getAssignee().getPosition() + ")";
                assigneeId = task.getAssignee().getId();
            }

            return TaskDTO.builder()
                    .id(task.getId())
                    .title(task.getTitle())
                    .description(task.getDescription())
                    .assigneeName(assigneeName)
                    .assigneeId(assigneeId)
                    .priority(task.getPriority())
                    .status(task.getStatus())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .completedDate(task.getCompletedDate())
                    .createdAt(task.getCreatedAt())
                    .updatedAt(task.getUpdatedAt())
                    .build();
        }).toList();

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @PutMapping("/changeAssignee/{id}")
    public ResponseEntity<?> changeAssignee(
            @PathVariable Long id,
            @RequestBody ChangeAssigneeRequest requestBody,
            HttpServletRequest request
    ) {
        User author = userService.findByHttpRequest(request);
        Task task = taskService.findById(id);

        if (!task.getAuthor().getId().equals(author.getId()) &&
                author.getRole() != Role.ADMIN) {
            return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
        }

        User newAssignee = null;
        if (requestBody.getAssigneeId() != null) {
            newAssignee = userService.findById(requestBody.getAssigneeId());

            if (author.getRole() == Role.MANAGER &&
                    !author.getSubordinates().contains(newAssignee)) {
                return new ResponseEntity<>("Assignee must be subordinate of manager",
                        HttpStatus.BAD_REQUEST);
            }
        }

        task.setAssignee(newAssignee);
        task.setStatus(newAssignee == null ? TaskStatus.OPEN : TaskStatus.IN_PROGRESS);
        taskService.save(task);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasksOfSubordinates(HttpServletRequest request) {
        User manager = userService.findByHttpRequest(request);

        if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<User> subs = manager.getSubordinates();
        if (subs == null || subs.isEmpty()) {
            return new ResponseEntity<>(List.of(), HttpStatus.OK);
        }

        List<Task> tasks = subs.stream()
                .flatMap(u -> taskService.findAllByAssignee(u).stream())
                .filter(Task::isCompleted)
                .toList();

        List<TaskDTO> dtos = tasks.stream().map(task -> {
            String assigneeName = task.getAssignee().getLastName() + " " +
                    task.getAssignee().getFirstName() + " (" + task.getAssignee().getPosition() + ")";

            return TaskDTO.builder()
                    .id(task.getId())
                    .title(task.getTitle())
                    .description(task.getDescription())
                    .assigneeName(assigneeName)
                    .assigneeId(task.getAssignee().getId())
                    .priority(task.getPriority())
                    .status(task.getStatus())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .completedDate(task.getCompletedDate())
                    .createdAt(task.getCreatedAt())
                    .updatedAt(task.getUpdatedAt())
                    .build();
        }).toList();

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Task task = taskService.findById(id);
        if(task == null) {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
        taskService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Data
    public static class ChangeAssigneeRequest {
        private Long assigneeId;
    }
}
