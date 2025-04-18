package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Account;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}
