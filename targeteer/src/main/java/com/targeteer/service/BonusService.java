package com.targeteer.service;

import com.targeteer.DTO.BonusInfoDTO;
import com.targeteer.DTO.UserBonusItemDTO;
import com.targeteer.DTO.UserBonusesFullDTO;
import com.targeteer.entity.Bonus;
import com.targeteer.entity.TaskPriority;
import com.targeteer.entity.User;
import com.targeteer.entity.bonus.BonusAwardRequest;
import com.targeteer.repository.BonusRepository;
import com.targeteer.repository.TaskRepository;
import com.targeteer.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BonusService {
    private final BonusRepository bonusRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;


    BonusService(BonusRepository bonusRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.bonusRepository = bonusRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public BonusInfoDTO getBonusInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Сотрудник не найден"));

        int normal = taskRepository.countCompletedByUserAndPriorityThisMonth(userId, TaskPriority.EASY);
        int medium = taskRepository.countCompletedByUserAndPriorityThisMonth(userId, TaskPriority.MEDIUM);
        int critical = taskRepository.countCompletedByUserAndPriorityThisMonth(userId, TaskPriority.CRITICAL);

        Bonus last = bonusRepository.findTopByEmployeeIdOrderByAwardedAtDesc(userId);

        return BonusInfoDTO.builder()
                .userId(user.getId())
                .fullName(user.getLastName() + " " + user.getFirstName())
                .position(user.getPosition())
                .salary(user.getSalary())
                .normal(normal)
                .medium(medium)
                .critical(critical)
                .lastAwardDate(last != null ? last.getAwardedAt() : null)
                .lastAwardPeriod(last != null ? last.getCalculationPeriod() : null)
                .lastPlanValue(last != null ? last.getTotalTasksCompleted() : null)
                .build();
    }

    @Transactional
    public void awardBonus(BonusAwardRequest req, User manager) {

        User employee = userRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Сотрудник не найден"));

        Bonus bonus = Bonus.builder()
                .employee(employee)
                .manager(manager)
                .calculationPeriod(LocalDate.now().withDayOfMonth(1))
                .normalPriorityCount(req.getNormal())
                .mediumPriorityCount(req.getMedium())
                .criticalPriorityCount(req.getCritical())
                .totalTasksCompleted(req.getNormal() + req.getMedium() + req.getCritical())
                .efficiencyRate(req.getEfficiencyRate())
                .bonusAmount(req.getBonusAmount())
                .build();

        bonusRepository.save(bonus);
    }

    public UserBonusesFullDTO getAllBonusesForUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Сотрудник не найден"));

        List<Bonus> bonuses = bonusRepository.findAllByEmployeeIdOrderByAwardedAtDesc(userId);

        List<UserBonusItemDTO> bonusList = bonuses.stream().map(b ->
                UserBonusItemDTO.builder()
                        .id(b.getId())
                        .managerFullName(b.getManager().getLastName() + " " + b.getManager().getFirstName())
                        .employeeSalary(user.getSalary())
                        .totalTasksCompleted(b.getTotalTasksCompleted())
                        .normalPriorityCount(b.getNormalPriorityCount())
                        .mediumPriorityCount(b.getMediumPriorityCount())
                        .criticalPriorityCount(b.getCriticalPriorityCount())
                        .efficiencyRate(b.getEfficiencyRate())
                        .bonusAmount(b.getBonusAmount())
                        .calculationPeriod(b.getCalculationPeriod())
                        .awardedAt(b.getAwardedAt())
                        .build()
        ).toList();

        return UserBonusesFullDTO.builder()
                .userId(user.getId())
                .fullName(user.getLastName() + " " + user.getFirstName())
                .position(user.getPosition())
                .bonuses(bonusList)
                .build();
    }

    public UserBonusesFullDTO getAllBonusesGivenByManager(Long managerId) {

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        List<Bonus> bonuses = bonusRepository.findAllByManagerIdOrderByAwardedAtDesc(managerId);

        List<UserBonusItemDTO> bonusList = bonuses.stream().map(b ->
                UserBonusItemDTO.builder()
                        .id(b.getId())
                        .managerFullName(manager.getLastName() + " " + manager.getFirstName())
                        .employeeFirstName(b.getEmployee().getFirstName())
                        .employeeLastName(b.getEmployee().getLastName())
                        .employeeSalary(b.getEmployee().getSalary())
                        .totalTasksCompleted(b.getTotalTasksCompleted())
                        .normalPriorityCount(b.getNormalPriorityCount())
                        .mediumPriorityCount(b.getMediumPriorityCount())
                        .criticalPriorityCount(b.getCriticalPriorityCount())
                        .efficiencyRate(b.getEfficiencyRate())
                        .bonusAmount(b.getBonusAmount())
                        .calculationPeriod(b.getCalculationPeriod())
                        .awardedAt(b.getAwardedAt())
                        .build()
        ).toList();

        return UserBonusesFullDTO.builder()
                .userId(manager.getId())
                .fullName(manager.getLastName() + " " + manager.getFirstName())
                .position(manager.getPosition())
                .bonuses(bonusList)
                .build();
    }


}
