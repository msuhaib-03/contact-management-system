package com.example.cms.service;

import com.example.cms.entity.User;
import com.example.cms.repository.userRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class userService {
    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public userService(userRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
       // this.passwordEncoder = new BCryptPasswordEncoder();
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) throws Exception {
        if (user.getEmail() != null && userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already in use");
        }
        if (user.getPhoneNumber() != null && userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
            throw new Exception("Phone number already in use");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmailOrPhone(String identifier) {
        Optional<User> user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier);
        } else {
            user = userRepository.findByPhoneNumber(identifier);
        }
        return user;
    }

    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // PROFILE PASSWORD CHANGE
    public void changePassword(String identifier, String oldPassword, String newPassword) throws RuntimeException {
        User user = findByEmailOrPhone(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // FORGOT PASSWORD
    public void resetPassword(String identifier, String newPassword) {
        User user = findByEmailOrPhone(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


}
