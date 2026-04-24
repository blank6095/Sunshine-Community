package com.exclusive.blank.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.charset.StandardCharsets;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final String SECRET = "your-256-bit-secret-key-here-must-be-at-least-32-characters-long-for-hs256";
    private static final long EXPIRATION_TIME = 86400000;

    @Test
    public void testGenerateAndValidateToken() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);
        assertNotNull(token);
        assertTrue(token.length() > 0);

        boolean isValid = jwtTokenProvider.validateToken(token);
        assertTrue(isValid);

        String username = jwtTokenProvider.getUsernameFromToken(token);
        assertEquals("testuser", username);
    }

    @Test
    public void testInvalidToken() {
        boolean isValid = jwtTokenProvider.validateToken("invalid.token.here");
        assertFalse(isValid);
    }

    @Test
    public void testEmptyToken() {
        boolean isValid = jwtTokenProvider.validateToken("");
        assertFalse(isValid);
    }

    @Test
    public void testNullToken() {
        boolean isValid = jwtTokenProvider.validateToken(null);
        assertFalse(isValid);
    }

    @Test
    public void testTokenWithWhitespace() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);

        boolean isValid = jwtTokenProvider.validateToken(token + " ");
        assertFalse(isValid);
    }

    @Test
    public void testTokenWithModifiedSignature() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);

        String[] parts = token.split("\\.");
        if (parts.length == 3) {
            parts[2] = parts[2] + "X";
            String modifiedToken = String.join(".", parts);
            boolean isValid = jwtTokenProvider.validateToken(modifiedToken);
            assertFalse(isValid);
        }
    }

    @Test
    public void testTokenExpired() {
        String expiredToken = Jwts.builder()
            .subject("testuser")
            .issuedAt(new java.util.Date(System.currentTimeMillis() - EXPIRATION_TIME * 2))
            .expiration(new java.util.Date(System.currentTimeMillis() - EXPIRATION_TIME))
            .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
            .compact();

        boolean isValid = jwtTokenProvider.validateToken(expiredToken);
        assertFalse(isValid);
    }

    @Test
    public void testTokenNotExpired() {
        String validToken = Jwts.builder()
            .subject("testuser")
            .issuedAt(new java.util.Date())
            .expiration(new java.util.Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
            .compact();

        boolean isValid = jwtTokenProvider.validateToken(validToken);
        assertTrue(isValid);
    }

    @Test
    public void testGetUsernameFromToken() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);
        String username = jwtTokenProvider.getUsernameFromToken(token);

        assertEquals("testuser", username);
    }

    @Test
    public void testMalformedToken() {
        assertThrows(Exception.class, () -> {
            jwtTokenProvider.getUsernameFromToken("not-a-valid-jwt");
        });
    }
}
