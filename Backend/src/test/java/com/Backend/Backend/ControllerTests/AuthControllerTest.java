// File: AuthControllerTest.java
package com.Backend.Backend.ControllerTests;

import com.Backend.Backend.controller.AuthController;
import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.dto.AuthResponse;
import com.Backend.Backend.dto.MessageResponse;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {

    private MockMvc mockMvc;
    private AuthService authService;
    private AuthController controller;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        controller = new AuthController(authService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        SecurityContextHolder.clearContext();
    }

    @Test
    void register_success_200() throws Exception {
        doReturn(Account.builder().email("a@b.com").name("A").password("p").role(Account.Role.USER).build())
                .when(authService).register(any(RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("{\"email\":\"a@b.com\",\"name\":\"A\",\"password\":\"x\",\"role\":\"USER\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    void register_failure_400() throws Exception {
        doThrow(new RuntimeException("oops")).when(authService).register(any());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("{\"email\":\"a@b.com\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("oops"));
    }

    @Test
    void login_success_setsCookieAndBody() throws Exception {
        ResponseCookie cookie = ResponseCookie.from("jwt","tok").build();
        doReturn(cookie).when(authService).login(any(LoginRequest.class));

        // prepare SecurityContext principal
        Authentication auth = new TestingAuthenticationToken(
                Account.builder().name("N").email("n@e.com").password("p").role(Account.Role.USER).build(),
                null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("{\"email\":\"n@e.com\",\"password\":\"p\"}"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.SET_COOKIE, cookie.toString()))
                .andExpect(jsonPath("$.name").value("N"))
                .andExpect(jsonPath("$.email").value("n@e.com"));
    }

    @Test
    void logout_returnsCleanCookie() throws Exception {
        ResponseCookie clean = ResponseCookie.from("jwt","").build();
        doReturn(clean).when(authService).logout();

        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.SET_COOKIE, clean.toString()))
                .andExpect(jsonPath("$.message").value("You've been signed out!"));
    }
}
