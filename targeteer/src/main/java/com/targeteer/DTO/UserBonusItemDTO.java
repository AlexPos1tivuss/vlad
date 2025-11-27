package com.targeteer.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class UserBonusItemDTO {
    private Long id;
    private String managerFullName;
    private Double employeeSalary;

    private String employeeFirstName;
    private String employeeLastName;

    private Integer totalTasksCompleted;
    private Integer normalPriorityCount;
    private Integer mediumPriorityCount;
    private Integer criticalPriorityCount;

    private Double efficiencyRate;
    private Double bonusAmount;

    private LocalDate calculationPeriod;
    private LocalDateTime awardedAt;
}
