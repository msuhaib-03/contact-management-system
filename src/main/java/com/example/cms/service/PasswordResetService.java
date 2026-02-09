package com.example.cms.service;

import com.example.cms.entity.PasswordResetToken;
import com.example.cms.entity.User;
import com.example.cms.repository.PasswordResetTokenRepository;
import com.example.cms.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordResetService {
    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    userRepository userRepository;

    @Autowired
    EmailService emailService;

    public void generateOtp(String email) {

        userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordResetToken token = passwordResetTokenRepository
                .findByEmail(email)
                .orElse(new PasswordResetToken());

        token.setEmail(email);
        token.setOtp(otp);
        token.setVerified(false);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        passwordResetTokenRepository.save(token);

        emailService.sendOtp(email, otp);
    }

    public void verifyOtp(String email, String otp) {

        PasswordResetToken token = passwordResetTokenRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("OTP not generated"));

        if (token.getExpiryTime().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");

        if (!token.getOtp().equals(otp))
            throw new RuntimeException("Invalid OTP");

        token.setVerified(true);
        passwordResetTokenRepository.save(token);
    }



}
