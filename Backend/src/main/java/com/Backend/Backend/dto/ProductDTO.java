package com.Backend.Backend.dto;

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
public class ProductDTO {
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

    private RoasterDTO roaster;

    private ProcessDTO process;

    private List<FlavorDTO> flavors;

    private List<ProducerDTO> producers;
}
