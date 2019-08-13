<template>
    <div class="CourseCard" :style="`background-color: ${course.subject.color};`">
        <h4>{{course.subject.name}}</h4>
        <div class="room">{{course.room}}</div>
        <div class="remaining-time">Dans 52 minutes</div>
    </div>
</template>
<script>
export default {
    name: 'CourseCard',
    props: [
        'course'
    ]
}
</script>

<style scoped>
    .CourseCard {
        height: 200px;
        border-radius: 10px;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, max-content);
        max-width: 500px;
    }
    h4 {
        color: white;
        font-size: 56px;
        grid-column: 1/ span 2;
        grid-row: 1;
        line-height: 56px;
        height: 175px;
    }

    .room, .remaining-time {
        color: white;
        font-size: 24px;
        grid-row: 2;
    }

    .room {
        grid-column: 1;
    }

    .remaining-time {
        grid-column: 2;
        text-align: right;
    }
</style>