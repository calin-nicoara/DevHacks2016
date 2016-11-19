package com.madSckillsExeption.resources.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class UserSubjectModel {

    private Long id;
    private String name;
    private Long skillLevel;
    private String imageLink;
}
