package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.AppUser;
import com.madSckillsExeption.entities.MentorUserMap;
import com.madSckillsExeption.entities.StudentSubjectMap;
import com.madSckillsExeption.entities.Subject;
import com.madSckillsExeption.repositories.MentorUserMapRepository;
import com.madSckillsExeption.repositories.StudentSubjectMapRepository;
import com.madSckillsExeption.repositories.SubjectRestRepository;
import com.madSckillsExeption.repositories.UserRestRepository;
import com.madSckillsExeption.resources.models.UserSubjectModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/custom/subjects")
public class SubjectsCustomResource {

    private StudentSubjectMapRepository subjectMapRepository;
    private SubjectRestRepository subjectRestRepository;
    private MentorUserMapRepository mentorUserMapRepository;
    private UserRestRepository userRestRepository;

    @Autowired
    public SubjectsCustomResource(StudentSubjectMapRepository subjectMapRepository,
                                  SubjectRestRepository subjectRestRepository,
                                  MentorUserMapRepository mentorUserMapRepository, UserRestRepository userRestRepository) {
        this.subjectMapRepository = subjectMapRepository;
        this.subjectRestRepository = subjectRestRepository;
        this.mentorUserMapRepository = mentorUserMapRepository;
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

    @PostMapping(value = "/student")
    @Transactional
    public void saveUserSubjects(@RequestParam("userId") Long userId, @RequestBody List<Long> selectedSubjects) {

        AppUser appUser = userRestRepository.findOne(userId);

        if(appUser != null) {
            List<StudentSubjectMap> studentSubjectMaps = selectedSubjects.stream()
                    .map(subjectId -> StudentSubjectMap
                            .builder()
                            .user(appUser)
                            .subject(Subject.builder().id(subjectId).build())
                            .skillLevel(0L)
                            .build())
                    .collect(Collectors.toList());
            subjectMapRepository.save(studentSubjectMaps);
        }
    }

    @PostMapping(value = "/mentor")
    @Transactional
    public void saveUserSubjectsForMentor(@RequestParam("userId") Long userId, @RequestBody List<Long> selectedSubjects) {

        AppUser appUser = userRestRepository.findOne(userId);

        if(appUser != null) {
            List<MentorUserMap> studentSubjectMaps = selectedSubjects.stream()
                    .map(subjectId -> MentorUserMap
                            .builder()
                            .user(appUser)
                            .subject(Subject.builder().id(subjectId).build())
                            .skillLevel(0L)
                            .build())
                    .collect(Collectors.toList());
            mentorUserMapRepository.save(studentSubjectMaps);
        }
    }

}
