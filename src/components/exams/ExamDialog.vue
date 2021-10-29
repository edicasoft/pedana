<template>
  <v-dialog :value="value" :max-width="800" persistent>
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0 text-center"
          >{{ exam ? "Edit" : "New" }} Exam</v-card-title
        >
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>
      <v-form
        ref="form"
        lazy-validation
        @submit.prevent="submit"
        v-model="valid"
      >
        <v-sheet width="600px" class="mx-auto">
          <v-select
            v-model="exam_type"
            item-value="type"
            :items="examTypes"
            :rules="[rules.required]"
            label="Type of Exam"
            required
            dense
          ></v-select>
          <v-sheet width="120px">
            <v-text-field
              type="number"
              v-model="duration"
              label="Duration"
              :disabled="exam"
              :rules="[rules.required, rules.positive, rules.maxDuration]"
              required
            >
              <template v-slot:append-outer>
                sec.
              </template>
            </v-text-field></v-sheet
          >
          <v-textarea
            v-model="description"
            label="Description"
            outlined
            dense
          ></v-textarea>
          <v-textarea v-model="notes" label="Notes" outlined dense></v-textarea>
          <div class="d-flex justify-space-between mb-5">
            <v-btn
              class="mr-4"
              type="submit"
              :disabled="!valid"
              color="primary"
            >
              {{ exam ? "Save" : "Start" }}
            </v-btn>
            <v-btn @click="close">
              Cancel
            </v-btn>
          </div>
        </v-sheet>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
//TODO::disable duration field when editing
import { examTypes } from "@/common/constants.js";

/*eslint-disable*/
export default {
  props: ["value", "exam"],
  data: () => ({
    valid: true,
    description: "",
    notes: "",
    exam_type: null,
    duration: 15,
    examTypes: examTypes,
    rules: {
      required: value => !!value || "This field is required",
      positive: value => value > 0 || "Invalid number",
      maxDuration: value => value <= 60 || `Maximum is 60`
    }
  }),
  mounted() {
    console.log(this.exam);
    if (this.exam) {
      this.description = this.exam.description;
      this.notes = this.exam.notes;
      this.exam_type = this.getType(this.exam.exam_type);
      this.duration = this.exam.duration;
    }
  },

  methods: {
    getType(type) {
      return this.examTypes.find(item => item.type === type);
    },
    submit() {
      this.validate();
      this.$nextTick(() => {
        console.log("isValid", this.valid, this.exam_type);
        if (this.valid) {
          const data = {
            duration: this.duration,
            exam_type: this.exam_type,
            notes: this.notes,
            description: this.description
          };
          if (this.exam) {
            this.$emit("update", data);
          } else {
            this.$emit("create", data);
          }
          this.close();
        }
      });
      // this.close();
    },
    close() {
      this.$emit("update:value", false);
      this.reset();
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
