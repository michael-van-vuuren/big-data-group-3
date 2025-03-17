package com.Backend.Backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Backend.Backend.dto.ProductFlavorLink;
import com.Backend.Backend.dto.ProductRoasterLink;
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
    public ResponseEntity<String> importProducts(@RequestBody List<Product> products) {
        productService.saveProducts(products);
        return ResponseEntity.ok("Products imported successfully!");
    }

    @PostMapping("/link-flavors")
    public ResponseEntity<String> updateProductFlavors(@RequestBody List<ProductFlavorLink> links) {
        productService.linkProductFlavors(links);
        return ResponseEntity.ok("Product flavors updated successfully!");
    }

    @PostMapping("/link-roasters")
    public ResponseEntity<String> linkProductsToRoasters(@RequestBody List<ProductRoasterLink> links) {
        productService.linkProductRoasters(links);
        return ResponseEntity.ok("Products linked to roasters successfully!");
    }


    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
