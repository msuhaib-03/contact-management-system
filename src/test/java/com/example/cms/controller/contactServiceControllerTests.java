package com.example.cms.controller;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.service.ContactService;
import com.example.cms.service.userService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class contactServiceControllerTests {

    private MockMvc mockMvc;
    private ContactService contactService;
    private userService userService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        // create mocks
        contactService = Mockito.mock(ContactService.class);
        userService = Mockito.mock(userService.class);
        objectMapper = new ObjectMapper();

        // create controller and inject mocks manually
        contactController controller = new contactController();
        controller.contactService = contactService;
        controller.userService = userService;

        // standalone setup
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    // helper authentication
    private UsernamePasswordAuthenticationToken auth() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    // ================= GET /contacts/get-all-contacts =================
//    @Test
//    void testGetAllContacts() throws Exception {
//        User mockUser = new User();
//        mockUser.setId(1L);
//        mockUser.setEmail("test@gmail.com");
//
//        Contact contact = new Contact();
//        contact.setId(1L);
//        contact.setFirstName("John");
//        contact.setLastName("Doe");
//        contact.setUser(mockUser);
//
//        List<Contact> contacts = List.of(contact);
//        Page<Contact> page = new PageImpl<>(contacts);
//
//        when(contactService.getContacts(any(), any())).thenReturn(page);
//
//        mockMvc.perform(get("/contacts/get-all-contacts")
//                        .principal(auth()))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.content[0].firstName").value("John"))
//                .andExpect(jsonPath("$.content[0].lastName").value("Doe"))
//                .andExpect(jsonPath("$.content[0].user.email").value("test@gmail.com"));
//    }

//    @Test
//    void testGetAllContacts() throws Exception {
//        List<Contact> contacts = List.of(new Contact());
//        Page<Contact> page = new PageImpl<>(contacts);
//
//        when(contactService.getContacts(any(), any())).thenReturn(page);
//
//        mockMvc.perform(get("/contacts/get-all-contacts")
//                        .principal(auth()))
//                .andExpect(status().isOk());
//    }

    // ================= POST /contacts/create-contact =================
    @Test
    void testCreateContact() throws Exception {
        Contact contact = new Contact();
        when(contactService.createContact(any())).thenReturn(contact);

        mockMvc.perform(post("/contacts/create-contact")
                        .principal(auth())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(contact)))
                .andExpect(status().isOk());
    }

    // ================= PUT /contacts/update-contact/{id} =================
    @Test
    void testUpdateContact() throws Exception {
        Contact contact = new Contact();
        when(contactService.updateContact(any(Long.class), any(Contact.class))).thenReturn(contact);

        mockMvc.perform(put("/contacts/update-contact/1")
                        .principal(auth())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(contact)))
                .andExpect(status().isOk());
    }

    // ================= DELETE /contacts/delete-contact/{id} =================
    @Test
    void testDeleteContact() throws Exception {
        Mockito.doNothing().when(contactService).deleteContact(any(Long.class));

        mockMvc.perform(delete("/contacts/delete-contact/1")
                        .principal(auth()))
                .andExpect(status().isOk());
    }

    // ================= GET /contacts/{id} =================
    @Test
    void testGetContactById() throws Exception {
        Contact contact = new Contact();
        when(contactService.getContact(any(Long.class))).thenReturn(contact);

        mockMvc.perform(get("/contacts/1")
                        .principal(auth()))
                .andExpect(status().isOk());
    }

    // ================= GET /contacts/me =================
    @Test
    void testGetCurrentUser() throws Exception {
        User user = new User();
        when(userService.findByEmailOrPhone("test@gmail.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/contacts/me")
                        .principal(auth()))
                .andExpect(status().isOk());
    }
}
