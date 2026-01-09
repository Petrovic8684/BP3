import express from "express";
import { client } from "../db/db.js";
import { generateEmbedding } from "../helpers/embeddings.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    const qEmb = await generateEmbedding(query);
    const vectorLiteral = "[" + qEmb.join(",") + "]";

    const dijagnoze = await client.query(
      `
      SELECT sifradijagnoze, naziv, opis, 1 - (embedding <=> $1::vector) AS slicnost
      FROM dijagnoza
      WHERE embedding IS NOT NULL
      ORDER BY slicnost DESC
      LIMIT $2
      `,
      [vectorLiteral, limit]
    );

    const dijagnozeSaLekovima = await Promise.all(
      dijagnoze.rows.map(async (dijagnoza) => {
        const lekoviRes = await client.query(
          `
	        SELECT l.jkl, l.naziv, l.jacina, l.jedinica
	        FROM lek l
	        WHERE l.jkl IN (
    	      SELECT lsa.jkl
    		    FROM leksadrziaktivnasupstanca lsa
    		    JOIN leci lec ON lsa.atc = lec.atc
    		    WHERE lec.sifradijagnoze = $1
	        )
	        LIMIT 3;
  	      `,
          [dijagnoza.sifradijagnoze]
        );

        return {
          ...dijagnoza,
          lekovi: lekoviRes.rows,
        };
      })
    );

    res.json(dijagnozeSaLekovima);
  } catch (err) {
    console.error("Greška prilikom semantičke pretrage: ", err);
    res.status(500).json({
      message: "Greška prilikom semantičke pretrage",
      error: err,
    });
  }
});

export default router;
