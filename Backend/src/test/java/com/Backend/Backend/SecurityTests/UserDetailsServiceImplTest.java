package com.Backend.Backend.SecurityTests;

import com.Backend.Backend.entity.Account;
import com.Backend.Backend.repository.AccountRepository;
import com.Backend.Backend.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsername_userExists_returnsUserDetails() {
        // Arrange
        String email = "test@example.com";
        Account account = Account.builder()
                .name("Tester")
                .email(email)
                .password("secret")
                .role(Account.Role.USER)
                .build();
        when(accountRepository.findByEmail(email))
                .thenReturn(Optional.of(account));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals("secret", userDetails.getPassword());
        assertEquals(account.getAuthorities(), userDetails.getAuthorities());
        verify(accountRepository).findByEmail(email);
    }

    @Test
    void loadUserByUsername_userNotFound_throwsException() {
        // Arrange
        String email = "missing@example.com";
        when(accountRepository.findByEmail(email))
                .thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException ex = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email)
        );
        assertEquals("User not found with email: " + email, ex.getMessage());
        verify(accountRepository).findByEmail(email);
    }
}
