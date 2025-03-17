package com.Backend.Backend.controller;

import java.util.List;

import com.Backend.Backend.dto.ProductDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Backend.Backend.entity.Product;
import com.Backend.Backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importProducts(@RequestBody List<ProductDTO> products) {
        productService.saveProducts(products);
        return ResponseEntity.ok("Products imported successfully!");
    }
}
