import axios from "axios";
import QRCode from "qrcode";

export async function getImageAsBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data).toString("base64");
    return base64;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

export const extractInnerSVGContent = (svgString) => {
  const regex = /<svg[^>]*>([\s\S]*?)<\/svg>/i;
  const match = svgString.match(regex);
  if (match && match.length > 1) {
    return match[1];
  } else {
    throw new Error("Không tìm thấy cặp thẻ <svg> trong chuỗi SVG.");
  }
};

export const generateQR = async (text) => {
  try {
    return await QRCode.toString(text, {
      type: "svg",
      color: {
        dark: "#E8C563",
        light: "#00000000",
      },
      width: 2000,
      scale: 2,
    });
  } catch (err) {
    console.error(err);
  }
};

export const splitString = (input) => {
  const result = [];
  let currentPart = "";

  for (let i = 0; i < input.length; i++) {
    if (currentPart.length >= 8 && input[i] === " ") {
      result.push(currentPart.trim());
      currentPart = "";
    } else if (currentPart.length === 8 && i === input.length - 1) {
      result.push(currentPart.trim());
      currentPart = "";
    }

    currentPart += input[i];
  }

  if (currentPart !== "") {
    result.push(currentPart.trim());
  }

  return result;
};
