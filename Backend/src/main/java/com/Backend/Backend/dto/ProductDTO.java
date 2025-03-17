package com.Backend.Backend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private String beanId;
    private String roasterName;
    private List<String> flavorNames;
}

