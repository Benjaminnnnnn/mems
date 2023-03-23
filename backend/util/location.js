const axios = require("axios");
const HttpError = require("../models/http-error");

require("dotenv").config();

const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

const getCoordsForAddress = async (address) => {
  // const address_encoded = address.trim().split(/\s+/).join("%20");

  const res = await axios.get(BASE_URL, {
    params: {
      address: encodeURIComponent(address),
      key: process.env.GOOGLE_API_KEY,
    },
  });
  const data = res.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Cannot find the coordinates for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
};

module.exports = getCoordsForAddress;
