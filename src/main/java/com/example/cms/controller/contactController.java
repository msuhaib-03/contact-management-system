package com.example.cms.controller;

import com.example.cms.dto.FavoriteResponseDTO;
import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.service.ContactService;
import com.example.cms.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/contacts")
public class contactController {

    @Autowired
    ContactService contactService;

    @Autowired
    userService userService;

    @GetMapping("/get-all-contacts")
    public Page<Contact> getContacts(
                                     @RequestParam(required = false) String search,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("firstName"));
        return contactService.getContacts(search, pageable);
    }

    @PostMapping("/create-contact")
    public Contact createContact(@RequestBody Contact contact) {
        return contactService.createContact(contact);
    }

    @DeleteMapping("/delete-contact/{id}")
    public void deleteContact(
                              @PathVariable Long id) {
        contactService.deleteContact(id);
    }

    @PutMapping("/update-contact/{id}")
    public Contact updateContact(
                                 @PathVariable Long id,
                                 @RequestBody Contact contact) {
        return contactService.updateContact(id, contact);
    }

    @GetMapping("/{id}")
    public Contact getContact(
                              @PathVariable Long id) {
        return contactService.getContact(id);
    }

    @GetMapping("/me")
    public User getCurrentUser(Authentication auth) {
        return userService.findByEmailOrPhone(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================== OPTIONAL FEATURES NOW ==================
    // FAVORITE CONTACT ENDPOINTS
    @GetMapping("/favorites")
    public List<Contact> getFavorites(){
        return contactService.getFavoriteContacts();
    }

    @PutMapping("/favorites/{id}")
    public FavoriteResponseDTO toggleFavorite(
            @PathVariable Long id) {
        return contactService.toggleFavorite(id);
    }



}
