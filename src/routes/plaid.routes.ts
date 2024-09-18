import { Router } from "express";
import jwtConfig from "../middleware/jwt";
import { exchangePublicToken, createLinkToken, exchangeIdVerificationToken, getSessionStatus } from "../controllers/plaid.controller";

const router = Router()

router.route("/exchange-public-token")
    .post(jwtConfig.verifyUser, exchangePublicToken);

router.route("/exchange-id-verification-token")
    .post(jwtConfig.verifyUser, exchangeIdVerificationToken);

router.route("/create-link-token")
    .post(jwtConfig.verifyUser, createLinkToken)
    .get(jwtConfig.verifyUser, getSessionStatus)


export default router;
