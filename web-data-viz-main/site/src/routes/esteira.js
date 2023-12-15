var express = require("express");
var router = express.Router();

var esteiraController = require("../controllers/esteiraController");

router.get("/:empresaId", function (req, res) {
  esteiraController.buscarEsteiraPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  esteiraController.cadastrar(req, res);
})

module.exports = router;