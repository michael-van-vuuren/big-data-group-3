package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Producer;
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

    public static ProducerDTO fromEntity(Producer producer) {
        if (producer == null) {
            return null;
        }
        return new ProducerDTO(
                producer.getName(),
                producer.getTags(),
                producer.getElevation(),
                producer.getRegions().stream().map(RegionDTO::fromEntity).toList(),
                producer.getCountries().stream().map(CountryDTO::fromEntity).toList()
        );
    }
}