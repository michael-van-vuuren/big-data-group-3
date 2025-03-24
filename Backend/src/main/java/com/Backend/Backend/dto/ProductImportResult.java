package com.Backend.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductImportResult {
    private List<ProductResponseDTO> acceptedProducts;
    private List<ProductResponseDTO> rejectedProducts;
    private List<String> rejectionReasons;
    private String message;

    public ProductImportResult(List<ProductResponseDTO> acceptedProducts,
                               List<ProductResponseDTO> rejectedProducts,
                               List<String> rejectionReasons) {
        this.acceptedProducts = acceptedProducts;
        this.rejectedProducts = rejectedProducts;
        this.rejectionReasons = rejectionReasons;
    }

    public ProductImportResult(List<ProductResponseDTO> acceptedProducts,
                               List<ProductResponseDTO> rejectedProducts,
                               List<String> rejectionReasons,
                               String message) {
        this(acceptedProducts, rejectedProducts, rejectionReasons);
        this.message = message;
    }
}

