package com.exclusive.blank.service;

import com.exclusive.blank.dto.UserLoginResponse;
import com.exclusive.blank.model.User;
import com.exclusive.blank.repository.UserRepository;
import com.exclusive.blank.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> login(String username, String password) {
        logger.info("AuthService.login called for user: {}", username);
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            logger.info("Authentication successful for user: {}", username);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("SecurityContext set");

            String token = jwtTokenProvider.generateToken(authentication);
            logger.info("Token generated: {}", token.substring(0, Math.min(20, token.length())) + "...");

            logger.info("Querying user from database: {}", username);
            User user = userRepository.findByUsername(username).orElseThrow();
            logger.info("User found: {}", user.getUsername());

            UserLoginResponse userResponse = new UserLoginResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getStatus()
            );
            logger.info("UserLoginResponse created");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);
            logger.info("Response map created");

            return response;
        } catch (Exception e) {
            logger.error("Error in AuthService.login: {} - {}", e.getClass().getName(), e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Map<String, Object> refreshToken(String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElseThrow();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getUsername(), user.getPassword()
        );

        String newToken = jwtTokenProvider.generateToken(authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("token", newToken);

        return response;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE");
        return userRepository.save(user);
    }
}