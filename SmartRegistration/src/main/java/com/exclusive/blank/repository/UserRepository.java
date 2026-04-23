package com.exclusive.blank.repository;

import com.exclusive.blank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByPhone(String phone);
    Optional<User> findByIdCard(String idCard);
    Optional<User> findByEmail(String email);
}