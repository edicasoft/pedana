<script>
// this.PSx = new GDILabel[3];
//         this.PSx[0] = new GDILabel(this.GDI_Device, this.m_font, 134, 25, 35, 24);
//         this.PSx[1] = new GDILabel(this.GDI_Device, this.m_font, 7, 81, 35, 24);
//         this.PSx[2] = new GDILabel(this.GDI_Device, this.m_font, 111, 350, 35, 24);
//         this.PDx = new GDILabel[3];
//         this.PDx[0] = new GDILabel(this.GDI_Device, this.m_font, 269, 25, 35, 24);
//         this.PDx[1] = new GDILabel(this.GDI_Device, this.m_font, 396, 81, 35, 24);
//         this.PDx[2] = new GDILabel(this.GDI_Device, this.m_font, 292, 350, 35, 24);
//         this.f_sx = new PointF(165f, (float) (this.PLeg[0].rect.Y + 2));
//         this.f_dx = new PointF(252f, (float) (this.PLeg[0].rect.Y + 2));
//         this.f_s1 = new PointF((float) this.PSx[0].rect.X, (float) (this.PSx[0].rect.Y + 25));
//         this.f_s2 = new PointF((float) this.PSx[1].rect.X, (float) (this.PSx[1].rect.Y + 25));
//         this.f_s3 = new PointF((float) this.PSx[2].rect.X, (float) (this.PSx[2].rect.Y + 25));
//         this.f_d1 = new PointF((float) this.PDx[0].rect.X, (float) (this.PDx[0].rect.Y + 25));
//         this.f_d2 = new PointF((float) this.PDx[1].rect.X, (float) (this.PDx[1].rect.Y + 25));
//         this.f_d3 = new PointF((float) this.PDx[2].rect.X, (float) (this.PDx[2].rect.Y + 25));

// switch (p.VerificaCarico(Sensore))
//             {
//               case -3:
//                 image = this.m_tex_giu_r;
//                 break;
//               case -2:
//                 image = this.m_tex_giu_g;
//                 break;
//               case -1:
//                 image = this.m_tex_giu_v;
//                 break;
//               case 0:
//                 image = this.m_tex_trat;
//                 break;
//               case 1:
//                 image = this.m_tex_su_v;
//                 break;
//               case 2:
//                 image = this.m_tex_su_g;
//                 break;
//               case 3:
//                 image = this.m_tex_su_r;
//                 break;
//               default:
//                 continue;
//             }
//             gdiDevice.DrawImage(image, pointF.X, pointF.Y, (float) image.Width, (float) image.Height);

// public int VerificaCarico(int Sensore)
// {
//   if (Sensore <= 3)
//   {
//     double valore = 0.0;
//     if (Sensore == 1)
//       valore = this.S1;
//     else if (Sensore == 2)
//       valore = this.S2;
//     else if (Sensore == 3)
//       valore = this.S3;
//     double num = Pesata.CalcolaPercentuale(valore, this.PesoTotale);
//     if (Istanze.IstanzaEsame != null && Istanze.IstanzaEsame.MonoPodalico != MonoPodalicoEnum.Entrambi)
//       num /= 2.0;
//     if (num >= 14.667 && num < 18.667)
//       return num >= 16.667 ? 1 : -1;
//     if (num >= 12.667 && num < 14.667)
//       return -2;
//     if (num >= 18.667 && num < 20.667)
//       return 2;
//     return num >= 20.666 || num >= 12.667 ? 3 : -3;
//   }
//   double valore1 = 0.0;
//   if (Sensore == 4)
//     valore1 = this.D1;
//   else if (Sensore == 5)
//     valore1 = this.D2;
//   else if (Sensore == 6)
//     valore1 = this.D3;
//   double num1 = Pesata.CalcolaPercentuale(valore1, this.PesoTotale);
//   if (Istanze.IstanzaEsame != null && Istanze.IstanzaEsame.MonoPodalico != MonoPodalicoEnum.Entrambi)
//     num1 /= 2.0;
//   if (num1 >= 14.667 && num1 < 18.667)
//     return num1 >= 16.667 ? 1 : -1;
//   if (num1 >= 12.667 && num1 < 14.667)
//     return -2;
//   if (num1 >= 18.667 && num1 < 20.667)
//     return 2;
//   return num1 >= 20.666 || num1 >= 12.667 ? 3 : -3;
// }
</script>
