package com.Backend.Backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProducerDTO {
    private String name;
    private String tag;
    private String elevation;
    private List<RegionDTO> regions;
    private List<CountryDTO> countries;
}