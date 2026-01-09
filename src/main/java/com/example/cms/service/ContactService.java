package com.example.cms.service;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import com.example.cms.exception.ResourceNotFoundException;
import com.example.cms.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public Page<Contact> getContacts(User user, String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return contactRepository
                    .findByUserAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            user, search, search, pageable
                    );
        }
        return contactRepository.findByUser(user, pageable);
    }

    public Contact createContact(User user, Contact contact) {
        contact.setUser(user);
        return contactRepository.save(contact);
    }

    public Contact getContact(Long id, User user) {
        return contactRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    public Contact updateContact(Long id, User user, Contact updated) {
        Contact existing = getContact(id, user);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setTitle(updated.getTitle());
        existing.setEmails(updated.getEmails());
        existing.setPhoneNumbers(updated.getPhoneNumbers());
        return contactRepository.save(existing);
    }

    public void deleteContact(Long id, User user) {
        Contact contact = getContact(id, user);
        contactRepository.delete(contact);
    }
}
