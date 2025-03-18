package com.Backend.Backend.controller;

import java.util.List;

import com.Backend.Backend.dto.ProductDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Backend.Backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> addProducts(@RequestBody List<ProductDTO> products) {
        productService.saveProducts(products, false);
        return ResponseEntity.ok("Products added successfully!");
    }

    @PutMapping("/import")
    public ResponseEntity<String> updateProducts(@RequestBody List<ProductDTO> products) {
        productService.saveProducts(products, true);
        return ResponseEntity.ok("Products updated successfully!");
    }
}
