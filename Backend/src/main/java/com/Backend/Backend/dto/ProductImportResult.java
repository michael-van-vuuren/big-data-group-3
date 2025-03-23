package com.Backend.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductImportResult {
    private List<AcceptedProductDTO> acceptedProducts;
    private List<RejectedProductDTO> rejectedProducts;
    private String message;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class AcceptedProductDTO {
        private ProductDTO product;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class RejectedProductDTO {
        private ProductDTO product;
        private String reason;
    }

    public ProductImportResult(List<AcceptedProductDTO> acceptedProducts, List<RejectedProductDTO> rejectedProducts) {
        this.acceptedProducts = acceptedProducts;
        this.rejectedProducts = rejectedProducts;
    }
}
