package com.Backend.Backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    // Product details
    private Long beanId;
    private String name;
    private String image;
    private String webpage;
    private BigDecimal gram;
    private String roastDegree;
    private String availability;

    // Pricing
    private BigDecimal price;
    private BigDecimal pricePerCup;
    private BigDecimal bulkPricePerCup;

    // Roaster (one-to-many)
    private String roaster;
    private String roasterCountry;

    // Process (one-to-many)
    private String process;
    private String processTag;

    // Flavors (many-to-many)
    private List<String> flavors;

    // Producers (many-to-many) and their regions/countries
    private List<String> producer;
    private String elevation;
    private String producerTag;
    private List<String> producerRegion;
    private List<String> producerCountry;
}

