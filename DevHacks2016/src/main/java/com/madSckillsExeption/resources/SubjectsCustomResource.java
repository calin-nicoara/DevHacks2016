package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.StudentSubjectMap;
import com.madSckillsExeption.repositories.StudentSubjectMapRepository;
import com.madSckillsExeption.repositories.SubjectRestRepository;
import com.madSckillsExeption.repositories.UserRestRepository;
import com.madSckillsExeption.resources.models.UserSubjectModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/custom/subjects")
public class SubjectsCustomResource {

    private StudentSubjectMapRepository subjectMapRepository;
    private SubjectRestRepository subjectRestRepository;
    private UserRestRepository userRestRepository;

    @Autowired
    public SubjectsCustomResource(StudentSubjectMapRepository subjectMapRepository,
                                  SubjectRestRepository subjectRestRepository,
                                  UserRestRepository userRestRepository) {
        this.subjectMapRepository = subjectMapRepository;
        this.subjectRestRepository = subjectRestRepository;
        this.userRestRepository = userRestRepository;
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

    @PostMapping
    @Transactional
    public void saveUserSubjects(@RequestParam("userId") Long userId, @RequestBody Map<Long, Boolean> selectedSubjects) {

        for(Long selectedSubjectId : selectedSubjects.keySet()) {
            if(!subjectMapRepository.findByUserIdAndSubjectId(userId, selectedSubjectId).isEmpty() && !selectedSubjects.get(selectedSubjectId)) {
                subjectMapRepository.deleteByUserIdAndSubjectId(userId, selectedSubjectId);
            } else if (subjectMapRepository.findByUserIdAndSubjectId(userId, selectedSubjectId).isEmpty() && selectedSubjects.get(selectedSubjectId)) {
                StudentSubjectMap studentSubjectMap = new StudentSubjectMap();
                studentSubjectMap.setUser(userRestRepository.getOne(userId));
                studentSubjectMap.setSubject(subjectRestRepository.getOne(selectedSubjectId));
                studentSubjectMap.setSkillLevel(0L);
                subjectMapRepository.save(studentSubjectMap);
            }
        }
    }
}
