package com.example.cms.service;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.exception.ResourceNotFoundException;
import com.example.cms.repository.ContactRepository;
import com.example.cms.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private userRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    public Page<Contact> getContacts(String search, Pageable pageable) {
        User user = getLoggedInUser();
        if (search != null && !search.isBlank()) {
            return contactRepository
                    .findByUserAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            user, search, search, pageable
                    );
        }
        return contactRepository.findByUser(user, pageable);
    }

    public Contact createContact(Contact contact) {
        User user = getLoggedInUser();
        contact.setUser(user);
        return contactRepository.save(contact);
    }

    public Contact getContact(Long id) {
        User user = getLoggedInUser();
        return contactRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    public Contact updateContact(Long id, Contact updated) {
        Contact existing = getContact(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setTitle(updated.getTitle());
        existing.setEmails(updated.getEmails());
        existing.setPhoneNumbers(updated.getPhoneNumbers());
        return contactRepository.save(existing);
    }

    public void deleteContact(Long id) {
        Contact contact = getContact(id);
        contactRepository.delete(contact);
    }

    private User getLoggedInUser() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = auth.getName(); // comes from JWT

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
