package com.example.cms.service;

import com.example.cms.entity.Contact;
import com.example.cms.entity.LabeledValue;
import com.example.cms.entity.User;
import com.example.cms.exception.ResourceAlreadyExistsException;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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

    @Test
    void getContacts_withSearch() {
        User user = mockLoginUser();

        contactService.getContacts("Suhaib", Pageable.unpaged());

        verify(contactRepository)
                .findByUserAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        eq(user), eq("Suhaib"), eq("Suhaib"), any()
                );
    }

    // ============ CREATE CONTACT =============
    @Test
    void createContact_success() {
        User user = mockLoginUser();

        Contact contact = new Contact();
        LabeledValue email = new LabeledValue();
        email.setLabel("home");
        email.setValue("abc@gmail.com");
        contact.setEmails(List.of(email));

        when(userRepository.findByEmail(contact.getEmails().toString()))
                .thenReturn(Optional.empty());

        contactService.createContact(contact);

        assertEquals(user, contact.getUser());
        verify(contactRepository).save(contact);
    }

    @Test
    void createContact_duplicateEmail() {
        mockLoginUser();

        Contact contact = new Contact();
        LabeledValue email = new LabeledValue();
        email.setLabel("home");
        email.setValue("abc@gmail.com");
        contact.setEmails(List.of(email));
        when(userRepository.findByEmail(contact.getEmails().toString()))
                .thenReturn(Optional.of(new User()));

        assertThrows(ResourceAlreadyExistsException.class,
                () -> contactService.createContact(contact));
    }

    // ============ GET CONTACT =============
    @Test
    void getContact_success() {
        User user = mockLoginUser();

        Contact contact = new Contact();
        contact.setId(1L);
        contact.setUser(user);

        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(contact));

        Contact result = contactService.getContact(1L);

        assertEquals(contact, result);
    }

    // ============ UPDATE CONTACT =============
    @Test
    void updateContact_success() {
        User user = mockLoginUser();

        Contact existing = new Contact();
        existing.setId(1L);
        existing.setUser(user);

        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        Contact updated = new Contact();
        updated.setFirstName("Ali");
        updated.setLastName("Khan");

        contactService.updateContact(1L, updated);

        assertEquals("Ali", existing.getFirstName());
        assertEquals("Khan", existing.getLastName());
        verify(contactRepository).save(existing);
    }

    // =========== DELETE CONTACT =============
    @Test
    void deleteContact_success() {
        User user = mockLoginUser();

        Contact contact = new Contact();
        contact.setId(1L);
        contact.setUser(user);

        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(contact));

        contactService.deleteContact(1L);

        verify(contactRepository).delete(contact);
    }
}
