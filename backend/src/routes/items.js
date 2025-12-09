import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();
const STATUS = {
  PENDING: "pendente",
  IN_PROGRESS: "em_andamento",
  DONE: "concluido"
};
const LEGACY_STATUS_MAP = {
  pending: STATUS.PENDING,
  in_progress: STATUS.IN_PROGRESS,
  done: STATUS.DONE
};
const VALID_STATUSES = Object.values(STATUS);

const sanitizeStatus = (value) => {
  if (!value) return STATUS.PENDING;
  if (VALID_STATUSES.includes(value)) return value;
  if (LEGACY_STATUS_MAP[value]) return LEGACY_STATUS_MAP[value];
  return null;
};

const formatRow = (row) => ({ ...row, status: sanitizeStatus(row.status) });

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;
  return next();
};

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Lista os itens do usuario autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       401:
 *         description: Token ausente ou invalido
 *   post:
 *     summary: Cria um item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       201:
 *         description: Item criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Dados invalidos
 */
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json((data || []).map(formatRow));
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Busca item por ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item (uuid)
 *     responses:
 *       200:
 *         description: Item encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item nao encontrado
 *   put:
 *     summary: Atualiza um item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: Item atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Dados invalidos
 *       404:
 *         description: Item nao encontrado
 *   delete:
 *     summary: Remove um item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removido
 *       404:
 *         description: Item nao encontrado
 */
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("items").select("*").eq("id", id).eq("user_id", req.user.id).single();
  if (error) return res.status(404).json({ error: error.message });
  return res.json(formatRow(data));
});

router.post("/", requireAuth, async (req, res) => {
  const payload = req.body || {};
  const { title, description, status } = payload;
  if (!title) return res.status(400).json({ error: "title is required" });
  const normalizedStatus = sanitizeStatus(status);
  if (!normalizedStatus) return res.status(400).json({ error: "invalid status" });

  const { data, error } = await supabase
    .from("items")
    .insert({
      title,
      description: description || "",
      status: normalizedStatus,
      user_id: req.user.id
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body || {};
  const normalizedStatus = status ? sanitizeStatus(status) : undefined;
  if (status && !normalizedStatus) {
    return res.status(400).json({ error: "invalid status" });
  }

  const { data, error } = await supabase
    .from("items")
    .update({ title, description, status: normalizedStatus })
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(formatRow(data));
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("items").delete().eq("id", id).eq("user_id", req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
});

export default router;
