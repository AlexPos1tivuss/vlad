package com.targeteer.repository;

import com.targeteer.entity.Bonus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BonusRepository extends JpaRepository<Bonus, Long> {
    Bonus findTopByEmployeeIdOrderByAwardedAtDesc(Long employeeId);

    List<Bonus> findAllByManagerIdOrderByAwardedAtDesc(Long managerId);

    List<Bonus> findAllByEmployeeIdOrderByAwardedAtDesc(Long userId);
}
