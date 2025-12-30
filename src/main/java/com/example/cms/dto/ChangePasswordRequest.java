package com.example.cms.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String identifier; // email or phone
    private String oldPassword;
    private String newPassword;
}
