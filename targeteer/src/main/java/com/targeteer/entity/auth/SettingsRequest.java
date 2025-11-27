package com.targeteer.entity.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SettingsRequest {
    private String firstName;
    private String lastName;
    private String position;
    private String password;
}
