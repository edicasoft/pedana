<template>
  <v-card>
    <v-subheader
      >Patient Exams
      <v-menu bottom :offset-y="true" v-if="selectedExams.length > 1">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small color="primary" v-bind="attrs" v-on="on" class="ml-auto">
            Compare
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="showComparePedanasDlg = true"
              >Pedanas</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Torsion</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>General</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Right & Left</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-subheader>
    <v-list
      subheader
      two-line
      flat
      :style="{ overflow: 'auto', maxHeight: 'calc(100vh - 125px)' }"
    >
      <v-list-item v-for="exam in exams" :key="exam.id">
        <v-list-item-action>
          <v-checkbox
            v-model="selectedExams"
            color="primary"
            :value="exam"
          ></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ exam.created_at }}</v-list-item-title>
          <v-list-item-subtitle>{{
            examTypes.find(item => item.type === exam.examType).text
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="play(exam)">
            <v-icon color="green lighten-1">mdi-play-circle</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <ComparePedanasDialog
      v-if="showComparePedanasDlg"
      :value.sync="showComparePedanasDlg"
    />
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { examTypes } from "@/common/constants.js";
import ComparePedanasDialog from "@/components/dialogs/ComparePedanasDialog.vue";

export default {
  components: {
    ComparePedanasDialog
  },
  data() {
    return {
      selectedExams: [],
      examTypes,
      showComparePedanasDlg: false
    };
  },
  watch: {
    "selectedExams.length": {
      handler() {
        this.setSelectedExams(this.selectedExams);
      }
    }
  },
  computed: {
    ...mapState("exams", ["exams"])
  },
  methods: {
    ...mapActions("exams", ["setSelectedExams"]),
    play(exam) {
      this.$emit("play", exam.weightsData);
    }
  }
};
</script>
