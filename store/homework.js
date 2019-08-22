export const state = () => ({
    grades: [],
    tests: [],
    exercises: [],
})

export const getters = { 
    allGrades (state, getters) {
        return state.grades
    },
    gradesOf: (state, getters) => (subjectOrTrimester)  => {
        // its a trimester: get the date boundary for the requested trimester
        if (typeof subjectOrTrimester === Number) {
            start = getters.trimesterStartDate(subjectOrTrimester)
            // get the end (aka the start of the next one, or the end of the year)
            end = getters.trimesterStartDate(subjectOrTrimester+1)

            return state.grades.filter(grade => grade.added >= start && grade.added <= end)
        // its a subject
        } else {
            return state.grades.filter(grade => grade.subject.slug === subject.slug)
        }
    },
    gradesIn: (state, getters) => (from, upto)  => {
        return state.grades.filter(grade => grade.added >= from && grade.added <= upto)
    },

    allTests (state, getters) {
        return state.tests
    },
    dueTests (state, getters) {
        return getters.allTests.filter(test => test.due >= new Date(Date.now()))
    },
    ungradedTests (state, getters) {
        let tests = getters.allTests
        for (const grade of getters.allGrades) {
            tests = tests.filter(test => grade.test.id !== test.id)
        }
        return tests
    },
    gradedTests (state, getters) {
        let tests = []
        for (const grade of state.grades) {
            tests.append(grade.test)
        }
        return tests
    },
    meanOf: (state, getters, rootState, rootGetters) => (subjectOrTrimester, applyGradeMax = true) => {
        // get an array containing the grade values from the requested subject/trimester
        let grades = getters.gradesOf(subjectOrTrimester)
        if (!grades.length) return null
        grades = grades.map(grade => grade.value)
        if (!grades.length) return null
        // calculate the mean
        let mean = grades.reduce((acc, val) => acc+val) / grades.length
        
        // NOTE: all grades are in [0;1], this option allows to give out the
        // "correct" value, according to the user's settings (grades/defaultMax)
        // eg. percentage grades would have a defaultMax of 100
        if (applyGradeMax) {
            let gradeMax = rootGetters.setting('grades/defaultMax')
            mean *= gradeMax
        }
        return mean
    },
    globalMean (state, getters) {
        let grades = getters.allGrades.map(grade => grade.value)
        if (!grades.length) return 0 // prevent division by zero & reduce empty array
        let sum = grades.reduce((acc, val) => acc+val)
        let mean = sum / grades.length

        // See `store/homework.js#getters.meanOf`
        if (applyGradeMax) {
            let gradeMax = getters.setting('grades/defaultMax')
            mean *= gradeMax
        }
        return mean
    },
    currentTrimesterGlobalMean (state, getters) {

    },

    allExercises (state, getters) {
        return state.exercises
    },
    dueExercises (state, getters) {
        return getters.allExercises.filter(exercise => exercise.event.start >= new Date(Date.now()))
    },
    pendingExercises (state, getters) {
        return getters.dueExercises.filter(exercise => !exercise.completed)
    },
}

export const mutations = { 
    ADD_GRADE (state, newGrade) {
        state.grades.push(newGrade)
    },
    UPDATE_GRADE (state, id, newGrade) {
        // Get grade
        grade = state.grades.filter(grade => grade.id === id)[0]

        // Compute new grade
        Object.assign(grade, newGrade)

        // Remove the original grade
        state.grades = state.grades.filter(grade => grade.id !== id)

        // Add the modified grade
        state.grades.push(grade)
    }

 }

export const actions = {


 }
