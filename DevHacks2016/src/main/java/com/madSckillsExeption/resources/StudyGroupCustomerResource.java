package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.StudyGroup;
import com.madSckillsExeption.repositories.StudyGroupRestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/custom/studyGroups")
public class StudyGroupCustomerResource {

    private StudyGroupRestRepository studyGroupRestRepository;

    @Autowired
    public StudyGroupCustomerResource(StudyGroupRestRepository studyGroupRestRepository) {
        this.studyGroupRestRepository = studyGroupRestRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudyGroup>> getGroupsBySubjectWithoutMentors(@RequestParam("hasMentor") Boolean hasMentor,
                                                                       @RequestParam("subjectId") Long subjectId) {
        List<StudyGroup> studyGroups;

        if(hasMentor) {
            studyGroups = studyGroupRestRepository.findBySubjectIdAndMentorNotNull(subjectId);
        } else {
            studyGroups = studyGroupRestRepository.findBySubjectIdAndMentorIsNull(subjectId);
        }

        return ResponseEntity.ok(studyGroups);

    }
}
