package com.targeteer.controller;

import com.targeteer.DTO.TaskDTO;
import com.targeteer.entity.Task;
import com.targeteer.entity.TaskStatus;
import com.targeteer.entity.User;
import com.targeteer.service.TaskService;
import com.targeteer.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/tasks")
@RequiredArgsConstructor
public class TasksForUserController {
    private final TaskService taskService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getOpenTasksForUser(HttpServletRequest request) {
        User user = userService.findByHttpRequest(request);

        if (user.getManager() == null) {
            return new ResponseEntity<>(List.of(), HttpStatus.OK);
        }

        List<Task> tasks = taskService.findAllByAuthor(user.getManager()).stream()
                .filter(task -> task.getStatus() == TaskStatus.OPEN)
                .toList();

        List<TaskDTO> dtos = tasks.stream().map(task -> {
            String assigneeName = "Не назначен";
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

    @GetMapping("/user")
    public ResponseEntity<List<TaskDTO>> getTaskForUser(HttpServletRequest request) {
        User user = userService.findByHttpRequest(request);

        List<Task> tasks = taskService.findAllByAssignee(user).stream()
                .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                .toList();

        List<TaskDTO> dtos = tasks.stream().map(task -> {
            String assigneeName = task.getAssignee().getLastName() +" "+ task.getAssignee().getFirstName()
                    + " (" + task.getAssignee().getPosition() + ")";

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

    @PutMapping("/{taskId}")
    public ResponseEntity<?> assignTaskToCurrentUser(
            @PathVariable Long taskId,
            HttpServletRequest request
    ) {
        User user = userService.findByHttpRequest(request);

        Task task = taskService.findById(taskId);
        if (task == null) {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }

        if (task.getStatus() != TaskStatus.OPEN) {
            return new ResponseEntity<>("Task is not open", HttpStatus.BAD_REQUEST);
        }

        if (!task.getAuthor().getId().equals(user.getManager().getId())) {
            return new ResponseEntity<>("Task is not published by your manager", HttpStatus.FORBIDDEN);
        }


        task.setAssignee(user);
        task.setStatus(TaskStatus.IN_PROGRESS);
        taskService.save(task);

        return new ResponseEntity<>("Task assigned successfully", HttpStatus.OK);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> completeTaskFromUser(@PathVariable Long id, HttpServletRequest request) {
        Task task = taskService.findById(id);

        if (task == null) {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }

        task.markAsCompleted();
        taskService.save(task);
        return new ResponseEntity<>("Task completed successfully", HttpStatus.OK);
    }
}
