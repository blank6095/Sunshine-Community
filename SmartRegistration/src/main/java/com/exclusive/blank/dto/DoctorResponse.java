package com.exclusive.blank.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DoctorResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("departmentId")
    private Long departmentId;

    @JsonProperty("departmentName")
    private String departmentName;

    @JsonProperty("title")
    private String title;

    @JsonProperty("specialty")
    private String specialty;

    @JsonProperty("bio")
    private String bio;

    @JsonProperty("status")
    private String status;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("userEmail")
    private String userEmail;

    @JsonProperty("userPhone")
    private String userPhone;

    public DoctorResponse() {
    }

    public DoctorResponse(Long id, Long userId, Long departmentId, String departmentName, String title, String specialty, String bio, String status, String userName, String userEmail, String userPhone) {
        this.id = id;
        this.userId = userId;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.title = title;
        this.specialty = specialty;
        this.bio = bio;
        this.status = status;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }
}
