package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.AppUser;
import com.madSckillsExeption.entities.StudyGroup;
import com.madSckillsExeption.entities.UserStudyGroupMap;
import com.madSckillsExeption.repositories.UserStudyGroupMapRepository;
import com.madSckillsExeption.resources.models.UserStudyGroupMapModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/custom/userStudyGroupMaps")
public class UserStudyGroupMapCustomResource {

    private UserStudyGroupMapRepository userStudyGroupMapRepository;

    @Autowired
    public UserStudyGroupMapCustomResource(UserStudyGroupMapRepository userStudyGroupMapRepository) {
        this.userStudyGroupMapRepository = userStudyGroupMapRepository;
    }

    @PostMapping
    public ResponseEntity<UserStudyGroupMapModel> post(@RequestBody UserStudyGroupMapModel userStudyGroupMapModel) {
        UserStudyGroupMap userStudyGroupMap = userStudyGroupMapRepository.save(UserStudyGroupMap.builder()
                .studyGroup(StudyGroup.builder().id(userStudyGroupMapModel.getStudyGroupId()).build())
                .user(AppUser.builder().id(userStudyGroupMapModel.getUserId()).build())
                .build());

        userStudyGroupMapModel.setId(userStudyGroupMap.getId());

        return ResponseEntity.ok(userStudyGroupMapModel);
    }
}
