package com.targeteer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    SecurityConfiguration(final JwtAuthenticationFilter jwtAuthFilter, final AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**")
                        .permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/bonus/**").hasAnyRole("MANAGER", "USER")
                        .requestMatchers("/api/manager/**").hasAnyRole("MANAGER")
                        .requestMatchers("/api/manager/files/**").hasAnyRole("MANAGER","ADMIN")
                        .requestMatchers("/api/bid/**").hasAnyRole("MANAGER","ADMIN")
                        .requestMatchers("/api/user/**").permitAll()
                        .requestMatchers("/api/user/all").hasRole("ADMIN")
                        .requestMatchers("/api/user/tasks/**").hasRole("USER")
                        .requestMatchers("/api/task/**").hasRole("MANAGER")
                        .requestMatchers("/api/user/role/**").hasRole("ADMIN")
                        .requestMatchers("/uploads/schemas/**").permitAll()
                        .anyRequest()
                        .authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
