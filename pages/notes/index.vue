<template>
<!-- COMPONENT TREE
Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

ArrayButtonFlat
MainGroup
    MainGroupLeft
        HeadingSub

        HeadingSub
-->

<div class="container">
    <TheHeading>Prises de notes</TheHeading>
    <MainGroup full-size>
        <HeadingSub>{{currentCourse.subject.name}}</HeadingSub>
        <ArrayCardNoteFile>
            <CardNoteFile 
                v-for="(note, i) in currentSubjectCards" :key="i" 
                v-bind="note"
            />
        </ArrayCardNoteFile>
        <HeadingSub has-inline-buttons>
            <span>Tout</span>
            <ArrayButtonFlat inline>
                <InputFlat 
                    icon="search" 
                    name="search"
                    placeholder="Rechercher un fichier" 
                    v-model="searchText"
                ></InputFlat>
                <DropdownFlat 
                    icon="sort"
                    name="sort"
                    :options="sortOptions" 
                    v-model="sortBy"
                >Date de modification
                </DropdownFlat>
            </ArrayButtonFlat>
        </HeadingSub>
        <ArrayCardNoteFile>
            <CardNoteFile 
                v-for="(note, i) in allCards" :key="i"
                v-bind="note"
            />
        </ArrayCardNoteFile>
    </MainGroup>
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import InputFlat from '~/components/InputFlat.vue'
import DropdownFlat from '~/components/DropdownFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import ArrayCardNoteFile from '~/components/ArrayCardNoteFile.vue'
import CardNoteFile from '~/components/CardNoteFile.vue'

export default {
    layout: 'default',
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        InputFlat,
        DropdownFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
        ArrayCardNoteFile,
        CardNoteFile
    },

    data() {
        return {
            searchText: '',
            sortOptions: [
                { value: 'lastModified', name: "Date de modification"   },
                { value: 'created',      name: "Date de création"       },
                { value: 'subject',      name: "Matière"                },
            ],
            sortBy: 'lastModified',
            // API DATA ↓
            currentCourse: {
                subject: {
                    name: 'English',
                    slug: 'english',
                    abbreviation: 'eng',
                    color: '#1A237E'
                }
            },
            notes: [
                {
                    name: 'Present Perfect',
                    notion: {
                        subject: {
                            name: 'English',
                            slug: 'english',
                            abbreviation: 'eng',
                            color: '#1A237E'
                        },
                        name: 'Present Perfect',
                        slug: 'present-perfect',
                        progress: 1
                    },
                    /* content: `
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam ac ullamcorper erat. Nam aliquet congue quam ac viverra. 
                        Donec nec diam auctor, aliquet lorem eget, consectetur lectus. 
                        Ut sodales elementum nisl at imperdiet. Nulla facilisi. 
                        Phasellus non ornare velit, et mollis nulla. 
                        Nunc mollis consectetur diam in sollicitudin. 
                        Curabitur rutrum sem accumsan aliquet ullamcorper. Nullam sodales 
                        neque quis quam iaculis, nec sodales mi aliquam. Nulla vel dolor pretium, aliquam metus tempor, pellentesque ante. 
                        Maecenas sollicitudin blandit pellentesque. 
                        Sed at massa tempor, varius urna posuere, mollis nisi.
                    `, */
                    created: '07/08/2019',
                    filepath: 'english/present-perfect.adoc',
                    lastModified: '13/08/2019'
                },
                {
                    name: 'Futur',
                    notion: {
                        subject: {
                            name: 'English',
                            slug: 'english',
                            abbreviation: 'eng',
                            color: '#1A237E'
                        },
                        name: 'Futur',
                        slug: 'futur',
                        progress: 0.95
                    },
                    /* content: `
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam ac ullamcorper erat. Nam aliquet congue quam ac viverra. 
                        Donec nec diam auctor, aliquet lorem eget, consectetur lectus. 
                        Ut sodales elementum nisl at imperdiet. Nulla facilisi. 
                        Phasellus non ornare velit, et mollis nulla. 
                        Nunc mollis consectetur diam in sollicitudin. 
                        Curabitur rutrum sem accumsan aliquet ullamcorper. Nullam sodales 
                        neque quis quam iaculis, nec sodales mi aliquam. Nulla vel dolor pretium, aliquam metus tempor, pellentesque ante. 
                        Maecenas sollicitudin blandit pellentesque. 
                        Sed at massa tempor, varius urna posuere, mollis nisi.
                    `, */
                    created: '13/08/2019',
                    filepath: 'english/futur.adoc',
                    lastModified: '13/08/2019'
                },
                {
                    name: "Vecteurs dans l'espace 3D",
                    notion: {
                        subject: {
                            name: 'Mathématiques',
                            slug: 'mathematiques',
                            abbreviation: 'mth',
                            color: '#039BE5'
                        },
                        name: "Vecteurs dans l'espace 3D",
                        slug: 'vecteurs-dans-l-espace-3d',
                        progress: 0
                    },
                    /* content: `
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam ac ullamcorper erat. Nam aliquet congue quam ac viverra. 
                        Donec nec diam auctor, aliquet lorem eget, consectetur lectus. 
                        Ut sodales elementum nisl at imperdiet. Nulla facilisi. 
                        Phasellus non ornare velit, et mollis nulla. 
                        Nunc mollis consectetur diam in sollicitudin. 
                        Curabitur rutrum sem accumsan aliquet ullamcorper. Nullam sodales 
                        neque quis quam iaculis, nec sodales mi aliquam. Nulla vel dolor pretium, aliquam metus tempor, pellentesque ante. 
                        Maecenas sollicitudin blandit pellentesque. 
                        Sed at massa tempor, varius urna posuere, mollis nisi.
                    `, */
                    created: '05/08/2019',
                    filepath: 'english/vecteurs-dans-l-espace-3d.adoc',
                    lastModified: '05/08/2019'
                }
            ]

        }
    },

    computed: {
        currentSubjectCards: function() {
            let notes = this.notes.filter(note => note.notion.subject.slug === this.currentCourse.subject.slug)
            let cards = []
            for (const note of notes) {
                cards.push({
                    title: note.name,
                    detail: note[this.sortBy],
                    filepath: note.filepath
                })
            }

            return cards
        },
        allCards: function() {
            let notes = this.notes.filter(note => note.notion.subject.slug !== this.currentCourse.subject.slug)
            let cards = []
            for (const note of notes) {
                cards.push({
                    title: note.name,
                    detail: note[this.sortBy],
                    filepath: note.filepath
                })
            }

            return cards
        }
    },
}
</script>

<style lang="sass" scoped>

</style>