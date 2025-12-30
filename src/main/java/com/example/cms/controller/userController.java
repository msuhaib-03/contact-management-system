package com.example.cms.controller;

import com.example.cms.dto.LoginRequest;
import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.User;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.userService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class userController {

    private final userService userService;
    private final JwtUtil jwtUtil;

    public userController(userService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = new JwtUtil();
    }

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


}
