package com.Backend.Backend.controller;

import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.MessageResponse;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.dto.AuthResponse;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Account registeredUser = authService.register(request);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            // Handle specific exceptions like email exists
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            ResponseCookie jwtCookie = authService.login(request);

            // Get user details after successful authentication via authService
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Account userDetails = (Account) authentication.getPrincipal();

            // Return cookie in header and user info in body
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new AuthResponse(userDetails.getName(), userDetails.getEmail(), userDetails.getRole()));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = authService.logout();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    // Example protected endpoint to verify login status client-side
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }
        Account userDetails = (Account) authentication.getPrincipal();
        return ResponseEntity.ok(new AuthResponse(userDetails.getName(), userDetails.getEmail(), userDetails.getRole()));
    }
}