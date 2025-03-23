package com.Backend.Backend.controller;

import java.util.List;
import java.util.Map;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.dto.ProductImportResult;
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
    public ResponseEntity<ProductImportResult> addProducts(@RequestBody List<ProductDTO> products) {
        if (products == null || products.isEmpty()) {
            return ResponseEntity.badRequest().body(new ProductImportResult(List.of(), List.of(), "No products provided."));
        }

        ProductImportResult result = productService.importProducts(products);

        // Set message based on results
        if (result.getRejectedProducts().isEmpty()) {
            result.setMessage("All products imported successfully!");
        } else {
            result.setMessage(result.getAcceptedProducts().size() + " products accepted, " +
                    result.getRejectedProducts().size() + " rejected");
        }

        return ResponseEntity.ok(result);
    }
}
