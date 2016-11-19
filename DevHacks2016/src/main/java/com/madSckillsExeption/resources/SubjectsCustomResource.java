package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.StudentSubjectMap;
import com.madSckillsExeption.repositories.StudentSubjectMapRepository;
import com.madSckillsExeption.repositories.SubjectRestRepository;
import com.madSckillsExeption.resources.models.UserSubjectModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController("/custom/subjects")
public class SubjectsCustomResource {

    private StudentSubjectMapRepository subjectMapRepository;
    private SubjectRestRepository subjectRestRepository;

    @Autowired
    public SubjectsCustomResource(StudentSubjectMapRepository subjectMapRepository,
                                  SubjectRestRepository subjectRestRepository) {
        this.subjectMapRepository = subjectMapRepository;
        this.subjectRestRepository = subjectRestRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserSubjectModel>> getSubjectModelsByUser(@RequestParam("userId") Long userId) {
        List<StudentSubjectMap> studentSubjectMaps = subjectMapRepository.findByUserId(userId);

        List<UserSubjectModel> userSubjectModels = studentSubjectMaps.stream()
                .map(studentSubjectMap ->
                        UserSubjectModel.builder()
                                .id(studentSubjectMap.getSubject().getId())
                                .name(studentSubjectMap.getSubject().getName())
                                .imageLink(studentSubjectMap.getSubject().getLinkImage())
                                .skillLevel(studentSubjectMap.getSkillLevel())
                                .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(userSubjectModels);
    }
}
