package com.example.cms.controller;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
public class contactController {

    @Autowired
    ContactService contactService;

    @GetMapping
    public Page<Contact> getContacts(@AuthenticationPrincipal User user,
                                     @RequestParam(required = false) String search,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("firstName"));
        return contactService.getContacts(user, search, pageable);
    }

    @PostMapping
    public Contact createContact(@AuthenticationPrincipal User user,
                                 @RequestBody Contact contact) {
        return contactService.createContact(user, contact);
    }

    @DeleteMapping("/{id}")
    public void deleteContact(@AuthenticationPrincipal User user,
                              @PathVariable Long id) {
        contactService.deleteContact(id, user);
    }

    @PutMapping
    public Contact updateContact(@AuthenticationPrincipal User user,
                                 @PathVariable Long id,
                                 @RequestBody Contact contact) {
        return contactService.updateContact(id, user, contact);
    }

    @GetMapping("/{id}")
    public Contact getContact(@AuthenticationPrincipal User user,
                              @PathVariable Long id) {
        return contactService.getContact(id, user);
    }

}
