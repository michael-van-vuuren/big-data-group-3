package com.Backend.Backend.controller;

import java.util.List;
import java.util.Map;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.dto.ProductImportResult;
import com.Backend.Backend.dto.ProductResponseDTO;
import com.Backend.Backend.entity.Product;
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
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) { // Return JSON, e.g., Map
        boolean deleted = productService.deleteProductById(id);
        if (deleted) {
            Map<String, String> successBody = Map.of("message", "Product deleted successfully.");
            return ResponseEntity.ok(successBody);
        } else {
            Map<String, String> errorBody = Map.of("message", "Product not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
        }
    }

    @GetMapping("/by-flavors")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByFlavors(
            @RequestParam List<String> flavors,
            @RequestParam(name = "strict", required = false, defaultValue = "false") boolean isStrictSearch
    ) {
        List<Product> products = productService.getProductsByFlavors(flavors, isStrictSearch);

        List<ProductResponseDTO> dtos = products.stream()
                .map(ProductResponseDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/by-roaster")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByRoaster(
            @RequestParam(name = "roasterName") String roasterName
    ) {
        List<Product> products = productService.getProductsByRoasterName(roasterName);

        List<ProductResponseDTO> dtos = products.stream()
                .map(ProductResponseDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/by-roaster-country")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByRoasterCountry(
            @RequestParam(name = "countryName") String countryName
    ) {
        List<Product> products = productService.getProductsByRoasterCountry(countryName);

        List<ProductResponseDTO> dtos = products.stream()
                .map(ProductResponseDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(dtos);
    }

}
