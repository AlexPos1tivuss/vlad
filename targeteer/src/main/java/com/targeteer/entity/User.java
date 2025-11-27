package com.targeteer.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Login required")
    @Column(unique = true, nullable = false, length = 20)
    private String login;

    @NotBlank(message = "Password required")
    @Column(nullable = false, length = 60)
    private String password;

    @NotBlank(message = "First name required")
    @Column(nullable = false, length = 20)
    private String firstName;

    @NotBlank(message = "Last name required")
    @Column(nullable = false, length = 20)
    private String lastName;

    @NotBlank(message = "Email required")
    @Column(unique = true, nullable = false, length = 30)
    private String email;

    @NotBlank(message = "Position required")
    @Column(nullable = false, length = 40)
    private String position;

    @Column(nullable = true)
    private Double salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    @JsonBackReference
    private User manager;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<User> subordinates;

    @OneToMany(mappedBy = "assignee", fetch = FetchType.LAZY)
    private List<Task> assignedTasks;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<Bonus> bonusesReceived;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
    private List<Bonus> bonusesAwarded;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
