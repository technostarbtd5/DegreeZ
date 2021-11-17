import { some, cloneDeep, range } from 'lodash';

// Simple toggle for debugging
const DEBUG_MODE = false;

/**
 * An object representing a course's code. 
 * @typedef {Object} CourseCode
 * @property {String} department Department code.
 * @property {String} code Numeric course code.
 */

/**
 * A requirement object representing a list of sub-requirements that all must be completed to complete the requirement. Equivalent to an NOfRequirement where n is set to the length of the sub-requirement array.
 * @typedef {Object} AllOfRequirement
 * @property {Requirement[]} allOf Sub-requirements.
 * @property {String} requirementName Optional. Represents a short text blurb describing the requirement.
 * @property {Boolean} independentRequirements Optional. If set to true, a course passed to this requirement may be used to satisfy multiple sub-requirements. Otherwise, each course can only satisfy one requirement at most.
 */

/**
 * A requirement object representing a list of sub-requirements, of which n must be completed to complete the requirement. Equivalent to an NOfRequirement where n is set to the length of the sub-requirement array. 
 * @typedef {Object} NOfRequirement
 * @property {Requirement[]} nOf Sub-requirements.
 * @property {Number} n Number of sub-requirements that must be satisfied to complete this requirement.
 * @property {String} requirementName Optional. Represents a short text blurb describing the requirement.
 * @property {Boolean} independentRequirements Optional. If set to true, a course passed to this requirement may be used to satisfy multiple sub-requirements. Otherwise, each course can only satisfy one requirement at most.
 */

/**
 * An object representing a requirement of some kind.
 * @typedef {CourseCode | AllOfRequirement | NOfRequirement} Requirement
 */

/**
 * Check whether a list of courses satisfies a requirement. 
 * Warning: This function is NP-complete in the worst-case. 
 * @param {Requirement} requirement Requirement object.
 * @param {CourseCode[]} courses A list of courses.
 * @returns boolean of whether or not a requirement is satisfied by a set of courses
 */
export function checkCompletion(requirement, courses) {
  if (DEBUG_MODE) {
    console.log(`Checking completion for requirement ${JSON.stringify(requirement)} with courses ${JSON.stringify(courses)}`)
  }
  if (isCourse(requirement)) {
    return some(courses, requirement);
  }
  if (requirement.independentRequirements) {
    const fullDistribution = getRequirements(requirement).map(() => courses);
    return testDistribution(requirement, fullDistribution);
  } else {
    const emptyDistribution = getRequirements(requirement).map(() => []);
    return testAllDistributions(requirement, courses, emptyDistribution, 0);
  }
}

/**
 * Helper function for checkCompletion.
 * @param {Requirement} requirement Requirement object. Cannot be course.
 * @param {CourseCode[]} courses Array of course code objects to allocate to requirements
 * @param {CourseCode[][]} distribution 2D course code object array representing the allocation of courses to requirements. Length of outer array must match length of getRequirements(requirement).
 * @param {Number} courseIndex Active index of the course to be allocated to a requirement. If index == courses.length, dispatch checkCompletion again.
 * @returns Boolean of whether or not requirement can be satisfied either by the current distribution of courses or by adding courses at indices >= courseIndex to one of the distribution pools.
 */
function testAllDistributions(requirement, courses, distribution, courseIndex) {
  if (testDistribution(requirement, distribution)) return true;
  if (courseIndex < courses.length) {
    // Optimization: Since only up to n requirements need to be fulfilled, only test course distributions using up to n requirements.
    const numActivelyTestedRequirements = distribution.map(requirementCourses => requirementCourses.length).filter(length => length).length;
    for (const reqIndex in range(distribution.length)) {
      const newDistribution = cloneDeep(distribution);
      const newCourse = courses[courseIndex];
      const newCourseIndex = courseIndex + 1;
      const subReq = getRequirements(requirement)[reqIndex];
      if (DEBUG_MODE) {
        console.log(`Testing adding ${JSON.stringify(newCourse)} (reqIndex: ${reqIndex}) to subreq ${JSON.stringify(subReq)} on distribution ${JSON.stringify(newDistribution)} with newCourseIndex ${newCourseIndex} and ${numActivelyTestedRequirements} actively tested requirements versus ${getN(requirement)} max tested requirements`);
      }
      if (newDistribution[reqIndex].length || numActivelyTestedRequirements < getN(requirement)) {
        // Optimization: Don't try to test using a course on a requirement if it's not one of the requirement's leaves.
        if (some(getLeaves(subReq), newCourse)) {
          newDistribution[reqIndex].push(newCourse);
          if (testAllDistributions(requirement, courses, newDistribution, newCourseIndex)) return true;
        }
      }
    }
  }
  return false;
}

/**
 * Helper function for checkCompletion.
 * @param {Requirement} requirement Requirement object. Cannot be course.
 * @param {CourseCode[][]} distribution 2D course code object array representing the allocation of courses to requirements. Length of outer array must match length of getRequirements(requirement).
 * @returns Boolean of whether or not the current distribution satisfies requirement.
 */
function testDistribution(requirement, distribution) {
  if (DEBUG_MODE) {
    console.log(`Testing distribution ${JSON.stringify(distribution)} on requirement ${JSON.stringify(requirement)} with subreqs ${JSON.stringify(getRequirements(requirement))} (range: ${JSON.stringify(range(getRequirements(requirement).length))})`);
  }
  let completedSubReqCount = 0;
  for (const index in range(getRequirements(requirement).length)) {
    const subReq = getRequirements(requirement)[index];
    const courses = distribution[index];
    if (DEBUG_MODE) console.log(`Testing subReq ${JSON.stringify(subReq)} with courses ${JSON.stringify(courses)} and completedSubReqCount ${completedSubReqCount}`);
    if (checkCompletion(subReq, courses)) completedSubReqCount++;
    if (completedSubReqCount >= getN(requirement)) return true;
  }
  return false;
}

/**
 * Extract number of sub-requirements needed to satisfy a requirement.
 * @param {Requirement} requirement Requirement object.
 * @returns Integer count of sub-requirements necessary to satisfy a requirement.
 */
function getN(requirement) {
  if (DEBUG_MODE) console.log(`Getting n for requirement ${JSON.stringify(requirement)} with n ${requirement.n} and allOf length ${requirement.allOf?.length}`);
  return requirement.n ?? requirement.allOf?.length ?? (isCourse(requirement) ? 1 : 0);
}

/**
 * Extract all sub-requirements of a requirement.
 * @param {Requirement} requirement Requirement object.
 * @returns Array of sub-requirements
 */
function getRequirements(requirement) {
  return requirement.allOf ?? requirement.nOf ?? [];
}

/**
 * Extract all leaves from a requirement. Has the side effect of cacheing the leaves value in the requirement object.
 * @param {Requirement} requirement Requirement object.
 * @returns An array of CourseCode objects.
 */
export function getLeaves(requirement) {
  if (isCourse(requirement)) {
    return [requirement];
  }
  if (requirement.leaves) {
    return requirement.leaves;
  }
  const leaves = getRequirements(requirement).map(getLeaves).flat();
  // Optimization: Mutate object to cache data
  requirement.leaves = leaves;
  return leaves;
}

/**
 * Check whether a requirement is an instance of CourseCode.
 * @param {Requirement} requirement Requirement object.
 * @returns A truthy value if requirement is an instance of CourseCode or a falsy value otherwise.
 */
function isCourse(requirement) {
  return requirement.department && requirement.code;
}