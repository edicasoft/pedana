/*eslint-disable*/
import { app } from "electron";
const path = require("path");
const userData = app.getPath("userData");
console.log("path to db: ", userData);
const dbFile = path.resolve(userData, "database.sqlite");
const ipc = require("electron").ipcMain;
import { parsetWeights, prepareDataToExport } from "@/common/helpers";

import { PrepareDatabase } from "@/db/prepareDb.js";
export default class DbService {
  constructor(win) {
    const prepare = new PrepareDatabase();

    const knex = require("knex")({
      client: "sqlite3",
      connection: {
        filename: dbFile
      },
      useNullAsDefault: true
    });
    knex.schema.hasTable("patient").then(function(exists) {
      if (!exists) {
        const query = prepare.createTablePatient(knex);
        query
          .then(res => {
            console.log("createTablePatient", res);
          })
          .catch(err => {
            console.log("createTablePatient Error", err);
            const query = knex.schema
              .dropTableIfExists("patient")
              .dropTableIfExists("exam");
            query
              .then(res => {
                console.log("dropTableIfExists", res);
                win.close();
              })
              .catch(err => {
                console.log("dropTableIfExists err", err);
                win.close();
              });
          });
      }
    });

    ipc.on("get:patients", (event, { search, starts_with, exam_date } = {}) => {
      console.log("get:patients params", search, starts_with, exam_date);

      let query = knex
        .from("patient")
        .select(
          "patient.id",
          "patient.fullname",
          "patient.sex",
          "patient.title",
          "patient.date_of_birth"
        )
        .leftJoin("exam", "patient.id", "=", "exam.patient_id")
        .groupBy(
          "patient.id",
          "patient.fullname",
          "patient.sex",
          "patient.title",
          "patient.date_of_birth"
        );
      query.max("exam.created_at as latest_exam");

      if (search) {
        query.where("patient.fullname", "like", `%${search}%`);
      }
      if (starts_with) {
        query.where("patient.fullname", "like", `${starts_with}%`);
      }
      if (exam_date) {
        query.whereExists(function() {
          this.select("created_at")
            .from("exam")
            .whereRaw(
              `patient.id=patient_id and created_at BETWEEN DATE('${exam_date}') AND DATE('${exam_date}', '+1 day')`
            );
        });
        //query.where("exam.created_at", "like", `%${exam_date}%`);
      }
      console.log(query.toSQL().toNative());
      query
        .then(rows => {
          win.webContents.send("get:patients:result", rows);
        })
        .catch(err => {
          win.webContents.send("get:patients:error", err);
        });
    });
    function createPatient(data) {
      return knex("patient")
        .insert(data)
        .then(rows => {
          if (rows && rows.length) {
            win.webContents.send("create:patient:result", rows[0]);
            return rows[0];
          }
        })
        .catch(err => {
          win.webContents.send("create:patient:error", err);
        });
    }
    function createExam(data) {
      return knex("exam")
        .insert(data)
        .then(id => {
          if (id) {
            return getExam(id);
          }
        })
        .then(rows => {
          console.log("get:exam", rows);
          if (rows && rows.length) {
            win.webContents.send("create:exam:result", rows[0]);
          }
        })
        .catch(err => {
          win.webContents.send("create:exam:error", err);
        });
    }
    ipc.on("create:patient", (event, data) => createPatient(data));

    ipc.on("update:patient", (event, { id, data }) => {
      knex("patient")
        .where({ id })
        .update(data)
        .then(rows => {
          win.webContents.send("update:patient:result", rows);
        })
        .catch(err => {
          win.webContents.send("update:patient:error", err);
        });
    });

    ipc.on("delete:patient", (event, id) => {
      knex("patient")
        .where({ id })
        .del()
        .then(rows => {
          win.webContents.send("delete:patient:result", rows);
        })
        .catch(err => {
          win.webContents.send("delete:patient:error", err);
        });
    });
    function getPatientExams(patient_id) {
      return knex
        .from("exam")
        .where({ patient_id })
        .select("*")
        .orderBy("created_at", "desc");
    }
    ipc.on("get:exams", (event, patient_id) => {
      getPatientExams(patient_id)
        .then(rows => {
          win.webContents.send("get:exams:result", rows);
        })
        .catch(err => {
          win.webContents.send("get:exams:error", err);
        });
    });
    ipc.on("create:exam", (event, data) => {
      createExam(data);
    });
    function getExam(id) {
      return knex("exam")
        .select("*")
        .where({ id });
    }

    ipc.on("update:exam", (event, { id, data }) => {
      knex("exam")
        .where({ id })
        .update(data)
        .then(rows => {
          win.webContents.send("update:exam:result", rows);
        })
        .catch(err => {
          win.webContents.send("update:exam:error", err);
        });
    });

    ipc.on("delete:exam", (event, id) => {
      knex("exam")
        .where({ id })
        .del()
        .then(rows => {
          win.webContents.send("delete:exam:result", rows);
        })
        .catch(err => {
          win.webContents.send("delete:exam:error", err);
        });
    });
    async function importPatient(item) {
      try {
        if (!item.fullname) throw "Invalid data";
        const res = {
          createdPatient: null
          // updatedPatient: null
        };

        const patientQuery = knex("patient")
          .select("*")
          .where({ fullname: item.fullname });
        if (item.date_of_birth) {
          patientQuery.where({ date_of_birth: item.date_of_birth });
        }
        // console.log("patientQuery", patientQuery.toSQL().toNative());

        const patient = await patientQuery;
        console.log("import:exams patient", patient);

        if (patient.length) {
          if (item.exams && item.exams.length) {
            const exams = item.exams.map(exam => ({
              ...exam,
              ...{ patient_id: patient[0].id }
            }));
            const createdExams = await createExamIfNotExists(exams);
            console.log("return from createExamIfNotExists", createdExams);
          }
          // res.updatedPatient = patient[0].fullname;
        } else {
          const createdPatient = await createPatientWithExams(item);
          console.log("return from createPatientWithExams", createdPatient);
          res.createdPatient = createdPatient;
        }
        return res;
      } catch (err) {
        console.log("import:patient err", err);
        throw "Import exams error";
      }
    }
    ipc.on("export:exams", async (event, patients) => {
      try {
        if (!patients || !patients.length) return;
        // for (let i = 0; i < 1000; i++) {
        //   let p = Object.assign({}, patients[0]);
        //   p.fullname = patients[0].fullname + i;
        //   patients.push(p);
        // }
        // console.log(patients.length);
        await Promise.all(
          patients.map(async patient => {
            let exams = await getPatientExams(patient.id);
            exams.forEach(
              exam => (exam.weights_data = parsetWeights(exam.weights_data))
            );
            return prepareDataToExport(patient, exams);
          })
        ).then(res => {
          console.log("Promise.all", res);
          win.webContents.send("export:exams:result", res);
        });
      } catch (err) {
        win.webContents.send("export:exams:error", err);
        console.log("export:exams err", err);
      }
    });
    ipc.on("import:exams", async (event, patients) => {
      try {
        let createdPatients = 0;
        // let updatedPatients = 0;
        if (!patients || !patients.length) return;
        const countBefore = await knex("exam").count("id as count");
        console.log("countBefore", countBefore[0]);
        await Promise.all(
          patients.map(async patient => {
            const res = await importPatient(patient);
            if (res.createdPatient) {
              createdPatients++;
            }
            // if (res.updatedPatient) {
            //   updatedPatients++;
            // }
            console.log("promise res", res);
          })
        ).then(async res => {
          const countAfter = await knex("exam").count("id as count");
          console.log("countAfter", countAfter[0].count);

          const createdExams =
            parseInt(countAfter[0].count) - parseInt(countBefore[0].count);
          win.webContents.send("import:exams:result", {
            createdPatients,
            createdExams
          });
        });
      } catch (err) {
        win.webContents.send("import:exams:error", err);
        console.log("import:exams err", err);
      }
    });
    async function createPatientWithExams(data) {
      try {
        const patient = {
          fullname: data.fullname
        };
        if (data.date_of_birth) patient.date_of_birth = data.date_of_birth;
        if (data.title) patient.title = data.title;
        if (data.sex) patient.sex = data.sex;
        const createdPatient = await createPatient(patient);
        console.log("createPatientWithExams res", createdPatient);
        if (data.exams && data.exams.length) {
          const exams = data.exams.map(exam => ({
            ...exam,
            ...{ patient_id: createdPatient }
          }));

          const createdExams = await knex("exam").insert(exams);
          console.log("createExamIfNotExists createdExams", {
            createdExams
          });
        }

        console.log("createExamIfNotExists createdPatient", {
          createdPatient
        });
        return createdPatient;
      } catch (e) {
        console.log("createPatientWithExams error", e);
        throw "Create patient error";
      }
    }
    function createExamIfNotExists(data) {
      return knex("exam")
        .insert(data)
        .onConflict(["patient_id", "created_at", "exam_type"])
        .merge();
    }
  }
}
