import { checkCompletion, getLeaves } from './RequirementHelper';
import { expect, test } from '@jest/globals'
import { cloneDeep } from 'lodash';


const COURSE_CODE_CSCI1100 = {
  department: 'CSCI',
  code: '1100'
};

const COURSE_CODE_CSCI1200 = {
  department: 'CSCI',
  code: '1200'
};

const COURSE_CODE_CSCI2200 = {
  department: 'CSCI',
  code: '2200'
};

const COURSE_CODE_CSCI2300 = {
  department: 'CSCI',
  code: '2300'
};

const COURSE_CODE_CSCI2600 = {
  department: 'CSCI',
  code: '2600'
};

const COURSE_CODE_CSCI4440 = {
  department: 'CSCI',
  code: '4440'
};

const COURSE_CODE_MATH1010 = {
  department: 'MATH',
  code: '1010'
};

const COURSE_CODE_MATH1020 = {
  department: 'MATH',
  code: '1020'
};

const COURSE_CODE_MATH2010 = {
  department: 'MATH',
  code: '2010'
};

const COURSE_CODE_MATH2400 = {
  department: 'MATH',
  code: '2400'
};

const ALL_COURSES = [
  cloneDeep(COURSE_CODE_CSCI1100),
  cloneDeep(COURSE_CODE_CSCI1200),
  cloneDeep(COURSE_CODE_CSCI2200),
  cloneDeep(COURSE_CODE_CSCI2300),
  cloneDeep(COURSE_CODE_CSCI2600),
  cloneDeep(COURSE_CODE_CSCI4440),
  cloneDeep(COURSE_CODE_MATH1010),
  cloneDeep(COURSE_CODE_MATH1020),
  cloneDeep(COURSE_CODE_MATH2010),
  cloneDeep(COURSE_CODE_MATH2400),
];

const NO_COURSES = [];

// Simple requirements

const ALLOF_ALLCOURSES_FLAT = {
  allOf: cloneDeep(ALL_COURSES)
};

const ALLOF_ALLCOURSES_OPTIONAL = {
  allOf: cloneDeep(ALL_COURSES),
  optional: true
}

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

// Advanced (nested) requirements

// Primitives
const INTRO_CSCI = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI1100),
    cloneDeep(COURSE_CODE_CSCI1200)
  ]
}

const FRESHMAN_CSCI = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI1100),
    cloneDeep(COURSE_CODE_CSCI1200),
    cloneDeep(COURSE_CODE_CSCI2200)
  ]
}

const INTERMEDIATE_CSCI = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI2200),
    cloneDeep(COURSE_CODE_CSCI2300),
  ]
}

const SOFTWARE_DEVELOPMENT = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI2600),
    cloneDeep(COURSE_CODE_CSCI4440),
  ]
}

const NON_FRESHMAN_CSCI = {
  allOf: [
    cloneDeep(COURSE_CODE_CSCI2300),
    cloneDeep(COURSE_CODE_CSCI2600),
    cloneDeep(COURSE_CODE_CSCI4440),
  ]
}

const INTRO_MATH = {
  allOf: [
    cloneDeep(COURSE_CODE_MATH1010),
    cloneDeep(COURSE_CODE_MATH1020),
  ]
}

const MATH_OPTION = {
  nOf: [
    cloneDeep(COURSE_CODE_MATH2010),
    cloneDeep(COURSE_CODE_MATH2400),
  ],
  n: 1,
}

const MATH_REQUIREMENT = {
  allOf: [
    cloneDeep(INTRO_MATH),
    cloneDeep(MATH_OPTION)
  ]
}

const UNIQUE_NESTED_REQUIREMENTS = [
  cloneDeep(FRESHMAN_CSCI),
  cloneDeep(NON_FRESHMAN_CSCI),
  cloneDeep(MATH_REQUIREMENT)
]

const PIGEONHOLE_REQUIREMENTS = [
  cloneDeep(FRESHMAN_CSCI),
  cloneDeep(NON_FRESHMAN_CSCI),
  cloneDeep(INTRO_CSCI),
  cloneDeep(INTERMEDIATE_CSCI),
  cloneDeep(SOFTWARE_DEVELOPMENT),
];

const ALL_ADVANCED_REQUIREMENT_LEAVES = [
  cloneDeep(COURSE_CODE_CSCI1100),
  cloneDeep(COURSE_CODE_CSCI1200),
  cloneDeep(COURSE_CODE_CSCI2200),
  cloneDeep(COURSE_CODE_CSCI2300),
  cloneDeep(COURSE_CODE_CSCI2600),
  cloneDeep(COURSE_CODE_CSCI4440),
  cloneDeep(COURSE_CODE_MATH1010),
  cloneDeep(COURSE_CODE_MATH1020),
  cloneDeep(COURSE_CODE_MATH2010),
  cloneDeep(COURSE_CODE_MATH2400),
]

