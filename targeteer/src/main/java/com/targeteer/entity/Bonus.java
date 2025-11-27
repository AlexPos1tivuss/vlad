package com.targeteer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bonus")
public class Bonus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @Column(name = "calculation_period", nullable = false)
    private LocalDate calculationPeriod;

    @Column(name = "total_tasks_completed", nullable = false)
    private Integer totalTasksCompleted;

    @Column(name = "normal_priority_count", nullable = false)
    private Integer normalPriorityCount;

    @Column(name = "medium_priority_count", nullable = false)
    private Integer mediumPriorityCount;

    @Column(name = "critical_priority_count", nullable = false)
    private Integer criticalPriorityCount;

    @Column(name = "efficiency_rate")
    private Double efficiencyRate;

    @Column(name = "bonus_amount")
    private Double bonusAmount;

    @Column(name = "awarded_at")
    private LocalDateTime awardedAt;

    @PrePersist
    protected void onCreate() {
        awardedAt = LocalDateTime.now();
    }

}
