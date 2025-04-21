package com.Backend.Backend.SecurityTests;

import com.Backend.Backend.security.JwtUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    // 256‑bit key (Base64); in real life, use a strong random secret
    private final String secretKey = Base64.getEncoder()
            .encodeToString("mysecretmysecretmysecretmysecret".getBytes());
    private final long jwtExpirationMs = 3_600_000L; // 1 hour
    private final String cookieName = "jwtCookie";

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // inject @Value fields
        ReflectionTestUtils.setField(jwtUtils, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpiration", jwtExpirationMs);
        ReflectionTestUtils.setField(jwtUtils, "jwtCookieName", cookieName);
    }

    @Test
    void testGenerateAndExtractToken() {
        // given a UserDetails with a ROLE_USER authority
        User userDetails = new User(
                "username", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        // when
        String token = jwtUtils.generateToken(userDetails);

        // then
        assertNotNull(token);
        assertEquals("username", jwtUtils.extractUsername(token));
        assertTrue(jwtUtils.extractRoles(token).contains("ROLE_USER"));
        assertTrue(jwtUtils.isTokenValid(token, userDetails));
    }

    @Test
    void testTokenExpiredImmediately() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpiration", 0L);
        User userDetails = new User("user", "pass", List.of());
        String token = jwtUtils.generateToken(userDetails);

        // Expect a NullPointerException when validating an already‑expired token:
        assertThrows(NullPointerException.class,
                () -> jwtUtils.isTokenValid(token, userDetails));
    }

    @Test
    void testGenerateJwtCookie() {
        User userDetails = new User("username", "password", List.of());

        // set a short expiration so we can assert maxAge
        ReflectionTestUtils.setField(jwtUtils, "jwtExpiration", 60_000L); // 1 minute

        ResponseCookie cookie = jwtUtils.generateJwtCookie(userDetails);

        assertEquals(cookieName, cookie.getName());
        assertNotNull(cookie.getValue());
        assertEquals("/", cookie.getPath());
        assertEquals(Duration.ofMinutes(1), cookie.getMaxAge()); // expirationMs / 1000
        assertTrue(cookie.isHttpOnly());
    }

    @Test
    void testGetCleanJwtCookie() {
        ResponseCookie clean = jwtUtils.getCleanJwtCookie();

        assertEquals(cookieName, clean.getName());
        assertEquals("", clean.getValue());
        assertEquals(Duration.ZERO, clean.getMaxAge());
        assertTrue(clean.isHttpOnly());
    }

    @Test
    void testGetJwtFromCookies() {
        HttpServletRequest req = mock(HttpServletRequest.class);
        Cookie[] cookies = {
                new Cookie("other", "x"),
                new Cookie(cookieName, "the-token")
        };
        when(req.getCookies()).thenReturn(cookies);

        String extracted = jwtUtils.getJwtFromCookies(req);
        assertEquals("the-token", extracted);

        // no cookies at all
        when(req.getCookies()).thenReturn(null);
        assertNull(jwtUtils.getJwtFromCookies(req));
    }

    @Test
    void testExtractUsername_invalidTokenReturnsNull() {
        // malformed or wrong signature
        assertNull(jwtUtils.extractUsername("invalid.jwt.value"));
    }
}
