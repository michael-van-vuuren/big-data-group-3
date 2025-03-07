package com.Backend.Backend.controller;

import com.Backend.Backend.entity.Product;
import com.Backend.Backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Backend.Backend.dto.ProductFlavorLink;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importProducts(@RequestBody List<Product> products) {
        productService.saveProducts(products);
        return ResponseEntity.ok("Products imported successfully!");
    }

    @PostMapping("/link-flavors")
    public ResponseEntity<String> updateProductFlavors(@RequestBody List<ProductFlavorLink> links) {
        productService.linkProductFlavors(links);
        return ResponseEntity.ok("Product flavors updated successfully!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
