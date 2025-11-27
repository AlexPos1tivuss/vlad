package com.targeteer.DTO;

import com.targeteer.entity.Bonus;
import com.targeteer.entity.Task;
import lombok.Data;

import java.util.List;

@Data
public class WorkerWithStatsDTO {
    private Long id;
    private String login;
    private String firstName;
    private String lastName;
    private String position;
    private Double salary;

    // вычисляемое поле на бэке
    private int completedTasksThisMonth;
    private int completedTasksAllTime;
    private int bonusesCount;
}