const ALL_PIGEONHOLE_REQUIREMENT_LEAVES = [
  cloneDeep(COURSE_CODE_CSCI1100),
  cloneDeep(COURSE_CODE_CSCI1200),
  cloneDeep(COURSE_CODE_CSCI2200),
  cloneDeep(COURSE_CODE_CSCI2300),
  cloneDeep(COURSE_CODE_CSCI2600),
  cloneDeep(COURSE_CODE_CSCI4440),
]

const UNIQUE_NESTED_REQUIREMENTS_NORMAL = {
  allOf: cloneDeep(UNIQUE_NESTED_REQUIREMENTS)
}

const UNIQUE_NESTED_REQUIREMENTS_1_OF = {
  nOf: cloneDeep(UNIQUE_NESTED_REQUIREMENTS),
  n: 1
}

const UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT = {
  allOf: cloneDeep(UNIQUE_NESTED_REQUIREMENTS),
  independentRequirements: true
}

const PIGEONHOLE_REQUIREMENTS_NORMAL = {
  allOf: cloneDeep(PIGEONHOLE_REQUIREMENTS)
}

const PIGEONHOLE_REQUIREMENTS_1_OF = {
  nOf: cloneDeep(PIGEONHOLE_REQUIREMENTS),
  n: 1
}

const PIGEONHOLE_REQUIREMENTS_INDEPENDENT = {
  allOf: cloneDeep(PIGEONHOLE_REQUIREMENTS),
  independentRequirements: true
}

// GetLeaves
test('getLeaves on single course returns array containing self', () => {
  expect(getLeaves(cloneDeep(COURSE_CODE_CSCI1200))).toEqual(expect.arrayContaining([COURSE_CODE_CSCI1200]));
});

test('getLeaves on flat requirement returns array containing direct sub-requirements', () => {
  expect(getLeaves(ALLOF_ALLCOURSES_FLAT)).toEqual(expect.arrayContaining(ALL_COURSES));
});

test('getLeaves on nested requirement returns array containing all leaves', () => {
  expect(getLeaves(UNIQUE_NESTED_REQUIREMENTS_NORMAL)).toEqual(expect.arrayContaining(ALL_ADVANCED_REQUIREMENT_LEAVES));
})

test('getLeaves on pigeonhole requirement returns array containing all leaves, potentially with some repeated', () => {
  expect(getLeaves(PIGEONHOLE_REQUIREMENTS_NORMAL)).toEqual(expect.arrayContaining(ALL_PIGEONHOLE_REQUIREMENT_LEAVES));
})

// Any optional requirement is skipped
test('Optional requirements can be skipped', () => {
  expect(checkCompletion(ALLOF_ALLCOURSES_OPTIONAL, NO_COURSES)).toBeTruthy();
})

// Single course requirement
test('Single course requirement is not completed by empty courses list', () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), NO_COURSES)).toBeFalsy();
});

test('Single course requirement is completed by course in question', () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), [COURSE_CODE_CSCI1100])).toBeTruthy();
});

test('Single course requirement is not completed by wrong course', () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), [COURSE_CODE_CSCI1200])).toBeFalsy();
});

test('Single course requirement is completed by list of courses that includes required course', () => {
  expect(checkCompletion(cloneDeep(COURSE_CODE_CSCI1100), ALL_COURSES)).toBeTruthy();
});

// Flat allOf requirement
test('AllOf requirement is not completed by empty courses list', () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test('AllOf requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('AllOf requirement is not completed by multiple courses that don\'t include every course in requirement', () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeFalsy();
});

test('AllOf requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test('AllOf requirement is completed by list of all courses', () => {
  expect(checkCompletion(ALLOF_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});

// Flat nOf 1 requirement 
test('NOF_1 requirement is not completed by empty courses list', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test('NOF_1 requirement is completed by single course in requirement', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeTruthy();
});

test('NOF_1 requirement is not completed by single course not in requirement', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('NOF_1 requirement is completed by multiple courses that include courses not in requirement plus one in requirement', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeTruthy();
});

test('NOF_1 requirement is completed by multiple courses that include courses not in requirement plus one in requirement (order swapped)', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI2200, COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2300])).toBeTruthy();
});

test('NOF_1 requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test('NOF_1 requirement is completed by list of all courses', () => {
  expect(checkCompletion(NOF_1_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});

// Flat nOf 2 requirement 
test('NOF_2 requirement is not completed by empty courses list', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, NO_COURSES)).toBeFalsy();
});

test('NOF_2 requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('NOF_2 requirement is not completed by two courses not in requirement', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('NOF_2 requirement is completed by two courses in requirement', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200])).toBeTruthy();
});

test('NOF_2 requirement is completed by multiple courses that include courses not in requirement', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeTruthy();
});

