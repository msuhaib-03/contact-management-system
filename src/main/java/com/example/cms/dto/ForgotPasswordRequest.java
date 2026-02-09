package com.example.cms.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String identifier; // email or phone
    private String newPassword;
    private String email;
}
