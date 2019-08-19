<template lang="pug">
.multimodal
    PickerSubject(parent-modal="add-homework")
    BaseModal(name="add-homework").opened
        .row
            BadgeSubject(open-at="self" open-modal="subject-picker-add-homework")
            InputFlat(placeholder="Titre")
        .row
            span.beforeDateInput le
            InputFlat(value="21/09/2019", name="date", placeholder="DD/MM/YYYY") le
            span.beforeRoomInput en
            InputFlat(value="L119", name="room")
        .row
            HeadingSub Notes additionnelles
            TextBlockInput(name="notes")
        ArrayButtonReg.row
            ButtonRegSecondary(close-modal) Annuler
            ButtonRegPrimary(@click="$event('confirm')", close-modal) Ajouter
</template>

<script>
import BaseModal from "~/components/BaseModal.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import BadgeSubject from "~/components/BadgeSubject.vue";
import InputFlat from "~/components/InputFlat.vue";
import TextBlockInput from "~/components/TextBlockInput.vue";
import ArrayButtonReg from "~/components/ArrayButtonReg.vue";
import ButtonRegPrimary from "~/components/ButtonRegPrimary.vue";
import ButtonRegSecondary from "~/components/ButtonRegSecondary.vue";
import PickerSubject from "~/components/PickerSubject.vue";

export default {
  name: "ModalAddExercise",
  components: {
    BaseModal,
    BadgeSubject,
    InputFlat,
    TextBlockInput,
    ArrayButtonReg,
    ButtonRegPrimary,
    ButtonRegSecondary,
    PickerSubject,
    HeadingSub
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.row:not(:last-child)
    margin-bottom: 10px

.row:not(:nth-child(3))
    display: flex
    align-items: center
    &:not(:nth-child(2))
        justify-content: center

.InputFlat
    &.input_date
        width: 200px
    &.input_room
        width: 50px

.HeadingSub
    margin-top: 0
textarea
    display: block
.BadgeSubject
    cursor: pointer
</style>