/*eslint-disable*/
import { app } from "electron";
const path = require("path");
const userData = app.getPath("userData");
console.log("path to db: ", userData);
const dbFile = path.resolve(userData, "database.sqlite");
const ipc = require("electron").ipcMain;

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
        return prepare.createTablePatient(knex);
      }
    });

    ipc.on("get:patients", (event, data) => {
      knex
        .from("patient")
        .select("*")
        .then(rows => {
          win.webContents.send("get:patients:result", rows);
        })
        .catch(err => {
          win.webContents.send("get:patients:error", err);
        });
    });

    ipc.on("create:patient", (event, data) => {
      knex("patient")
        .insert(data)
        .then(rows => {
          if (rows && rows.length) {
            win.webContents.send("create:patient:result", rows[0]);
          }
        })
        .catch(err => {
          win.webContents.send("create:patient:error", err);
        });
    });

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
    ipc.on("get:exams", (event, patient_id) => {
      knex
        .from("exam")
        .where({ patient_id })
        .select("*")
        .then(rows => {
          win.webContents.send("get:exams:result", rows);
        })
        .catch(err => {
          win.webContents.send("get:exams:error", err);
        });
    });
    ipc.on("create:exam", (event, data) => {
      knex("exam")
        .insert(data)
        .then(rows => {
          if (rows && rows.length) {
            win.webContents.send("create:exam:result", rows[0]);
          }
        })
        .catch(err => {
          win.webContents.send("create:exam:error", err);
        });
    });

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
  }
}
