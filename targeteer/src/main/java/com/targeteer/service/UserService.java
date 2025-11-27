package com.targeteer.service;

import com.targeteer.DTO.ManagerDTO;
import com.targeteer.DTO.WorkerDTO;
import com.targeteer.DTO.WorkerWithStatsDTO;
import com.targeteer.config.JwtService;
import com.targeteer.entity.Role;
import com.targeteer.entity.Task;
import com.targeteer.entity.User;
import com.targeteer.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findUserByLoginOrName(String searchTerm, Role role) {
        return userRepository.findByLoginOrNameAndRole(searchTerm,role);
    }

    public User findById(long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return user;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    public void changeRoleById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if(user.getRole()==Role.USER){
            user.setRole(Role.MANAGER);
        } else if (user.getRole()==Role.MANAGER) {
            user.setRole(Role.USER);
        }
        userRepository.save(user);
    }

    public User findByHttpRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header is incorrect");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);

        User user = userRepository.findByLogin(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }

    public List<ManagerDTO> getAllManagers() {
        List<User> users = this.findAllByRole(Role.MANAGER);

        return users.stream().map(user -> {
            return ManagerDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();
        }).toList();
    }

    public List<WorkerDTO> getAllWorkersWithManager() {
        List<User> users = this.findAllByRole(Role.USER);

        LocalDate now = LocalDate.now();
        return users.stream().map(user -> {
            int tasksThisMonth = (int) user.getAssignedTasks().stream()
                    .filter(t -> t.isCompleted()
                            && t.getCompletedDate() != null
                            && t.getCompletedDate().getMonth() == now.getMonth()
                            && t.getCompletedDate().getYear() == now.getYear())
                    .count();

            return WorkerDTO.builder()
                    .id(user.getId())
                    .login(user.getLogin())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .position(user.getPosition())
                    .salary(user.getSalary())
                    .completedTasksThisMonth(tasksThisMonth)
                    .manager(user.getManager() != null ?
                            ManagerDTO.builder()
                                    .id(user.getManager().getId())
                                    .firstName(user.getManager().getFirstName())
                                    .lastName(user.getManager().getLastName())
                                    .build()
                            : null)
                    .build();
        }).toList();
    }

    public WorkerWithStatsDTO mapToWorkerDTO(User user) {
        WorkerWithStatsDTO dto = new WorkerWithStatsDTO();
        dto.setId(user.getId());
        dto.setLogin(user.getLogin());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPosition(user.getPosition());
        dto.setSalary(user.getSalary());

        // completed tasks all time
        dto.setCompletedTasksAllTime((int) user.getAssignedTasks().stream()
                .filter(task -> task.isCompleted())
                .count());

        // completed tasks this month — FIXED
        dto.setCompletedTasksThisMonth((int) user.getAssignedTasks().stream()
                .filter(task ->
                        task.isCompleted()
                                && task.getCompletedDate() != null
                                && task.getCompletedDate().getMonth() == LocalDate.now().getMonth()
                                && task.getCompletedDate().getYear() == LocalDate.now().getYear()
                )
                .count());

        dto.setBonusesCount(user.getBonusesReceived().size());

        return dto;
    }




    public List<User> findAllByRole(Role role) {
        return userRepository.findByRole(role);
    }

}
