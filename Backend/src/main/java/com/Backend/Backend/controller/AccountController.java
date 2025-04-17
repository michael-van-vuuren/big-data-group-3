package com.Backend.Backend.controller;

import com.Backend.Backend.dto.AuthResponse;
import com.Backend.Backend.dto.FavoriteRequest;
import com.Backend.Backend.dto.MessageResponse;
import com.Backend.Backend.dto.ProductResponseDTO;
import com.Backend.Backend.entity.Account;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.AccountRepository;
import com.Backend.Backend.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class AccountController {

    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;

    private ResponseEntity<?> handleAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not authenticated"));
        }
        return null;
    }

    private Account getAuthenticatedAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return accountRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
    }

    // Get a user's favorite products
    @GetMapping("/favorites")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getFavoriteProducts() {
        ResponseEntity<?> authenticationError = handleAuthentication();
        if (authenticationError != null) {
            return authenticationError;
        }

        try {
            Account account = getAuthenticatedAccount();
            Set<Product> favoriteProducts = account.getFavoriteProducts();

            if (favoriteProducts == null) {
                return ResponseEntity.ok(List.of());
            }

            List<ProductResponseDTO> dtos = favoriteProducts.stream()
                    .map(ProductResponseDTO::fromEntity)
                    .toList();

            return ResponseEntity.ok(dtos);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("An internal error occurred while fetching favorites."));
        }
    }

    // Add a user's favorite product
    @PostMapping("/favorites")
    @Transactional
    public ResponseEntity<?> addFavoriteProduct(@RequestBody FavoriteRequest request) {
        ResponseEntity<?> authenticationError = handleAuthentication();
        if (authenticationError != null) {
            return authenticationError;
        }

        try {
            Account account = getAuthenticatedAccount();

            // Get product by request productId
            Long productId = request.getProductId();
            if (productId == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Product ID is required"));
            }
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));

            // Add product to account favoriteProducts
            account.getFavoriteProducts().add(product);
            accountRepository.save(account);

            // Return success
            return ResponseEntity.ok(new MessageResponse("Product ID: " + productId + " added to favorites for user: " + account.getEmail()));

        } catch (UsernameNotFoundException | EntityNotFoundException e) {
            // Request productId not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("An internal error occurred while adding favorite."));
        }
    }

    // Remove a user's favorite product
    @DeleteMapping("/favorites/{productId}")
    @Transactional
    public ResponseEntity<?> removeFavoriteProduct(@PathVariable Long productId) {
        ResponseEntity<?> authenticationError = handleAuthentication();
        if (authenticationError != null) {
            return authenticationError;
        }

        try {
            Account account = getAuthenticatedAccount();

            // Get product by productId
            if (productId == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Product ID is required"));
            }
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));

            // Remove product from account favoriteProducts
            if (account.getFavoriteProducts().remove(product)) {
                accountRepository.save(account);
                return ResponseEntity.ok(new MessageResponse("Product ID: " + productId + " removed from favorites for user: " + account.getEmail()));
            } else {
                return ResponseEntity.ok(new MessageResponse("Product ID: " + productId + " was not in favorites for user: " + account.getEmail()));
            }

        } catch (UsernameNotFoundException | EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("An internal error occurred while removing favorite."));
        }
    }
}