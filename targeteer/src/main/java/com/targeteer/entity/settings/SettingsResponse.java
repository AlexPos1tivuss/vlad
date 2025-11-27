package com.targeteer.entity.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SettingsResponse {

    // Основная информация
    private Long id;
    private String login;
    private String email;
    private String firstName;
    private String lastName;
    private String position;
    private Double salary; // Если null — фронт показывает "0"

    private String managerFullName; // Если null → "Не назначен"

    private Integer totalCompletedTasks;       // Всего выполненных
    private Integer totalBonusesReceived;      // Всего премий

    private Integer completedEasy;             // Лёгкие задачи
    private Integer completedMedium;           // Средние
    private Integer completedCritical;         // Критические
}
