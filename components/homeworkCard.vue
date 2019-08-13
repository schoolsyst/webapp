<template>
    <div class="HomeworkCard" :style="`background-color: ${homework.subject.color};`">
        <h4>{{homework.name}}</h4>
        <div class="progress-bar">
            <div class="completed" :style="`width: ${homework.progress * 100}%;`"></div>
            <span class="percent">{{homework.progress == 1 ? 'TERMINÉ' : homework.progress * 100 + '%'}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeworkCard',
    props: [
        'homework'
    ]
}
</script>

<style scoped>
    .HomeworkCard {
        border-radius: 10px;
        height: auto;
        max-width: 500px;
    }

    h4, span {
        padding: 0 20px;
        color: white;
    }

    h4 {
        padding: 10px 20px;
        line-height: 56px;
        font-size: 48px;
    }

    span {
        font-size: 24px;
        padding: 20px;
    }

    .progress-bar .completed {
        position: absolute;
        background: rgba(255,255,255,0.5);
        height: 40px;
    }
</style>