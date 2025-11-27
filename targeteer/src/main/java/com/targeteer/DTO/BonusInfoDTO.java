package com.targeteer.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BonusInfoDTO {
    private Long userId;
    private String fullName;
    private String position;
    private Double salary;

    private int normal;
    private int medium;
    private int critical;

    private LocalDate lastAwardPeriod;
    private LocalDateTime lastAwardDate;

    private Integer lastPlanValue;
}

