package com.example.cms.repository;

import com.example.cms.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenBlacklistRepository extends JpaRepository<BlacklistedToken, String> {
    boolean existsByToken(String token);
}
