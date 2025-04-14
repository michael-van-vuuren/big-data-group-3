package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Product;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
    private Long beanId;
    private String name;
    private String image;
    private String webpage;
    private BigDecimal gram;
    private String roastDegree;
    private String availability;
    private BigDecimal price;
    private BigDecimal pricePerCup;
    private BigDecimal bulkPricePerCup;

//    private RoasterDTO roaster;
//
//    private ProcessDTO process;
//
//    private List<FlavorDTO> flavors;
//
//    private List<ProducerDTO> producers;

    public static ProductResponseDTO fromEntity(Product product) {
        return new ProductResponseDTO(
                product.getBeanId(),
                product.getName(),
                product.getImage(),
                product.getWebpage(),
                product.getGram(),
                product.getRoastDegree(),
                product.getAvailability().name(),
                product.getPrice(),
                product.getPricePerCup(),
                product.getBulkPricePerCup()
//                RoasterDTO.fromEntity(product.getRoaster()),
//                ProcessDTO.fromEntity(product.getProcess()),
//                product.getFlavors().stream().map(FlavorDTO::fromEntity).toList(),
//                product.getProducers().stream().map(ProducerDTO::fromEntity).toList()
        );
    }

}
