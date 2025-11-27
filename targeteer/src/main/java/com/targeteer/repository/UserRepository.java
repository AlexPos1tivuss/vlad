package com.targeteer.repository;

import com.targeteer.entity.Role;
import com.targeteer.entity.Task;
import com.targeteer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);

    List<User> findByRole(Role role);

    Optional<User> findById(Long id);

    @Query("SELECT u FROM User u WHERE " +
            "(u.login LIKE %:searchTerm% OR " +
            "u.firstName LIKE %:searchTerm% OR " +
            "u.lastName LIKE %:searchTerm% OR " +
            "CONCAT(u.firstName, ' ', u.lastName) LIKE %:searchTerm% OR " +
            "CONCAT(u.lastName, ' ', u.firstName) LIKE %:searchTerm%) " +
            "AND u.role = :role")
    List<User> findByLoginOrNameAndRole(@Param("searchTerm") String searchTerm,
                                        @Param("role") Role role);

}
