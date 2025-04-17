package com.Backend.Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductImportResult {
    private List<ProductImportDTO> acceptedProducts;
    private List<ProductImportDTO> rejectedProducts;
    private List<String> rejectionReasons;
    private String message;

    public ProductImportResult(List<ProductImportDTO> acceptedProducts,
                               List<ProductImportDTO> rejectedProducts,
                               List<String> rejectionReasons) {
        this.acceptedProducts = acceptedProducts;
        this.rejectedProducts = rejectedProducts;
        this.rejectionReasons = rejectionReasons;
    }

    public ProductImportResult(List<ProductImportDTO> acceptedProducts,
                               List<ProductImportDTO> rejectedProducts,
                               List<String> rejectionReasons,
                               String message) {
        this(acceptedProducts, rejectedProducts, rejectionReasons);
        this.message = message;
    }
}

