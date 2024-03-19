import express from "express";
const template1Router = express.Router();
import TextToSVG from "text-to-svg";
import fs from "node:fs";
import SVGtoPDF from "svg-to-pdfkit";
import PDFDocument from "pdfkit";

import {
  extractInnerSVGContent,
  generateQR,
  getImageAsBase64,
  splitString,
} from "../../utils/index.js";
import { fieldNames } from "./constant.js";
import { widthPixels, heightPixels } from "../../global/constants.js";

const textBoldToSVG = TextToSVG.loadSync(
  "assets/fonts/Montserrat/Montserrat-Bold.ttf"
);

const textToSVG = TextToSVG.loadSync(
  "assets/fonts/Montserrat/Montserrat-Regular.ttf"
);

const backPath = "assets/backgrounds/01_Back.svg";
const forcePath = "assets/backgrounds/01_Front.svg";


template1Router.get("/tempate1", async (req, res) => {
  try {
    fs.readFile(forcePath, "utf8", async (forcegroundErr, forceground) => {
      fs.readFile(backPath, "utf8", async (backgroundErr, background) => {
        try {
          const payload = req.body;
          const { data } = payload;
          const doc = new PDFDocument({ size: [widthPixels, heightPixels] });

          for (let i = 0; i < data.length; i++) {
            const _fieldNames = JSON.parse(JSON.stringify(fieldNames));
            let forcegroundData = JSON.parse(JSON.stringify(forceground));
            let backgroundData = JSON.parse(JSON.stringify(background));
            const { forcegroundPayload, backgroundPayload } = data[i];
            if (forcegroundErr) {
              console.error(forcegroundErr);
              return;
            }
            if (backgroundErr) {
              console.error(backgroundErr);
              return;
            }
            // handle forceground
            let breakTime = 0;
            for (let i = 0; i < _fieldNames.length; i++) {
              const field = _fieldNames[i];
              if (forcegroundData.includes(field.mark)) {
                if (field.type === "text") {
                  let svg = "";

                  if (
                    field.option.fontWeight === "bold" &&
                    field.kind === "head"
                  ) {
                    if (forcegroundPayload[field.name].trim().length > 10) {
                      const parts = splitString(
                        forcegroundPayload[field.name].trim()
                      );
                      breakTime = parts.length;
                      for (let i = 0; i < parts.length; i++) {
                        const option = field.option.template1;
                        option.y = option.y + i * 10;
                        svg = svg + textBoldToSVG.getPath(parts[i], option);
                      }
                      forcegroundData = forcegroundData.replace(
                        field.mark,
                        svg
                      );
                    } else {
                      svg = textBoldToSVG.getPath(
                        forcegroundPayload[field.name],
                        field.option.template1
                      );
                    }
                  } else {
                    const option = field.option.template1;
                    if (field.kind === "head") {
                      option.y = option.y + (breakTime - 1) * 5;
                    }
                    svg = textToSVG.getPath(
                      forcegroundPayload[field.name],
                      option
                    );
                  }

                  forcegroundData = forcegroundData.replace(field.mark, svg);
                }
              }
              if (field.type === "image") {
                const imageBase64 = await getImageAsBase64(
                  forcegroundPayload[field.name]
                );
                const svg = `<image id="image0_622_4299" x="20" width="2858" height="4096" xlink:href="data:image/png;base64,${imageBase64}"/>`;
                forcegroundData = forcegroundData.replace(field.mark, svg);
              }
            }

            // handle background
            let qrText = await generateQR(backgroundPayload.qrCode);
            qrText = await extractInnerSVGContent(qrText);
            const qrMart = "<!-- {{qrcode}} -->";
            const idNumberMark = "<!-- {{id_number}} -->";
            const idNumberSvg = textToSVG.getPath(backgroundPayload.idNumber, {
              x: 77,
              y: 156,
              fontSize: 6,
              letterSpacing: 0.15,
              anchor: "center",
              attributes: {
                fill: "#E8C563",
                stroke: "",
              },
            });
            backgroundData = backgroundData.replace(qrMart, qrText);
            backgroundData = backgroundData.replace(idNumberMark, idNumberSvg);

            SVGtoPDF(doc, forcegroundData, 0, 0);
            doc.addPage({ size: [widthPixels, heightPixels] });
            SVGtoPDF(doc, backgroundData, 0, 0);
            if (i < data.length - 1) {
              doc.addPage({ size: [widthPixels, heightPixels] });
            }
          }

          // file processing
          const chunks = [];
          doc.on("data", (chunk) => chunks.push(chunk));
          doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              'attachment; filename="output.pdf"'
            );
            res.send(pdfBuffer);
          });
          doc.end();
        } catch (err) {
          res.json({ error: err });
        }
      });
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

export default template1Router;
