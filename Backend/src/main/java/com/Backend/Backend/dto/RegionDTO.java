package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Region;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegionDTO {
    private String name;

    public static RegionDTO fromEntity(Region region) {
        if (region == null) {
            return null;
        }
        return new RegionDTO(region.getName());
    }
}