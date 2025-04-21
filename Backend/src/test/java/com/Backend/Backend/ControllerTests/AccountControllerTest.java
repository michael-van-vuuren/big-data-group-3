package com.Backend.Backend.ControllerTests;

import com.Backend.Backend.controller.AccountController;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.AccountRepository;
import com.Backend.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static java.util.Collections.emptySet;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AccountControllerTest {

    private MockMvc mockMvc;
    private AccountRepository accountRepo;
    private ProductRepository productRepo;

    @BeforeEach
    void setUp() {
        accountRepo = mock(AccountRepository.class);
        productRepo = mock(ProductRepository.class);
        AccountController controller = new AccountController(accountRepo, productRepo);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        SecurityContextHolder.clearContext();
    }

    private void authenticateAs() {
        Authentication auth = new TestingAuthenticationToken("u@x.com", null, "ROLE_USER");
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void getFavorites_unauthenticated_401() throws Exception {
        mockMvc.perform(get("/api/account/favorites"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Not authenticated"));
    }

    @Test
    void getFavorites_notFoundUser_404() throws Exception {
        authenticateAs();
        when(accountRepo.findByEmail("u@x.com")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/account/favorites"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found with email: u@x.com"));
    }

    @Test
    void getFavorites_emptySet_200EmptyList() throws Exception {
        authenticateAs();
        Account acc = Account.builder().name("u").email("u@x.com").password("p").role(Account.Role.USER).build();
        acc.setFavoriteProducts(emptySet());
        when(accountRepo.findByEmail("u@x.com")).thenReturn(Optional.of(acc));

        mockMvc.perform(get("/api/account/favorites"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void addFavorite_nullId_badRequest() throws Exception {
        authenticateAs();
        mockMvc.perform(post("/api/account/favorites")
                        .contentType(APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found with email: u@x.com"));
    }

    @Test
    void addFavorite_notFoundProduct_404() throws Exception {
        authenticateAs();
        Account acc = Account.builder().name("u").email("u@x.com").password("p").role(Account.Role.USER).build();
        when(accountRepo.findByEmail("u@x.com")).thenReturn(Optional.of(acc));
        when(productRepo.findById(5L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/account/favorites")
                        .contentType(APPLICATION_JSON)
                        .content("{\"productId\":5}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found with ID: 5"));
    }

    @Test
    void removeFavorite_success_200() throws Exception {
        authenticateAs();
        Account acc = Account.builder().name("u").email("u@x.com").password("p").role(Account.Role.USER).build();
        Product prod = new Product();
        prod.setId(9L);
        acc.setFavoriteProducts(new java.util.HashSet<>() );
        acc.getFavoriteProducts().add(prod);
        when(accountRepo.findByEmail("u@x.com")).thenReturn(Optional.of(acc));
        when(productRepo.findById(9L)).thenReturn(Optional.of(prod));

        mockMvc.perform(delete("/api/account/favorites/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Product ID: 9 removed from favorites for user: u@x.com"));
    }
}
