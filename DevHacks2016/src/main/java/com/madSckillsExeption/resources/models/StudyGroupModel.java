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
public class StudyGroupModel {
    private Long id;

    private String name;

    private String slackLink;

    private Long subjectId;

    private String subjectName;

    private String linkImage;

    private Long mentorId;
}
