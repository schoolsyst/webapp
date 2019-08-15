export const state = () => ({
    tests: [],
    exercises: [],
    grades: []
})

export const getters = { 
    allGrades (state, getters) {
        return state.grades
    },
    gradesOf: (state, getters) => (subject)  => {
        return state.grades.filter(grade => grade.subject.slug === subject.slug)
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


 }

export const actions = {


 }
