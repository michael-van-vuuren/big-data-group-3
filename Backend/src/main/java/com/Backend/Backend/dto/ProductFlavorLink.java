package com.Backend.Backend.dto;

import java.util.List;

public class ProductFlavorLink {
    private String beanId;
    private List<String> flavors;

    public String getBeanId() {
        return beanId;
    }
    public List<String> getFlavors() {
        return flavors;
    }
}
