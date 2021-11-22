import Barycenter from "@/entities/Barycenter";
import { leftPlatformCells, rightPlatformCells } from "@/common/constants.js";
export const generalBarycenter = new Barycenter(
  leftPlatformCells.concat(rightPlatformCells),
  `general-barycenter`
);
export const leftBarycenter = new Barycenter(leftPlatformCells);
export const rightBarycenter = new Barycenter(rightPlatformCells);
