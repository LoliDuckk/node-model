const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/me", authMiddleware, userController.getMe);
router.patch("/me/block", authMiddleware, userController.blockMe);
router.get("/all", checkRole("admin"), userController.getAllUsers);
router.get("/:id", checkRole("admin"), userController.getById);
router.patch("/:id/block", checkRole("admin"), userController.blockById);

module.exports = router;
