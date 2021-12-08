export const total = arr => arr.reduce((total, val) => total + val, 0);
export const displayNumber = val => {
  const res = val.toFixed(1);
  //if (Math.abs(res) < 10) res = `0${res}`;
  return res;
};
export const slugify = str => {
  str = str.replace(/^\s+|\s+$/g, "");

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  const from =
    "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  const to =
    "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, "")
    // Collapse whitespace and replace by -
    .replace(/\s+/g, "-")
    // Collapse dashes
    .replace(/-+/g, "-");

  return str;
};
function splitArrayIntoChunksOfLen(arr, len) {
  const chunks = [],
    n = arr.length;
  let i = 0;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
export const parsetWeights = (weightsData = "") =>
  splitArrayIntoChunksOfLen(
    weightsData.split(",").map(el => parseFloat(el)),
    6
  );
export const prepareDataToExport = (patient, exams) => {
  /*eslint-disable*/
  return {
    title: patient.title,
    fullname: patient.fullname,
    sex: patient.sex,
    date_of_birth: patient.date_of_birth,
    exams: exams.map(item => ({
      exam_type: item.exam_type,
      duration: item.duration,
      description: item.description,
      notes: item.notes,
      weights_data: item.weights_data,
      created_at: item.created_at
    }))
  };
};
