package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductImportDTO {
    private Long id;
    private String name;

    public static ProductImportDTO fromProduct(Product product) {
        if (product == null) return null;

        ProductImportDTO dto = new ProductImportDTO();
        dto.id = product.getId();
        dto.name = product.getName();
        return dto;
    }

    public static ProductImportDTO fromProductDTO(ProductDTO productDTO) {
        if (productDTO == null) return null;

        ProductImportDTO dto = new ProductImportDTO();
        dto.name = productDTO.getName();
        return dto;
    }
}
