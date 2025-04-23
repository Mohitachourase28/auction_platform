import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occurred while connecting to database: ${err}`);
    });
};
