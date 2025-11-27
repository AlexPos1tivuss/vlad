package com.targeteer.DTO;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserBonusesFullDTO {
    private Long userId;
    private String fullName;
    private String position;

    private List<UserBonusItemDTO> bonuses;
}
