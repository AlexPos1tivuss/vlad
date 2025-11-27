package com.targeteer.DTO;

import com.targeteer.DTO.ManagerDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDTO {
    private Long id;
    private String login;
    private String firstName;
    private String lastName;
    private String position;
    private Double salary;
    private ManagerDTO manager; // менеджер
    private int completedTasksThisMonth; // количество задач за текущий месяц
}
