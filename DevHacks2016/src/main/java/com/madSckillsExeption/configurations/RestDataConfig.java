package com.madSckillsExeption.configurations;

import com.madSckillsExeption.entities.AppUser;
import com.madSckillsExeption.entities.Quiz;
import com.madSckillsExeption.entities.QuizQuestionMap;
import com.madSckillsExeption.entities.StudyGroup;
import com.madSckillsExeption.entities.Subject;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

@Configuration
public class RestDataConfig extends RepositoryRestMvcConfiguration {

    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Subject.class);
        config.exposeIdsFor(StudyGroup.class);
        config.exposeIdsFor(Quiz.class);
        config.exposeIdsFor(QuizQuestionMap.class);
        config.exposeIdsFor(AppUser.class);
    }
}
