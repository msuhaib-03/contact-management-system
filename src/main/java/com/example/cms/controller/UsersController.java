package com.example.cms.controller;

import com.example.cms.dto.ForgotPasswordRequest;
import com.example.cms.dto.LoginRequest;
import com.example.cms.dto.LoginResponse;
import com.example.cms.dto.ProfileChangePasswordRequest;
import com.example.cms.entity.BlacklistedToken;
import com.example.cms.entity.User;
import com.example.cms.repository.TokenBlacklistRepository;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UsersController {

        @Autowired
        private TokenBlacklistRepository tokenBlacklistRepository;

        @Autowired
        userService userService;

        @Autowired
        JwtUtil jwtUtil;

        // ================= Registration =================
        @PostMapping("/register")
        public ResponseEntity<?> registerUser(@RequestBody User user) {
            try {
                User savedUser = userService.registerUser(user);
                return ResponseEntity.ok(savedUser);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        // ================= Login =================
        @PostMapping("/login")
        public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
            try {
                User user = userService.findByEmailOrPhone(request.getIdentifier())
                        .orElseThrow(() -> new Exception("User not found"));

                // Verify password
                if (!userService.matchesPassword(request.getPassword(), user.getPassword())) {
                    return ResponseEntity.badRequest().body("Invalid credentials");
                }

                // Generate JWT
                String token = jwtUtil.generateToken(
                        user.getEmail() != null ? user.getEmail() : user.getPhoneNumber()
                );

                return ResponseEntity.ok(new LoginResponse(token));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        // ================= Change Password =================
        // logout
        @PostMapping("/logout")
        public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {

            if(authHeader == null || !authHeader.startsWith("Bearer "))
            {
                return ResponseEntity.badRequest().body("Invalid Authorization Header");
            }
            String token = authHeader.substring(7);
            LocalDateTime expiry = jwtUtil.extractExpiration(token)
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            BlacklistedToken blacklisted = new BlacklistedToken();
            blacklisted.setToken(token);
            blacklisted.setExpiresAt(expiry);

            tokenBlacklistRepository.save(blacklisted);

            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        }

        // FORGOT PASSWORD
        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
            userService.resetPassword(
                    request.getIdentifier(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok("Password updated successfully");
        }

        // CHANGE PASSWORD from PROFILE
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ProfileChangePasswordRequest request,
            Authentication authentication
    ) {
        userService.changePassword(
                authentication.getName(),   // comes from JWT
                request.getOldPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Password updated successfully");
    }

}



