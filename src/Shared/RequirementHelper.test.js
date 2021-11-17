import { checkCompletion, getLeaves } from "./RequirementHelper";
import { describe, expect, test } from '@jest/globals'
import { cloneDeep } from "lodash";


const COURSE_CODE_CSCI1100 = {
  department: "CSCI",
  code: "1100"
};

const COURSE_CODE_CSCI1200 = {
  department: "CSCI",
  code: "1200"
};

const COURSE_CODE_CSCI2200 = {
  department: "CSCI",
  code: "2200"
};

const COURSE_CODE_CSCI2300 = {
  department: "CSCI",
  code: "2300"
};

const COURSE_CODE_CSCI2600 = {
  department: "CSCI",
  code: "2600"
};

const COURSE_CODE_CSCI4440 = {
  department: "CSCI",
  code: "4440"
};

const ALL_COURSES = [
  cloneDeep(COURSE_CODE_CSCI1100),
  cloneDeep(COURSE_CODE_CSCI1200),
  cloneDeep(COURSE_CODE_CSCI2200),
  cloneDeep(COURSE_CODE_CSCI2300),
  cloneDeep(COURSE_CODE_CSCI2600),
  cloneDeep(COURSE_CODE_CSCI4440)
];

const NO_COURSES = [];

const ALLOF_ALLCOURSES_FLAT = {
  allOf: cloneDeep(ALL_COURSES)
};

const ALLOF_REQUIREMENT_FLAT = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI1100),
    cloneDeep(COURSE_CODE_CSCI1200)
  ]
};

const NOF_1_REQUIREMENT_FLAT = {
  nOf: [
    cloneDeep(COURSE_CODE_CSCI1100),
    cloneDeep(COURSE_CODE_CSCI1200)
  ],
  n: 1
};

const NOF_2_REQUIREMENT_FLAT = {
  nOf: [
    cloneDeep(COURSE_CODE_CSCI1100),
    cloneDeep(COURSE_CODE_CSCI1200),
    cloneDeep(COURSE_CODE_CSCI2200),
    cloneDeep(COURSE_CODE_CSCI2300)
  ],
  n: 2
};


// GetLeaves
test("getLeaves on single course returns array containing self", () => {
  expect(getLeaves(COURSE_CODE_CSCI1200)).toEqual(expect.arrayContaining([COURSE_CODE_CSCI1200]));
});

test("getLeaves on flat requirement returns array containing direct sub-requirements", () => {
  expect(getLeaves(ALLOF_ALLCOURSES_FLAT)).toEqual(expect.arrayContaining(ALL_COURSES));
});

// Single course requirement
test("Single course requirement is not completed by empty courses list", () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), NO_COURSES)).toBeFalsy();
});

test("Single course requirement is completed by course in question", () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), [COURSE_CODE_CSCI1100])).toBeTruthy();
});

test("Single course requirement is not completed by wrong course", () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), [COURSE_CODE_CSCI1200])).toBeFalsy();
});

test("Single course requirement is completed by list of courses that includes required course", () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), ALL_COURSES)).toBeTruthy();
});

// Flat allOf requirement
test("AllOf requirement is not completed by empty courses list", () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test("AllOf requirement is not completed by single course in requirement", () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test("AllOf requirement is not completed by multiple courses that don't include every course in requirement", () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeFalsy();
});

test("AllOf requirement is completed by list of all courses in requirement", () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test("AllOf requirement is completed by list of all courses", () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});

// Flat nOf 1 requirement 
test("NOF_1 requirement is not completed by empty courses list", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test("NOF_1 requirement is completed by single course in requirement", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeTruthy();
});

test("NOF_1 requirement is not completed by single course not in requirement", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI4440])).toBeFalsy();
});

test("NOF_1 requirement is completed by multiple courses that include courses not in requirement plus one in requirement", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeTruthy();
});

test("NOF_1 requirement is completed by list of all courses in requirement", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test("NOF_1 requirement is completed by list of all courses", () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});

// Flat nOf 2 requirement 
test("NOF_2 requirement is not completed by empty courses list", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test("NOF_2 requirement is not completed by single course in requirement", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test("NOF_2 requirement is not completed by two courses not in requirement", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test("NOF_2 requirement is completed by two courses in requirement", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200])).toBeTruthy();
});

test("NOF_2 requirement is completed by multiple courses that include courses not in requirement", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeTruthy();
});

test("NOF_2 requirement is completed by list of all courses in requirement", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeTruthy();
});

test("NOF_2 requirement is completed by list of all courses", () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});