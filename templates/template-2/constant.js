export const fieldNames = [
  {
    name: "email",
    mark: `<!-- {{email}} -->`,
    type: "text",
    option: {
      template1: {
        x: 25,
        y: 222.5,
        fontSize: 7,
        attributes: {
          fill: "#ffffff",
          stroke: "",
          "font-weight": "bold",
        },
      },
    },
  },
  {
    name: "avatar",
    mark: `<!-- {{avatar}} -->`,
    type: "image",
  },
  {
    name: "phone",
    mark: `<!-- {{phone}} -->`,
    type: "text",
    option: {
      template1: {
        x: 25,
        y: 208.5,
        fontSize: 7,
        attributes: {
          fill: "#ffffff",
          stroke: "",
          "font-weight": "bold",
        },
      },
    },
  },
  {
    name: "jobTitle",
    mark: `<!-- {{job_title}} -->`,
    type: "text",
    option: {
      template1: {
        x: 25,
        y: 189.5,
        fontSize: 7,
        attributes: {
          fill: "#ffffff",
          stroke: "",
          "font-weight": "bold",
        },
      },
    },
  },
  {
    name: "fullname",
    mark: `<!-- {{fullname}} -->`,
    type: "text",
    kind: "head",
    option: {
      fontWeight: "bold",
      template1: {
        x: 74,
        y: 70,
        tracking: 10000,
        fontSize: 8,
        letterSpacing: 0.15,
        attributes: {
          fill: "#E8C563",
          stroke: "",
          "font-weight": "bold",
        },
      },
    },
  },
  {
    name: "englishName",
    mark: `<!-- {{english_name}} -->`,
    type: "text",
    kind: "head",
    option: {
      template1: {
        x: 74,
        y: 88,
        fontSize: 7,
        letterSpacing: 0.15,
        attributes: {
          fill: "#C3C3C3",
          stroke: "",
        },
      },
    },
  },
];

export const fieldNameBackground = [
  {
    name: "idNumber",
    mark: `<!-- {{id_number}} -->`,
  },
  {
    name: "qrCode",
    mark: `<!-- {{qrcode}} -->`,
  },
];
