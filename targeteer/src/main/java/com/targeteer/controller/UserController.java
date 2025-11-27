package com.targeteer.controller;


import com.targeteer.DTO.UserPanelDTO;
import com.targeteer.config.JwtService;
import com.targeteer.entity.Role;
import com.targeteer.entity.TaskPriority;
import com.targeteer.entity.User;
import com.targeteer.entity.auth.AuthenticationRequest;
import com.targeteer.entity.auth.AuthenticationResponse;
import com.targeteer.entity.auth.RegisterRequest;
import com.targeteer.entity.auth.SettingsRequest;
import com.targeteer.entity.settings.SettingsResponse;
import com.targeteer.repository.UserRepository;
import com.targeteer.service.AuthenticationService;
import com.targeteer.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<SettingsResponse> getUser(HttpServletRequest request) {
        try{
            User user = userService.findByHttpRequest(request);

            int totalCompleted = user.getAssignedTasks() == null ? 0 :
                    (int) user.getAssignedTasks().stream().filter(t -> t.isCompleted()).count();

            int easy = user.getAssignedTasks() == null ? 0 :
                    (int) user.getAssignedTasks().stream().filter(t -> t.isCompleted() && t.getPriority() == TaskPriority.EASY).count();

            int medium = user.getAssignedTasks() == null ? 0 :
                    (int) user.getAssignedTasks().stream().filter(t -> t.isCompleted() && t.getPriority() == TaskPriority.MEDIUM).count();

            int critical = user.getAssignedTasks() == null ? 0 :
                    (int) user.getAssignedTasks().stream().filter(t -> t.isCompleted() && t.getPriority() == TaskPriority.CRITICAL).count();

            SettingsResponse response = SettingsResponse.builder()
                    .id(user.getId())
                    .login(user.getLogin())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .position(user.getPosition())
                    .salary(user.getSalary() == null ? 0.0 : user.getSalary())
                    .managerFullName(
                            user.getRole() == Role.USER
                                    ? (user.getManager() != null
                                    ? user.getManager().getLastName() + " " +user.getManager().getFirstName()
                                    : "Не назначен")
                                    : null
                    )
                    .totalCompletedTasks(totalCompleted)
                    .totalBonusesReceived(user.getBonusesReceived() != null ? user.getBonusesReceived().size() : 0)
                    .completedEasy(easy)
                    .completedMedium(medium)
                    .completedCritical(critical)
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody SettingsRequest request) {
        try{
            User user = userService.findById(id);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPosition(request.getPosition());

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));

                AuthenticationRequest authReq = new AuthenticationRequest(user.getLogin(), request.getPassword());
                AuthenticationResponse authRes = authenticationService.authenticate(authReq);
                userService.save(user);

                return ResponseEntity.ok(authRes);
            }

            userService.save(user);
            return ResponseEntity.ok("updated");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Update failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserPanelDTO>> getAllUsers() {
        List<User> users = userService.findAll();

        List<UserPanelDTO> dtos = users.stream()
                .filter(u -> u.getRole() != Role.ADMIN) // исключаем админов
                .map(u -> UserPanelDTO.builder()
                        .id(u.getId())
                        .login(u.getLogin())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .position(u.getPosition())
                        .role(u.getRole())
                        .manager(u.getManager() == null ? null :
                                UserPanelDTO.ManagerDTO.builder()
                                        .id(u.getManager().getId())
                                        .firstName(u.getManager().getFirstName())
                                        .lastName(u.getManager().getLastName())
                                        .build())
                        .build())
                .toList();

        return ResponseEntity.ok(dtos);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/role/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id) {
        System.out.println("MEOW");
        userService.changeRoleById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
