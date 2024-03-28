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
    fs.readFile(forcePath, "utf8", async (forcegroundErr, forceground) => {
      fs.readFile(backPath, "utf8", async (backgroundErr, background) => {
        try {
          const payload = req.body;
          const { data } = payload;
          const filePath = "test1.svg"; // Đường dẫn tới tệp SVG
          fs.writeFile(filePath, forceground, (err) => {
            if (err) {
              console.error("Lỗi khi tạo tệp SVG:", err);
            } else {
              console.log("Tạo tệp SVG thành công!");
            }
          });
          const writeStream = fs.createWriteStream(`test1.pdf`);
          const doc = new PDFDocument();
          SVGtoPDF(doc, forceground, 0, 0);
          doc.addPage();
          SVGtoPDF(doc, background, 0, 0);
          doc.pipe(writeStream);
          doc.end();
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
                  const svg = `<image id="image2_410_19552" x="20" width="2858" height="4096" xlink:href="data:image/png;base64,${imageBase64}"/>`;
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

              const writeStream = fs.createWriteStream(`test.pdf`);

              const filePath = "test.svg"; // Đường dẫn tới tệp SVG
              fs.writeFile(filePath, forcegroundData, (err) => {
                if (err) {
                  console.error("Lỗi khi tạo tệp SVG:", err);
                } else {
                  console.log("Tạo tệp SVG thành công!");
                }
              });

              const doc = new PDFDocument({ size: [widthPixels, heightPixels] });
              SVGtoPDF(doc, forcegroundData, 0, 0);
              doc.addPage({ size: [widthPixels, heightPixels] });
              SVGtoPDF(doc, backgroundData, 0, 0);
              doc.pipe(writeStream);
              doc.end();
            }

          res.json({ message: "ok" });

          // file processing
          //   const chunks = [];
          //   doc.on("data", (chunk) => chunks.push(chunk));
          //   doc.on("end", () => {
          //     const pdfBuffer = Buffer.concat(chunks);
          //     res.setHeader("Content-Type", "application/pdf");
          //     res.setHeader(
          //       "Content-Disposition",
          //       'attachment; filename="output.pdf"'
          //     );
          //     res.send(pdfBuffer);
          //   });
          //   doc.end();
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
