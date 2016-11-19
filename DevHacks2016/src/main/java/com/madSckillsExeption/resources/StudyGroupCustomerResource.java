package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.StudyGroup;
import com.madSckillsExeption.entities.Subject;
import com.madSckillsExeption.repositories.StudyGroupRestRepository;
import com.madSckillsExeption.repositories.UserStudyGroupMapRepository;
import com.madSckillsExeption.resources.models.StudyGroupModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/custom/studyGroups")
public class StudyGroupCustomerResource {

    private StudyGroupRestRepository studyGroupRestRepository;
    private UserStudyGroupMapRepository userStudyGroupMapRepository;

    @Autowired
    public StudyGroupCustomerResource(StudyGroupRestRepository studyGroupRestRepository,
                                      UserStudyGroupMapRepository userStudyGroupMapRepository) {
        this.studyGroupRestRepository = studyGroupRestRepository;
        this.userStudyGroupMapRepository = userStudyGroupMapRepository;
    }

    @GetMapping(params = {"hasMentor", "subjectId"})
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

    @GetMapping(params = {"userId"})
    public ResponseEntity<List<StudyGroupModel>> getStudyGroupsByUser(@RequestParam("userId") Long userId) {
        List<StudyGroupModel> userStudyGroupMaps = userStudyGroupMapRepository.findByUserId(userId)
                .stream().map(userStudyGroupMap -> {
                    Subject subject = userStudyGroupMap.getStudyGroup().getSubject();
                    StudyGroup studyGroup = userStudyGroupMap.getStudyGroup();

                    return StudyGroupModel.builder()
                            .id(studyGroup.getId())
                            .linkImage(subject.getLinkImage())
                            .name(studyGroup.getName())
                            .slackLink(studyGroup.getSlackLink())
                            .subjectId(subject.getId())
                            .subjectName(subject.getName())
                            .mentorId(studyGroup.getMentor().getId())
                            .build();
                }).collect(Collectors.toList());

        return ResponseEntity.ok(userStudyGroupMaps);
    }

    @GetMapping(params = {"mentorUserId"})
    public ResponseEntity<List<StudyGroupModel>> getStudyGroupsByMentorUserID(@RequestParam("mentorUserId") Long mentorUserId) {
        List<StudyGroupModel> userStudyGroupMaps = studyGroupRestRepository.findByMentorId(mentorUserId)
                .stream().map(studyGroup -> {
                    Subject subject = studyGroup.getSubject();

                    return StudyGroupModel.builder()
                            .id(studyGroup.getId())
                            .linkImage(subject.getLinkImage())
                            .name(studyGroup.getName())
                            .slackLink(studyGroup.getSlackLink())
                            .subjectId(subject.getId())
                            .subjectName(subject.getName())
                            .mentorId(studyGroup.getMentor().getId())
                            .build();
                }).collect(Collectors.toList());

        return ResponseEntity.ok(userStudyGroupMaps);
    }
}
