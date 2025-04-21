// File: ProductControllerTest.java
package com.Backend.Backend.ControllerTests;

import com.Backend.Backend.controller.ProductController;
import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.dto.ProductImportResult;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductControllerTest {

    private MockMvc mockMvc;
    private ProductService service;

    @BeforeEach
    void setUp() {
        service = mock(ProductService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new ProductController(service)).build();
    }

    @Test
    void addProducts_emptyBody_badRequest() throws Exception {
        mockMvc.perform(post("/api/products/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[]"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("No products provided."));
    }

    @Test
    void addProducts_delegatesToService() throws Exception {
        ProductImportResult result = new ProductImportResult(emptyList(), emptyList(), emptyList(), "ok");
        when(service.importProducts(any())).thenReturn(result);

        mockMvc.perform(post("/api/products/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[{\"name\":\"X\"}]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ok"));
    }

    @Test
    void deleteProduct_found_returns200() throws Exception {
        when(service.deleteProductById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Product deleted successfully."));
    }

    @Test
    void deleteProduct_notFound_returns404() throws Exception {
        when(service.deleteProductById(2L)).thenReturn(false);

        mockMvc.perform(delete("/api/products/2"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found."));
    }
}
