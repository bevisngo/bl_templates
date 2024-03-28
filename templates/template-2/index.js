import express from "express";
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

const backPath = "assets/backgrounds/02_Back.svg";
const forcePath = "assets/backgrounds/02_Front.svg";

const template2Router = express.Router();

template2Router.get("/template2", async (req, res) => {
  try {
    fs.readFile(forcePath, "utf8", async (forcegroundErr, forcegroundPr) => {
      fs.readFile(backPath, "utf8", async (backgroundErr, backgroundPr) => {
        const forceground = forcegroundPr;
        const background = backgroundPr;

        if (forcegroundErr) {
          console.error(forcegroundErr);
          return;
        }
        if (backgroundErr) {
          console.error(backgroundErr);
          return;
        }
        try {
          const payload = req.body;
          const { data } = payload;
          const doc = new PDFDocument({ size: [widthPixels, heightPixels] });

          for (let i = 0; i < data.length; i++) {
            const _fieldNames = JSON.parse(JSON.stringify(fieldNames));
            let forcegroundData = forceground;
            let backgroundData = background;
            const { forcegroundPayload, backgroundPayload } = data[i];

            // handle forceground
            //
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
                fill: "#FDDAB9",
                stroke: "",
              },
            });
            backgroundData = backgroundData.replace(qrMart, qrText);
            backgroundData = backgroundData.replace(idNumberMark, idNumberSvg);

            const filePath = "test3.svg";
            fs.writeFile(filePath, backgroundData, (err) => {
              if (err) {
                console.error("error:", err);
              }
            });

            SVGtoPDF(doc, forcegroundData, 0, 0);
            doc.addPage({ size: [widthPixels, heightPixels] });
            SVGtoPDF(doc, backgroundData, 0, 0);
            if (i < data.length - 1) {
              doc.addPage({ size: [widthPixels, heightPixels] });
            }
          }

          const writeStream = fs.createWriteStream(`test3.pdf`);
          doc.pipe(writeStream);
          doc.end();

          res.json({ message: "ok" });

          // file processing
          // const chunks = [];
          // doc.on("data", (chunk) => chunks.push(chunk));
          // doc.on("end", () => {
          //   const pdfBuffer = Buffer.concat(chunks);
          //   res.setHeader("Content-Type", "application/pdf");
          //   res.setHeader(
          //     "Content-Disposition",
          //     'attachment; filename="output.pdf"'
          //   );
          //   res.send(pdfBuffer);
          // });
          // doc.end();
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

export default template2Router;
