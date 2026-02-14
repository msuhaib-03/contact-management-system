package com.example.cms.controller;

import com.example.cms.dto.ForgotPasswordRequest;
import com.example.cms.dto.LoginRequest;
import com.example.cms.entity.User;
import com.example.cms.repository.TokenBlacklistRepository;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.PasswordResetService;
import com.example.cms.service.userService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class userServiceControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private userService userService;
    private JwtUtil jwtUtil;
    private PasswordResetService passwordResetService;
    private TokenBlacklistRepository tokenBlacklistRepository;

    @BeforeEach
    void setup() {

        // mocks
        userService = Mockito.mock(userService.class);
        passwordResetService = Mockito.mock(PasswordResetService.class);
        jwtUtil = Mockito.mock(JwtUtil.class);
        tokenBlacklistRepository = Mockito.mock(TokenBlacklistRepository.class);
        objectMapper = new ObjectMapper();

        // controller
        UsersController controller = new UsersController();
        controller.userService = userService;
        controller.passwordResetService = passwordResetService;
        controller.jwtUtil = jwtUtil;
        controller.tokenBlacklistRepository = tokenBlacklistRepository;

        // standalone setup
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    private UsernamePasswordAuthenticationToken auth() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    // ================= REGISTER =================
    @Test
    void testRegisterUser() throws Exception {
        User user = new User();
        when(userService.registerUser(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.valueOf("application/json"))
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk());
    }

    // ================= LOGIN =================
    @Test
    void testLoginUser() throws Exception {
        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("encodedPass");

        LoginRequest req = new LoginRequest();
        req.setIdentifier("test@gmail.com");
        req.setPassword("123");

        when(userService.findByEmailOrPhone("test@gmail.com")).thenReturn(Optional.of(user));
        when(userService.matchesPassword(any(), any())).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("fake-jwt");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    // ================= CHANGE PASSWORD =================
    @Test
    void testChangePassword() throws Exception {
        String json = """
                {
                  "oldPassword":"123",
                  "newPassword":"456"
                }
                """;

        Mockito.doNothing().when(userService)
                .changePassword(any(), any(), any());

        mockMvc.perform(post("/auth/change-password")
                        .principal(auth())
                        .contentType("application/json")
                        .content(json))
                .andExpect(status().isOk());
    }

    // ================= GENERATE OTP =================
    @Test
    void testGenerateOtp() throws Exception {

        Mockito.doNothing().when(passwordResetService)
                .generateOtp("test@gmail.com");

        mockMvc.perform(post("/auth/forgot-password/generate-otp")
                        .param("email", "test@gmail.com"))
                .andExpect(status().isOk());
    }

    // ================= VERIFY OTP =================
    @Test
    void testVerifyOtp() throws Exception {

        Mockito.doNothing().when(passwordResetService)
                .verifyOtp("test@gmail.com", "123456");

        mockMvc.perform(post("/auth/forgot-password/verify-otp")
                        .param("email", "test@gmail.com")
                        .param("otp", "123456"))
                .andExpect(status().isOk());
    }

    // ================= RESET PASSWORD =================
    @Test
    void testResetPassword() throws Exception {

        ForgotPasswordRequest req = new ForgotPasswordRequest();
        req.setEmail("test@gmail.com");
        req.setNewPassword("newpass");

        Mockito.doNothing().when(userService)
                .resetPassword(any(), any());

        mockMvc.perform(post("/auth/forgot-password/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}
