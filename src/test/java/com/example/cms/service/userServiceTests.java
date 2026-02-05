package com.example.cms.service;

import com.example.cms.entity.User;
import com.example.cms.repository.userRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class userServiceTests {

    @Mock
    private userRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private userService userService;

    @Test
    void changePassword() {
        String identifier = "test12345@gmail.com";
        when(userRepository.findByEmail(identifier)).thenReturn(java.util.Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                ()-> userService.changePassword(identifier, "old", "new"));
    }

    @Test
    void changePassword_success(){
        String email = "test11@gmail.com";
        User user = new User();
        user.setPassword("encodedOld");
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("old", "encodedOld")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("encodedNew");

        userService.changePassword(email, "old", "new");
        verify(userRepository).save(user);
        Assertions.assertEquals("encodedNew", user.getPassword());
    }

    @Test
    void changePassword_wrongOldPassword() {

        String email = "test@gmail.com";

        User user = new User();
        user.setPassword("encodedOld");

        when(userRepository.findByPhoneNumber(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encodedOld")).thenReturn(false);

        Assertions.assertThrows(RuntimeException.class,
                () -> userService.changePassword(email, "old", "new"));

        verify(userRepository, never()).save(any());

    }




}
