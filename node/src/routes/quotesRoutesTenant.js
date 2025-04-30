import { Router } from "express";
import { getQuotes, getQuotesForID, createQuote, updateQuote, deleteQuote, getUpcomingQuotes, getAllQuotes, getAvailableHoursByDate, getQuotesByUser, cancelQuote } from "../controllers/quoteControllersTenant.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, getQuotes);
router.get("/:id_quotePK", verificarToken, getQuotesForID);
router.post("/", verificarToken, createQuote);
router.put("/:id_quotePK", verificarToken, updateQuote);
router.delete("/:id_quotePK", verificarToken, deleteQuote);
router.get("/upcoming/update", verificarToken, getUpcomingQuotes);
router.get("/all/calendar", verificarToken, getAllQuotes); 
router.get("/disponibles/horas", verificarToken, getAvailableHoursByDate);
router.get("/all/:tenant_id/:user_id", getQuotesByUser);
router.put("/cancel/cancelCustomerQuote/:id", verificarToken, cancelQuote)




export default router;
