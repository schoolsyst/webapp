import moment from "moment";
import groupBy from "lodash.groupby"

export const state = () => ({
  grades: [],
  tests: [],
  exercises: []
});

export const getters = {
  allGrades(state, getters) {
    return state.grades;
  },
  gradesOf: (state, getters) => subjectOrTrimester => {
    // its a trimester: get the date boundary for the requested trimester
    if (typeof subjectOrTrimester === Number) {
      start = getters.trimesterStartDate(subjectOrTrimester);
      // get the end (aka the start of the next one, or the end of the year)
      end = getters.trimesterStartDate(subjectOrTrimester + 1);

      return state.grades.filter(
        grade => grade.added >= start && grade.added <= end
      );
      // its a subject
    } else {
      return state.grades.filter(grade => grade.subject.slug === subject.slug);
    }
  },
  gradesIn: (state, getters) => (from, upto) => {
    return state.grades.filter(
      grade => grade.added >= from && grade.added <= upto
    );
  },

  allTests(state, getters) {
    return state.tests;
  },
  dueTests(state, getters) {
    return getters.allTests.filter(test => moment(test.due, 'YYYY-MM-DD').isAfter(moment()));
  },
  pastTests(state, getters) {
    return getters.allTests.filter(test => moment(test.due, 'YYYY-MM-DD').isSameOrBefore(moment()));
  },
  ungradedTests(state, getters) {
    return getters.allTests.filter(test => !test.grades && !test.grades.length);
  },
  gradedTests(state, getters) {
    let tests = [];
    for (const grade of state.grades) {
      tests.push(grade.test);
    }
    return tests;
  },
  meanOf: (state, getters, rootState, rootGetters) => (
    subjectOrTrimester,
    applyGradeMax = true
  ) => {
    // get an array containing the grade values from the requested subject/trimester
    let grades = getters.gradesOf(subjectOrTrimester);
    if (!grades.length) return null;
    grades = grades.map(grade => grade.value);
    if (!grades.length) return null;
    // calculate the mean
    let mean = grades.reduce((acc, val) => acc + val) / grades.length;

    // NOTE: all grades are in [0;1], this option allows to give out the
    // "correct" value, according to the user's settings (default_max)
    // eg. percentage grades would have a default_max of 100
    if (applyGradeMax) {
      let gradeMax = rootGetters.setting("default_max");
      mean *= gradeMax;
    }
    return mean;
  },
  globalMean: (state, getters) => (applyGradeMax=true) => {
    let grades = getters.allGrades.map(grade => grade.value);
    if (!grades.length) return 0; // prevent division by zero & reduce empty array
    let sum = grades.reduce((acc, val) => acc + val);
    let mean = sum / grades.length;

    // See `store/homework.js#getters.meanOf`
    if (applyGradeMax) {
      let gradeMax = getters.setting("default_max");
      mean *= gradeMax;
    }
    return mean;
  },
  currentTrimesterGlobalMean(state, getters) {},

  allExercises(state, getters) {
    return state.exercises;
  },
  dueExercises(state, getters) {
    return getters.allExercises.filter(
      exercise => moment(exercise.due, 'YYYY-MM-DD').isAfter(moment())
    );
  },
  pendingExercises(state, getters) {
    return getters.dueExercises.filter(exercise => !exercise.completed);
  },
  uncompleteExercises(state, getters) {
    return getters.allExercises.filter(exercise => !exercise.completed);
  },
  groupedHomework(state, getters) {
    let exercises = getters.dueExercises
    let tests = getters.dueTests
    let grouppedExs = groupBy(exercises, "due")
    let grouppedTests = groupBy(tests, "due")
    let groupped = {}
    for (const [due, exercises] of Object.entries(grouppedExs)) {
      if (due in groupped) {
        groupped[due]['exercises'] = exercises
      } else {
        groupped[due] = { exercises }
      }
    }
    for (const [due, tests] of Object.entries(grouppedTests)) {
      if (due in groupped) {
        groupped[due]['tests'] = tests
      } else {
        groupped[due] = { tests }
      }
    }
    let arrayed = Object.keys(groupped).map(k => [k, groupped[k]])
    let sorted  = arrayed.sort((a, b) => {
      let adate = moment(a[0], 'YYYY-MM-DD')
      let bdate = moment(b[0], 'YYYY-MM-DD')
      return adate.isAfter(bdate) ? 1 : -1
    })
    return sorted
  },
  test: (state, getters) => (uuid) => {
    return state.tests.find(t => t.uuid === uuid)
  },
  
};

export const mutations = {
  UPDATE_GRADE(state, args) {
    let { uuid, data } = args
    // Get grade
    let grade = state.grades.find(grade => grade.uuid === uuid);

    // Compute new grade
    Object.assign(grade, data);

    // Remove the original grade
    state.grades = state.grades.filter(grade => grade.uuid !== uuid);

    // Add the modified grade
    state.grades.push(grade);
  },
  UPDATE_EXERCISE(state, args) {
    let { uuid, data } = args
    // Get exercise
    let exercise = state.exercises.find(exercise => exercise.uuid === uuid);

    // Compute new exercise
    Object.assign(exercise, data);

    // Remove the original exercise
    state.exercises = state.exercises.filter(exercise => exercise.uuid !== uuid);

    // Add the modified exercise
    state.exercises.push(exercise);
  },
  UPDATE_TEST(state, args) {
    let { uuid, data } = args
    // Get test
    let test = state.tests.find(test => test.uuid === uuid);

    // Compute new test
    Object.assign(test, data);

    // Remove the original test
    state.tests = state.tests.filter(test => test.uuid !== uuid);

    // Add the modified test
    state.tests.push(test);
  },
  SET_TESTS(state, tests) {
    state.tests = tests;
  },
  SET_EXERCISES(state, exercises) {
    state.exercises = exercises;
  },
  SET_GRADES(state, grades) {
    state.grades = grades;
  },
  ADD_EXERCISE(state, exercise) {
    state.exercises.push(exercise)
  },
  ADD_TEST(state, test) {
    state.tests.push(test)
  },
  SWITCH_EXERCISE_COMPLETED(state, exerciseUUID) {
    let exercise = state.exercises.find(ex => ex.uuid === exerciseUUID)
    if (!exercise) return
    state.exercises[state.exercises.indexOf(exercise)].completed = !exercise.completed
  },
  ADD_GRADE(state, grade) {
    state.grades.push(grade)
  },
  DELETE_TEST(state, testUUID) {
    //FIXME
    state.tests = state.tests.filter(t => t.uuid !== testUUID)
  },
  CHANGE_EXERCISE(state, exerciseUUID, newExerciseData) {
    let i = state.exercises.indexOf(state.exercises.find(e=>e.uuid===exerciseUUID))
    Object.assign(state.exercises[i], newExerciseData)
  }
};

export const actions = {
};
