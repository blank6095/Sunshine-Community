package com.exclusive.blank.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private static final String SECRET = "your-256-bit-secret-key-here-must-be-at-least-32-characters-long-for-hs256";
    private static final long EXPIRATION_TIME = 86400000;

    public JwtTokenProvider() {
        logger.info("JwtTokenProvider instantiated");
    }

    public String generateToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        logger.info("Principal type: {}", principal.getClass().getName());

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        logger.info("Generating token for username: {}", username);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
        logger.info("Expiry date: {}", expiryDate);

        String token = Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
            .compact();
        logger.info("Token generated successfully, length: {}", token.length());
        return token;
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
            .build()
            .parseSignedClaims(token)
            .getPayload();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
}
