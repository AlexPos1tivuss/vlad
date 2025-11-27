package com.targeteer.controller;

import com.targeteer.DTO.ManagerDTO;
import com.targeteer.DTO.WorkerDTO;
import com.targeteer.DTO.WorkerWithStatsDTO;
import com.targeteer.entity.Role;
import com.targeteer.entity.User;
import com.targeteer.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {
    private final UserService userService;

    @GetMapping("/workers")
    public ResponseEntity<List<WorkerDTO>> getAllUsers() {
        List<WorkerDTO> users = userService.getAllWorkersWithManager();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/workersWithManager")
    public ResponseEntity<List<WorkerWithStatsDTO>> getAllWithManager(HttpServletRequest request) {
        User manager = userService.findByHttpRequest(request);

        if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }


        List<WorkerWithStatsDTO> workers = manager.getSubordinates().stream()
                .map(userService::mapToWorkerDTO)
                .toList();

        return new ResponseEntity<>(workers, HttpStatus.OK);
    }


    @GetMapping("/all")
    public ResponseEntity<List<ManagerDTO>> getAllManagers() {

        return new ResponseEntity<>(userService.getAllManagers(), HttpStatus.OK);
    }

    @PutMapping("/changeManager/{id}")
    public ResponseEntity<?> changeManager(
            @PathVariable Long id,
            @RequestBody ChangeManagerRequest request
    ) {
        User manager = userService.findById(request.getManagerId());
        if (manager.getRole() != Role.MANAGER) {
            return new ResponseEntity<>("Selected user is not a manager", HttpStatus.BAD_REQUEST);
        }

        User user = userService.findById(id);

        user.setManager(manager);

        userService.save(user);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/updateSalary/{id}")
    public ResponseEntity<?> updateSalary(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        User user = userService.findById(id);
        user.setSalary(body.get("salary"));
        userService.save(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Data
    public static class ChangeManagerRequest {
        private Long managerId;
    }
}
