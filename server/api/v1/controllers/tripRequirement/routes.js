import express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
// /api/v1/tripRequirement
export default express
  .Router()
  .get("/viewTrip", controller.viewTrip)
  .use(auth.verifyToken)
  .get("/getTripList", controller.tripList)
  .get("/getLocationList", controller.locationList)
  .get("/getHotelList", controller.hotelList)
  .get("/getVehicalList", controller.vehicaleList)

  .post("/createLocation", controller.createLocation)
  .put("/updateLocation", controller.updateLocation)
  .post("/createHotel", controller.createHotel)
  .put("/updateHotel", controller.updateHotel)
  .post("/createVehicale", controller.createVehicale)
  .put("/updateVehicale", controller.updateVehicale)
  .delete("/deleteLocationHotelVechile", controller.deleteVehicleHotelLocation)
  .post("/createTrip", controller.createTrip)
  .put("/updateTrip", controller.updateTrip)
  .delete("/deleteTrip", controller.deleteTrip);
