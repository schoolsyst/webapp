import moment from "moment";

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
    return getters.allTests.filter(test => test.due >= new Date(Date.now()));
  },
  ungradedTests(state, getters) {
    let tests = getters.allTests;
    for (const grade of getters.allGrades) {
      tests = tests.filter(test => grade.test.uuid !== test.uuid);
    }
    return tests;
  },
  gradedTests(state, getters) {
    let tests = [];
    for (const grade of state.grades) {
      tests.append(grade.test);
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
  globalMean(state, getters) {
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
};

export const mutations = {
  UPDATE_GRADE(state, uuid, newGrade) {
    // Get grade
    grade = state.grades.filter(grade => grade.uuid === uuid)[0];

    // Compute new grade
    Object.assign(grade, newGrade);

    // Remove the original grade
    state.grades = state.grades.filter(grade => grade.uuid !== uuid);

    // Add the modified grade
    state.grades.push(grade);
  },
  UPDATE_EXERCISE(state, uuid, newExercise) {
    // Get exercise
    exercise = state.grades.filter(exercise => exercise.uuid === uuid)[0];

    // Compute new exercise
    Object.assign(exercise, newExercise);

    // Remove the original exercise
    state.grades = state.grades.filter(exercise => exercise.uuid !== uuid);

    // Add the modified exercise
    state.grades.push(exercise);
  },
  UPDATE_TEST(state, uuid, newTest) {
    // Get test
    test = state.grades.filter(test => test.uuid === uuid)[0];

    // Compute new test
    Object.assign(test, newTest);

    // Remove the original test
    state.grades = state.grades.filter(test => test.uuid !== uuid);

    // Add the modified test
    state.grades.push(test);
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
  }
};

export const actions = {};
