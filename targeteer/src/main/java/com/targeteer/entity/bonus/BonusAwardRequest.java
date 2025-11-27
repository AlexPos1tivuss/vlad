package com.targeteer.entity.bonus;

import lombok.Data;

@Data
public class BonusAwardRequest {
    private Long employeeId;
    private int normal;
    private int medium;
    private int critical;
    private int planValue;
    private double coef;
    private double efficiencyRate;
    private double bonusAmount;
}

