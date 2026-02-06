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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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


    // ================= CHANGE PASSWORD =================
    @Test
    void changePassword() {
        String identifier = "test12345@gmail.com";
        when(userRepository.findByEmail(identifier)).thenReturn(java.util.Optional.empty());

        assertThrows(RuntimeException.class,
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
        assertEquals("encodedNew", user.getPassword());
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

// ================= REGISTER =================

    @Test
    void registerUser_success() throws Exception {

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPhoneNumber("03123456789");
        user.setPassword("plain");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("03123456789")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User saved = userService.registerUser(user);

        assertEquals("encoded", saved.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    void registerUser_emailAlreadyExists() {
        User user = new User();
        user.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(new User()));

        assertThrows(Exception.class, () -> userService.registerUser(user));
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerUser_phoneAlreadyExists() {
        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPhoneNumber("03123456789");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneNumber("03123456789"))
                .thenReturn(Optional.of(new User()));

        assertThrows(Exception.class, () -> userService.registerUser(user));
    }

}
