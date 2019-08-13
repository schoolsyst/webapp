<template>
  <div class="container">
    <Heading :content="formattedDate" />
    <Toolbar :buttons="toolbarButtons"/>
    <div class="horizontal-group">
      <div class="left">
        <h2>Prochain cours</h2>
        <CourseCard :course="nextCourse"/>
        <h2>Devoirs du prochain cours</h2>
        <HomeworkCard :homework="nextCourse.homework" />
      </div>
      <div class="right">
        <h2>Moyenne</h2>
        <BigNumber :number="globalMean"/>
        <h2>Évolution</h2>
        <BigNumber :number="evolution" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { async } from 'q';
import Heading from "~/components/Heading.vue"
import Toolbar from "~/components/Toolbar.vue"
import CourseCard from "~/components/CourseCard.vue"
import HomeworkCard from "~/components/HomeworkCard.vue"
import BigNumber from "~/components/BigNumber.vue"

export default {
  components: {
    Heading,
    Toolbar,
    CourseCard,
    HomeworkCard,
    BigNumber
  },
  head() {
    return {
      title: "Dashboard",
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: "Schoolsyst — Dashboard",
        }
      ]
    }
  },

  data() {
    return { 
      formattedDate: 'Dimanche 11 Août—13:20',
      toolbarButtons: [
        {
          icon: 'edit',
          text: 'Devoir',
          action: 'new_exercise',
          type: 'button'
        },
        {
          icon: 'note_add',
          text: 'Nouveau chapitre',
          action: 'new_chapter',
          type: 'button'
        },
        {
          icon: 'format_list_bulleted',
          text: 'Contrôle',
          action: 'new_test',
          type: 'button'
        },
        {
          icon: 'insert_drive_file',
          text: 'Dernier chapitre',
          action: 'open_latest_chapter',
          type: 'button'
        }
      ],
      nextCourse: {
        subject: {
          color: "#43A047",
          name: "Histoire—Géographie",
        },
        room: 'L109',
        time: "12:00",
        homework: {
          subject: {
            color: "#43A047"
          },
          name: "Ex 4–6 p306",
          progress: 1
        }
      },
      globalMean: {
        value: 14.75,
        unit: '/20',
        writables: []
      },
      evolution: {
        value: 0.2,
        sign: '+',
        writables: []
      }
    }
  },

  // async created() {
  //   const res = await axios.get('http://localhost:8000/api/users', {headers:{
  //     Authorization: 'Basic ZXdlbjpwb3RkZWZsZXVyNzYyMw==',
  //   }})
  //   this.ip = res.data[0].username
  // }
}
</script>

<style scoped>
.Toolbar {
  width: 50%;
}
</style>