package com.Backend.Backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long beanId;
    private String name;
    private String roaster;
    private String roasterCountry;
    private List<String> flavors;
    private String roastDegree;
    private BigDecimal price;
    private String process;
    private String processTag;
    private List<String> producer;
    private String elevation;
    private List<String> producerRegion;
    private List<String> producerCountry;
}

