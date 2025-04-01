package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;

    public static ProductResponseDTO fromProduct(Product product) {
        if (product == null) return null;

        ProductResponseDTO dto = new ProductResponseDTO();
        dto.id = product.getId();
        dto.name = product.getName();
        return dto;
    }

    public static ProductResponseDTO fromProductDTO(ProductDTO productDTO) {
        if (productDTO == null) return null;

        ProductResponseDTO dto = new ProductResponseDTO();
        dto.name = productDTO.getName();
        return dto;
    }
}
