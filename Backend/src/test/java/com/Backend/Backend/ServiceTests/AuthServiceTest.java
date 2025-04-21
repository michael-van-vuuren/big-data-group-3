package com.Backend.Backend.ServiceTests;

import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.exception.EmailAlreadyExistsException;
import com.Backend.Backend.repository.AccountRepository;
import com.Backend.Backend.security.JwtUtils;
import com.Backend.Backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock AccountRepository accountRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtils jwtUtils;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks
    AuthService authService;

    RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest();
        validRequest.setEmail("user@example.com");
        validRequest.setName("TestUser");
        validRequest.setPassword("password123");
        validRequest.setRole("USER");
    }

    @Test
    void register_successful() {
        when(accountRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(accountRepository.existsByName("TestUser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        Account mockAccount = Account.builder()
                .name("TestUser")
                .email("user@example.com")
                .password("hashed-password")
                .role(Account.Role.USER)
                .build();

        when(accountRepository.save(any())).thenReturn(mockAccount);

        Account result = authService.register(validRequest);

        assertEquals("TestUser", result.getName());
        assertEquals("user@example.com", result.getEmail());
        assertEquals("hashed-password", result.getPassword());
    }

    @Test
    void register_existingEmail_throwsException() {
        when(accountRepository.existsByEmail("user@example.com")).thenReturn(true);

        EmailAlreadyExistsException ex = assertThrows(EmailAlreadyExistsException.class,
                () -> authService.register(validRequest));

        assertEquals("Email is already in use!", ex.getMessage());
    }

    @Test
    void register_existingName_throwsException() {
        when(accountRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(accountRepository.existsByName("TestUser")).thenReturn(true);

        EmailAlreadyExistsException ex = assertThrows(EmailAlreadyExistsException.class,
                () -> authService.register(validRequest));

        assertEquals("Name is already in use!", ex.getMessage());
    }

    @Test
    void login_successful() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("password123");

        Authentication authMock = mock(Authentication.class);
        UserDetails userDetailsMock = mock(UserDetails.class);
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "token").build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
        when(authMock.getPrincipal()).thenReturn(userDetailsMock);
        when(jwtUtils.generateJwtCookie(userDetailsMock)).thenReturn(jwtCookie);

        ResponseCookie result = authService.login(loginRequest);

        assertEquals("jwt", result.getName());
        assertEquals("token", result.getValue());
    }

    @Test
    void logout_returnsCleanCookie() {
        ResponseCookie clean = ResponseCookie.from("jwt", "").build();
        when(jwtUtils.getCleanJwtCookie()).thenReturn(clean);

        ResponseCookie result = authService.logout();

        assertEquals("", result.getValue());
    }
}
