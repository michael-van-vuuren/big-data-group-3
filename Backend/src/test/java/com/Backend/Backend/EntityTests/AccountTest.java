package com.Backend.Backend.EntityTests;

import com.Backend.Backend.entity.Account;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class AccountTest {

    @Test
    void builderAndUserDetailsMethods() {
        Account account = Account.builder()
                .id(42)
                .name("Alice")
                .email("alice@example.com")
                .password("secret")
                .role(Account.Role.USER)
                .build();

        // getters
        assertEquals(42, account.getId());
        assertEquals("Alice", account.getName());
        assertEquals("alice@example.com", account.getEmail());
        assertEquals("secret", account.getPassword());
        assertEquals(Account.Role.USER, account.getRole());

        // UserDetails methods
        assertEquals("alice@example.com", account.getUsername());
        Collection<? extends SimpleGrantedAuthority> auths = (Collection<? extends SimpleGrantedAuthority>) account.getAuthorities();
        assertEquals(1, auths.size());
        assertTrue(auths.contains(new SimpleGrantedAuthority("ROLE_USER")));

        assertTrue(account.isAccountNonExpired());
        assertTrue(account.isAccountNonLocked());
        assertTrue(account.isCredentialsNonExpired());
        assertTrue(account.isEnabled());

        // initial favorites empty
        assertNull(account.getFavoriteProducts());
    }
}
