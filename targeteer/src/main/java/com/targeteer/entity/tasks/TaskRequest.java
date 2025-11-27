package com.targeteer.entity.tasks;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    private String title;
    private String description;
    private String priority;   // EASY, MEDIUM, CRITICAL
    private LocalDate startDate;
    private LocalDate dueDate;
    private Long assigneeId;
}
