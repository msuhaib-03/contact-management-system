package com.example.cms.service;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.repository.ContactRepository;
import com.example.cms.repository.userRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class contactsServiceTests {
    @Mock
    private userRepository userRepository;

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private User mockLoginUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@gmail.com");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test@gmail.com", null, List.of())
        );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        return user;
    }

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    // ============= GET CONTACTS =============
    @Test
    void getContacts_withoutSearch(){
        User user = mockLoginUser();
        contactService.getContacts(null, Pageable.unpaged());

        verify(contactRepository).findByUser(eq(user), any());
    }
}
