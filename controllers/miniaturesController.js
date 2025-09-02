const pool = require("../models/db");

exports.getMiniatures = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM miniatures WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addMiniature = async (req, res) => {
  const { name, manufacturer, faction, scale, status, image_url, notes } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  try {
    const { rows } = await pool.query(
      `INSERT INTO miniatures (user_id, name, manufacturer, faction, scale, status, image_url, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [req.user.id, name, manufacturer, faction, scale, status || "unpainted", image_url, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateMiniature = async (req, res) => {
  const { id } = req.params;
  const { name, manufacturer, faction, scale, status, image_url, notes } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE miniatures
       SET name=COALESCE($1,name),
           manufacturer=COALESCE($2,manufacturer),
           faction=COALESCE($3,faction),
           scale=COALESCE($4,scale),
           status=COALESCE($5,status),
           image_url=COALESCE($6,image_url),
           notes=COALESCE($7,notes),
           updated_at=NOW()
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [name, manufacturer, faction, scale, status, image_url, notes, id, req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteMiniature = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM miniatures WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};