test('NOF_2 requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, [COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200, COURSE_CODE_CSCI2200, COURSE_CODE_CSCI2300])).toBeTruthy();
});

test('NOF_2 requirement is completed by list of all courses', () => {
  expect(checkCompletion(NOF_2_REQUIREMENT_FLAT, ALL_COURSES)).toBeTruthy();
});

// Normal nested requirement
test('Normal nested requirement is not completed by empty courses list', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_NORMAL, NO_COURSES)).toBeFalsy();
});

test('Normal nested requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_NORMAL, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('Normal nested requirement is not completed by single sub-requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_NORMAL, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('Normal nested requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_NORMAL, ALL_ADVANCED_REQUIREMENT_LEAVES)).toBeTruthy();
});

test('Normal nested requirement is completed by list of all courses', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_NORMAL, ALL_COURSES)).toBeTruthy();
});

// 1-of nested requirement
test('1-of nested requirement is not completed by empty courses list', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, NO_COURSES)).toBeFalsy();
});

test('1-of nested requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('1-of nested requirement is not completed by multiple incomplete sub-requirements', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeFalsy();
});

test('1-of nested requirement is completed by single sub-requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeTruthy();
});

test('1-of nested requirement is completed by single sub-requirement plus courses from another sub-requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440, COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test('1-of nested requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, ALL_ADVANCED_REQUIREMENT_LEAVES)).toBeTruthy();
});

test('1-of nested requirement is completed by list of all courses', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_1_OF, ALL_COURSES)).toBeTruthy();
});

// Independent nested requirement (should have identical behavior to normal nested, as courses in this test case are only in a single bucket)
test('Independent nested requirement is not completed by empty courses list', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT, NO_COURSES)).toBeFalsy();
});

test('Independent nested requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('Independent nested requirement is not completed by single sub-requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('Independent nested requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT, ALL_ADVANCED_REQUIREMENT_LEAVES)).toBeTruthy();
});

test('Independent nested requirement is completed by list of all courses', () => {
  expect(checkCompletion(UNIQUE_NESTED_REQUIREMENTS_INDEPENDENT, ALL_COURSES)).toBeTruthy();
});

// Normal pigeonhole requirement that can't actually be completed
test('Normal pigeonhole requirement is not completed by empty courses list', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, NO_COURSES)).toBeFalsy();
});

test('Normal pigeonhole requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('Normal pigeonhole requirement is not completed by single sub-requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('Normal pigeonhole requirement is not completed by list of all courses in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, ALL_PIGEONHOLE_REQUIREMENT_LEAVES)).toBeFalsy();
});

test('Normal pigeonhole requirement is not completed by list of all courses', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, ALL_COURSES)).toBeFalsy();
});

test('Normal pigeonhole requirement cannot be cheesed by taking the same course multiple times', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_NORMAL, [
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
    cloneDeep(ALL_COURSES),
  ].flat())).toBeFalsy();
})

// 1-of pigeonhole requirement
test('1-of pigeonhole requirement is not completed by empty courses list', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, NO_COURSES)).toBeFalsy();
});

test('1-of pigeonhole requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('1-of pigeonhole requirement is not completed by multiple incomplete sub-requirements', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('1-of pigeonhole requirement is completed by single sub-requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeTruthy();
});

test('1-of pigeonhole requirement is completed by single sub-requirement plus courses from another sub-requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440, COURSE_CODE_CSCI1100, COURSE_CODE_CSCI1200])).toBeTruthy();
});

test('1-of pigeonhole requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, ALL_PIGEONHOLE_REQUIREMENT_LEAVES)).toBeTruthy();
});

test('1-of pigeonhole requirement is completed by list of all courses', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_1_OF, ALL_COURSES)).toBeTruthy();
});

// Independent pigeonhole requirement
test('Independent pigeonhole requirement is not completed by empty courses list', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_INDEPENDENT, NO_COURSES)).toBeFalsy();
});

test('Independent pigeonhole requirement is not completed by single course in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_INDEPENDENT, [COURSE_CODE_CSCI1100])).toBeFalsy();
});

test('Independent pigeonhole requirement is not completed by single sub-requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_INDEPENDENT, [COURSE_CODE_CSCI2300, COURSE_CODE_CSCI2600, COURSE_CODE_CSCI4440])).toBeFalsy();
});

test('Independent pigeonhole requirement is completed by list of all courses in requirement', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_INDEPENDENT, ALL_PIGEONHOLE_REQUIREMENT_LEAVES)).toBeTruthy();
});

test('Independent pigeonhole requirement is completed by list of all courses', () => {
  expect(checkCompletion(PIGEONHOLE_REQUIREMENTS_INDEPENDENT, ALL_COURSES)).toBeTruthy();
});