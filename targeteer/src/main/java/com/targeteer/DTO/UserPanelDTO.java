package com.targeteer.DTO;

import com.targeteer.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserPanelDTO {
    private Long id;
    private String login;
    private String firstName;
    private String lastName;
    private String position;
    private Role role;
    private ManagerDTO manager;

    @Data
    @Builder
    public static class ManagerDTO {
        private Long id;
        private String firstName;
        private String lastName;
    }
}
