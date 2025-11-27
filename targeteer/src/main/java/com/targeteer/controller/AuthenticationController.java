package com.targeteer.controller;


import com.targeteer.entity.auth.AuthenticationRequest;
import com.targeteer.entity.auth.AuthenticationResponse;
import com.targeteer.entity.auth.RegisterRequest;
import com.targeteer.repository.UserRepository;
import com.targeteer.service.AuthenticationService;
import com.targeteer.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthenticationController(AuthenticationService authenticationService, PasswordEncoder passwordEncoder, UserRepository userRepository, UserService userService) {
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }


}
