package com.Backend.Backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.expiration.ms}")
    private long expirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = this.secretString.getBytes();
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getSigningKey() {
        return this.key;
    }

    // Generate token (uses email rn)
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        // TODO: add roles
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    // Extract email subject
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    // Compare token to DB
    public Boolean validateToken(String token, String expectedEmail) {
        try {
            final String extractedEmail = extractEmail(token);

            return (expectedEmail.equals(extractedEmail));
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
            System.err.println("JWT validation error: " + e.getMessage());
            return false;
        }
    }
}