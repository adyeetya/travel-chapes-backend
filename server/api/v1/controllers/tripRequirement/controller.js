import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import status from "../../../../enums/status";
import { locationServices } from "../../services/location";
const { createLocation, findLocation, updateLocation, findLocationList } =
  locationServices;
import { hotelServices } from "../../services/hotel";
const {
  createHotel,
  findHotel,
  updateHotel,
  findHotelList,
  finHotelPopulate,
  hotelsList,
} = hotelServices;
import { vehicaleServices } from "../../services/vehicale";
const { createVehicale, findVehicale, updateVehicale, findVehicaleList } =
  vehicaleServices;
import { tripServices } from "../../services/trip";
const {
  createTripDetails,
  findTrip,
  updateTrip,
  findTripList,
  findPopulateTrip,
} = tripServices;
class tripRequirementController {
  async createLocation(req, res, next) {
    const validSchema = Joi.object({
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      description: Joi.string().optional(),
    });
    // console.log('value', req.body)
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const result = await createLocation(value);
      return res.json(new response(result, responseMessage.LOCATION_CREATED));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async locationList(req, res, next) {
    try {
      const result = await findLocationList({ isDeleted: false });
      // console.log('result', result)
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      next(error);
    }
  }
  async updateLocation(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      description: Joi.string().optional(),
    });
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const result = await findLocation({ _id: value._id, isDeleted: false });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      await updateLocation(value, { _id: result._id });
      return res.json(new response({}, responseMessage.DATA_SAVED));
    } catch (error) {
      next(error);
    }
  }
  async createHotel(req, res, next) {
    const validSchema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      locationId: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
      contact: Joi.string().required(),
    });
    try {
      // console.log(">>>>>>>>>>>>>", req.body);

      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      // console.log(">>>>>>>>>>>>>", validateBody);

      const checkLocation = await findLocation({
        _id: value.locationId,
        isDeleted: false,
      });
      if (!checkLocation) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      const result = await createHotel(value);
      const hotelResult = await finHotelPopulate({ _id: result._id });
      // console.log(">>>>>>>>>>>>>>>|", hotelResult);

      return res.json(new response(hotelResult, responseMessage.HOTEL_CREATED));
    } catch (error) {
      next(error);
    }
  }
  async hotelList(req, res, next) {
    try {
      const result = await findHotelList({ isDeleted: false });
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      next(error);
    }
  }
  async updateHotel(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      locationId: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
      contact: Joi.string().required(),
    });
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const result = await findHotel({ _id: value._id, isDeleted: false });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      const checkLocation = await findLocation({ _id: value._id });
      if (!checkLocation) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      await updateHotel({ _id: result._id }, value);
      return res.json(new response({}, responseMessage.DATA_SAVED));
    } catch (error) {
      next(error);
    }
  }
  async createVehicale(req, res, next) {
    const validSchema = Joi.object({
      name: Joi.string().required(),
      maxPeople: Joi.number().required(),
      type: Joi.string().required(),
      contact: Joi.string().required(),
    });
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      // console.log('value>>>',value)

      const result = await createVehicale(value);
      return res.json(new response(result, responseMessage.VEHICLE_CREATED));
    } catch (error) {
      next(error);
    }
  }
  async vehicaleList(req, res, next) {
    try {
      const result = await findVehicaleList({ isDeleted: false });
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      next(error);
    }
  }
  async updateVehicale(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      maxPeople: Joi.number().required(),
      type: Joi.string().required(),
      contact: Joi.string().required(),
    });
    try {
      const { error, value } = await Joi.validate(req.body, validSchema);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const result = await findVehicale({ _id: value._id });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      await updateVehicale({ _id: result._id }, value);
      return res.json(new response({}, responseMessage.DATA_SAVED));
    } catch (error) {
      next(error);
    }
  }
  async deleteVehicleHotelLocation(req, res, next) {
    const validSchema = Joi.object({
      type: Joi.string().required(),
      _id: Joi.string().required(),
    });
    try {
      // console.log('body>>>>>>>>', req.body)
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      // console.log(value)
      if (value.type == "hotel") {
        const hotelResult = await findHotel({
          _id: value._id,
          isDeleted: false,
        });
        if (!hotelResult) {
          throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
        }
        await updateHotel({ _id: value._id }, { isDeleted: true });
        return res.json(new response({}, responseMessage.DATA_SAVED));
      }
      if (value.type == "vehicle") {
        const hotelResult = await findVehicale({
          _id: value._id,
          isDeleted: false,
        });
        if (!hotelResult) {
          throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
        }
        await updateVehicale({ _id: value._id }, { isDeleted: true });
        return res.json(new response({}, responseMessage.DATA_SAVED));
      }
      if (value.type == "location") {
        const hotelResult = await findLocation({
          _id: value._id,
          isDeleted: false,
        });
        if (!hotelResult) {
          throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
        }
        await updateLocation({ _id: value._id }, { isDeleted: true });
        return res.json(new response({}, responseMessage.DATA_SAVED));
      }
    } catch (error) {
      next(error);
    }
  }
  async createTrip(req, res, next) {
    // changed the stays to accept '' and 
    const validSchema = Joi.object({
      locationId: Joi.string().required(),
      slug: Joi.string().required(),
      pickup: Joi.string().required(),
      viaPoints: Joi.string().optional().allow(""),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      days: Joi.number().required(),
      stays: Joi.array().items(Joi.string().allow("")).optional(),
      vehicles: Joi.array().items(Joi.string().allow("")).optional(),
      meals: Joi.array().items(Joi.string().allow("")).optional(),
      itinerary: Joi.array().items(Joi.string().allow("")).optional(),
      pricing: Joi.object()
        .pattern(
          Joi.string(), // Key can be any string (vehicle type)
          Joi.object({
            // Value must be an object with single/double/triple
            single: Joi.number().required(),
            double: Joi.number().required(),
            triple: Joi.number().required(),
          })
        )
        .required(),
      gst: Joi.number().default(18),
    });
    try {
      // console.log("body", req.body);
      const { error, value } = await validSchema.validate(req.body);
      // console.log("value", value);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      // converting ''  to null before passing it to the db
      value.stays = value.stays.map((s) => (s === "" ? null : s));
      // console.log("req value", value);
      const locationResult = await findLocation({ _id: value.locationId, isDeleted: false });
      if (!locationResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }


      const validStays = value.stays.filter(s => s !== null);

      // console.log("valid stays", validStays);

      const checkVehicels = await findVehicaleList({ _id: { $in: value.vehicles } });
      if (checkVehicels.length !== value.vehicles.length) {
        throw apiError.notFound(responseMessage.VEHICLE_NOT_FOUND);
      }
      // console.log('value', value)
      const result = await createTripDetails(value);
      const tripResult = await findPopulateTrip({ _id: result._id });
      //    console.log('result', result)
      return res.json(new response(tripResult, responseMessage.TRIP_CREATED));
    } catch (error) {
      next(error);
    }
  }
  async tripList(req, res, next) {
    try {
      const result = await findTripList({ isDeleted: false });
      console.log("result", result);
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      next(error);
    }
  }
  async viewTrip(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
    });
    try {
      const { error, value } = await validSchema.validate(req.query);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const tripResult = await findTrip({ _id: value._id });
      if (!tripResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(tripResult, responseMessage.DATA_FOUND));
    } catch (error) {
      next(error);
    }
  }
  async updateTrip(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
      locationId: Joi.string().required(),
      slug: Joi.string().required(),
      pickup: Joi.string().required(),
      viaPoints: Joi.array().items(Joi.string()).optional(),
      drop: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      days: Joi.number().required(),
      itinerary: Joi.array().items(Joi.string()).optional(),
      vehicles: Joi.array().items(Joi.string()).optional(),
      stays: Joi.array().items(Joi.string()).optional(),
      meals: Joi.array().items(Joi.string()).optional(),
      pricing: Joi.object({
        car: Joi.object({ price: Joi.number().required() }).optional(),
        bus: Joi.object({ price: Joi.number().required() }).optional(),
        gst: Joi.number().default(18),
      }).required(),
    });
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const result = await findTrip({ _id: value._id, isDeleted: false });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      await updateTrip({ _id: result._id }, value);
      return res.json(new response({}, responseMessage.DATA_SAVED));
    } catch (error) {
      next(error);
    }
  }
  async deleteTrip(req, res, next) {
    const validSchema = Joi.object({
      _id: Joi.string().required(),
    });
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const hotelResult = await findTrip({ _id: value._id, isDeleted: false });
      if (!hotelResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      await updateTrip({ _id: value._id }, { isDeleted: true });
      return res.json(new response({}, responseMessage.DATA_SAVED));
    } catch (error) {
      next(error);
    }
  }
}

export default new tripRequirementController();
