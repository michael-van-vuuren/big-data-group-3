package com.Backend.Backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private Long beanId;
    private String roaster;
    private String roasterCountry;
    private List<String> flavors;
    private String roastDegree;
    private BigDecimal price;
}

