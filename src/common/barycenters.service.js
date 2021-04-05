import Barycenter from "@/entities/Barycenter";
import { leftPlatformCells, rightPlatformCells } from "@/common/constants.js";
export const generalBarycenter = new Barycenter(
  leftPlatformCells.concat(rightPlatformCells),
  "red"
);
export const leftBarycenter = new Barycenter(leftPlatformCells, "gold");
export const rightBarycenter = new Barycenter(rightPlatformCells, "gold");

export default {
  generalBarycenter
};
