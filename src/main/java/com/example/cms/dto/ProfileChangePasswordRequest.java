package com.example.cms.dto;

import lombok.Data;

@Data
public class ProfileChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
