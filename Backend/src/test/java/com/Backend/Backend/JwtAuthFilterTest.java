package com.Backend.Backend;

import com.Backend.Backend.security.JwtAuthFilter;
import com.Backend.Backend.security.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @Mock
    JwtUtils jwtUtils;
    @Mock UserDetailsService userDetailsService;
    @Mock HttpServletRequest request;
    @Mock HttpServletResponse response;
    @Mock FilterChain filterChain;

    @InjectMocks
    JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext(); // Clear context before each test
    }

    @Test
    void testNoJwt_callsNextFilterOnly() throws Exception {
        when(jwtUtils.getJwtFromCookies(request)).thenReturn(null);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testValidJwt_setsAuthentication() throws Exception {
        String token = "valid.jwt.token";
        String email = "user@example.com";
        UserDetails userDetails = new User(email, "password", List.of());

        when(jwtUtils.getJwtFromCookies(request)).thenReturn(token);
        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtUtils.isTokenValid(token, userDetails)).thenReturn(true);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(userDetails, auth.getPrincipal());
    }

    @Test
    void testInvalidJwt_doesNotSetAuthentication() throws Exception {
        String token = "invalid.jwt";
        String email = "user@example.com";
        UserDetails userDetails = new User(email, "password", List.of());

        when(jwtUtils.getJwtFromCookies(request)).thenReturn(token);
        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtUtils.isTokenValid(token, userDetails)).thenReturn(false);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testExceptionDuringJwtProcessing_doesNotThrow() throws Exception {
        when(jwtUtils.getJwtFromCookies(request)).thenReturn("bad.jwt");
        when(jwtUtils.extractUsername("bad.jwt")).thenThrow(new RuntimeException("Boom"));

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
