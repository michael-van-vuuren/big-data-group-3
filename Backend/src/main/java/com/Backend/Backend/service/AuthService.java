package com.Backend.Backend.service;

import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.repository.AccountRepository;
import com.Backend.Backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager; // Inject AuthenticationManager

    public Account register(RegisterRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (accountRepository.existsByName(request.getName())) {
            throw new RuntimeException("Name is already in use!");
        }

        Account user = Account.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                // Add roles here if needed
                .build();

        return accountRepository.save(user);
    }

    public ResponseCookie login(LoginRequest request) {
        // Authenticate user with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT Cookie
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateJwtCookie(userDetails);
    }

    public ResponseCookie logout() {
        return jwtUtils.getCleanJwtCookie();
    }
}