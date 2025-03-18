package com.Backend.Backend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private String beanId;
    private String roaster;
    private String roasterCountry;
    private List<String> flavors;
    private String roastDegree;
}

