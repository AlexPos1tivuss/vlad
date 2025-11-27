package com.targeteer.controller;


import com.targeteer.DTO.BonusInfoDTO;
import com.targeteer.DTO.UserBonusesFullDTO;
import com.targeteer.entity.User;
import com.targeteer.entity.bonus.BonusAwardRequest;
import com.targeteer.service.BonusService;
import com.targeteer.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bonus")
@RequiredArgsConstructor
public class BonusesController {
    private final BonusService bonusService;
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<BonusInfoDTO> getBonusInfo(
            @PathVariable Long userId
    ) {
        BonusInfoDTO dto = bonusService.getBonusInfo(userId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{userId}/all")
    public ResponseEntity<UserBonusesFullDTO> getAllUserBonuses(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(bonusService.getAllBonusesForUser(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<UserBonusesFullDTO> getAllMyBonuses(
            HttpServletRequest http
    ) {
        User user = userService.findByHttpRequest(http);
        return ResponseEntity.ok(bonusService.getAllBonusesForUser(user.getId()));
    }

    @GetMapping("/given")
    public ResponseEntity<UserBonusesFullDTO> getBonusesIGave(HttpServletRequest http) {
        User manager = userService.findByHttpRequest(http);
        return ResponseEntity.ok(bonusService.getAllBonusesGivenByManager(manager.getId()));
    }



    @PostMapping("/award")
    public ResponseEntity<?> awardBonus(
            @RequestBody BonusAwardRequest request,
            HttpServletRequest http
    ) {
        User manager = userService.findByHttpRequest(http);
        bonusService.awardBonus(request, manager);
        return ResponseEntity.ok("Премия успешно назначена!");
    }

}
