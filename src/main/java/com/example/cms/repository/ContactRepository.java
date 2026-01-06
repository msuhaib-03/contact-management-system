package com.example.cms.repository;

import com.example.cms.entity.Contact;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    Page<Contact> findByUser(User user, Pageable pageable);

    Page<Contact> findByUserAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            User user, String firstName, String lastName, Pageable pageable);

}
