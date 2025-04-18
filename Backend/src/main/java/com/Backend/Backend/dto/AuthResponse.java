package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String name;
    private String email;
    private String role;

    public AuthResponse(String name, String email, Account.Role role) {
        this.name = name;
        this.email = email;
        this.role = role.toString();
    }
}