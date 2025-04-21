package com.Backend.Backend.ServiceTests;

import com.Backend.Backend.repository.ProductRepository;
import com.Backend.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;

public class ProductServiceTest {
    private ProductRepository productRepository;
    private ProductService productService;

    @BeforeEach
    void setup() {
        productRepository = mock(ProductRepository.class);
        productService = new ProductService(productRepository, null, null, null, null, null, null); // nulls for unused deps
    }

    @Test
    void testDeleteExistingProduct() {
        Long productId = 1L;
        when(productRepository.existsById(productId)).thenReturn(true);

        boolean result = productService.deleteProductById(productId);

        assertTrue(result);
        verify(productRepository).deleteById(productId);
    }

    @Test
    void testDeleteNonexistentProduct() {
        Long productId = 99L;
        when(productRepository.existsById(productId)).thenReturn(false);

        boolean result = productService.deleteProductById(productId);

        assertFalse(result);
        verify(productRepository, never()).deleteById(productId);
    }

    @Test
    void testDeleteProductWithInvalidId() {
        Long productId = null;
        boolean result = productService.deleteProductById(productId);
        assertFalse(result);
        verify(productRepository, never()).deleteById(productId);
    }

    @Test
    void testGetProductByRoasterName() {
        assertNotNull(productService.getProductsByRoasterName("Roaster 1"));
    }
}
