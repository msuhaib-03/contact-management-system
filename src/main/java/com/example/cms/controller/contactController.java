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

    @PutMapping("/{id}")
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

}
