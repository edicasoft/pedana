<template>
  <v-card>
    <v-subheader
      >Patient Exams
      <v-menu bottom :offset-y="true" v-if="selectedItems.length > 1">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small color="primary" v-bind="attrs" v-on="on" class="ml-auto">
            Compare Selected
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="showComparePedanasDlg = true">
            <v-list-item-title>Pedanas</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showGeneralBcentersDlg = true">
            <v-list-item-title>General</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showTorsionsDlg = true">
            <v-list-item-title>Torsion</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showRightLeftBcentersDlg = true">
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
            v-model="selectedItems"
            @change="selectExam($event)"
            color="primary"
            :value="exam"
          ></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ exam.created_at }}</v-list-item-title>
          <v-list-item-subtitle>{{
            examTypes.find(item => item.type === exam.exam_type).text
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
    <GeneralBarycentersDialog
      v-if="showGeneralBcentersDlg"
      :value.sync="showGeneralBcentersDlg"
    />
    <LeftRightBarycentersDialog
      v-if="showRightLeftBcentersDlg"
      :value.sync="showRightLeftBcentersDlg"
    />
    <TorsionsDialog v-if="showTorsionsDlg" :value.sync="showTorsionsDlg" />
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { examTypes } from "@/common/constants.js";
import ComparePedanasDialog from "@/components/exams/compare/ComparePedanasDlg.vue";
import GeneralBarycentersDialog from "@/components/exams/compare/GeneralBarycentersDlg.vue";
import LeftRightBarycentersDialog from "@/components/exams/compare/LeftRightBarycentersDlg.vue";
import TorsionsDialog from "@/components/exams/compare/TorsionsDlg.vue";

export default {
  components: {
    ComparePedanasDialog,
    GeneralBarycentersDialog,
    LeftRightBarycentersDialog,
    TorsionsDialog
  },
  data() {
    return {
      selectedItems: [],
      examTypes,
      showComparePedanasDlg: false,
      showGeneralBcentersDlg: false,
      showRightLeftBcentersDlg: false,
      showTorsionsDlg: false
    };
  },
  watch: {
    "selectedItems.length": {
      handler(val) {
        this.setSelectedExams(this.selectedItems);
      }
    },
    selectedExams(val) {
      this.selectedItems = val;
    }
  },
  computed: {
    ...mapState("exams", ["exams", "selectedExams"])
  },
  methods: {
    ...mapActions("exams", ["setSelectedExams"]),
    selectExam(evt) {
      //console.log(evt, exam);
      this.$emit("select", evt[0]);
    },
    play(exam) {
      this.$emit("play", exam);
    }
  }
};
</script>
