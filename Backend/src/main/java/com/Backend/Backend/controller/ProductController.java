package com.Backend.Backend.controller;

import java.util.List;
import java.util.Map;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.dto.ProductImportResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Backend.Backend.service.ProductService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @PostMapping("/import")
    public ResponseEntity<ProductImportResult> addProducts(@RequestBody List<ProductDTO> products) {
        if (products == null || products.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ProductImportResult(List.of(), List.of(), List.of(), "No products provided."));
        }

        return ResponseEntity.ok(productService.importProducts(products));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProductById(id);
        if (deleted) {
            return ResponseEntity.ok("Product deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
}
