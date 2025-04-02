package com.Backend.Backend.controller;

import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.dto.AuthResponse;
//import com.Backend.Backend.service.AuthService; // TODO
import com.Backend.Backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // private final AuthService authService; // TODO
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // TODO (STUBBED):
        // 1. validate request
        // 2. check if email already exists
        // 3. hash password
        // 4. save user to DB (authService)

        // DEBUG
        System.out.println("Registering (stubbed):");
        System.out.println("Name: " + request.getName());
        System.out.println("Email: " + request.getEmail());

        // Build and respond with JWT
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // TODO (STUBBED):
        // 1. validate request
        // 2. find user by email (authService)
        // 3. compare hashed incoming password with DB hashed password
        // 4. handle incorrect credentials/user not found

        // DEBUG
        System.out.println("Logging in (stubbed):");
        System.out.println("Email: " + request.getEmail());

        // Build and respond with JWT
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}