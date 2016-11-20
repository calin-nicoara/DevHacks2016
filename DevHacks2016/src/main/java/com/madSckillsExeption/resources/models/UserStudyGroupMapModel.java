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
public class UserStudyGroupMapModel {

    private Long id;

    private Long userId;

    private Long studyGroupId;
}
