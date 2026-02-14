package com.example.cms.controller;

import com.example.cms.dto.ForgotPasswordRequest;
import com.example.cms.dto.LoginRequest;
import com.example.cms.dto.LoginResponse;
import com.example.cms.dto.ProfileChangePasswordRequest;
import com.example.cms.entity.BlacklistedToken;
import com.example.cms.entity.User;
import com.example.cms.repository.TokenBlacklistRepository;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.PasswordResetService;
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
    PasswordResetService passwordResetService;

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

        // ================= Logout =================
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

        // CHANGE PASSWORD from PROFILE
        // ================= Change Password =================
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

    // ================= Forget Password =================
    // FORGOT PASSWORD
    @PostMapping("/forgot-password/generate-otp")
    public ResponseEntity<String> generateOtp(@RequestParam String email) {
        passwordResetService.generateOtp(email);
        return ResponseEntity.ok("OTP sent to email. Check your mail shortly.");
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email,
                                       @RequestParam String otp) {
        passwordResetService.verifyOtp(email, otp);
        return ResponseEntity.ok("OTP verified");
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ForgotPasswordRequest req) {
        userService.resetPassword(req.getEmail(), req.getNewPassword());
        return ResponseEntity.ok("Password reset successful");
    }
}



