const express = require("express");
const router = express.Router();
const BrandRoutesV1 = require("../Module/Brands/V1/BrandRoutes")
const CategoryRoutesV1 = require("../Module/Categories/V1/CategoryRoutes");
const SubCategoryRoutesV1 = require("../Module/SubCategories/V1/SubCategoryRoutes")
const AppBannerRoutesV1 = require("../Module/AppBanners/V1/AppBannerRoutes")
const UserRoutesV1 = require("../Module/Users/V1/UserRoutes")
const UserAdressRoutesV1 = require("../Module/UserAdresses/V1/UserAdressRoutes")
const EnquiryRoutesV1 = require("../Module/Enquiries/V1/EnquiryRoutes")
const ProductRoutesV1 = require("../Module/Products/V1/ProductRoutes")
const ProductSpecificationRoutesV1 = require("../Module/ProductSpecifications/V1/ProductSpecificationRoutes")
const ContactUsRoutesV1 = require ("../Module/ContactUs/V1/ContactUsRoutes");
const AdminRoutesV1 = require ("../Module/Admins/V1/AdminRoutes")
const OrderRoutesV1 = require ("../Module/Orders/V1/OrderRoutes")

// router.use((req, res, next) => {
//   console.log("ROUTES FILE HIT:", req.originalUrl);
//   next();
// });

router.use("/v1", BrandRoutesV1);
router.use("/v1", CategoryRoutesV1);
router.use('/v1', SubCategoryRoutesV1)
router.use("/v1", UserRoutesV1 );
router.use("/v1", UserAdressRoutesV1 );
router.use("/v1", EnquiryRoutesV1 );
router.use("/v1", AppBannerRoutesV1 );
router.use("/v1", ProductRoutesV1);
router.use("/v1", ProductSpecificationRoutesV1);
router.use("/v1", ContactUsRoutesV1);
router.use("/v1", AdminRoutesV1);
router.use("/v1",OrderRoutesV1);


module.exports = router;
