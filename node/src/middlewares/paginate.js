const paginate = async (model, req, res, where = {}, options = {}) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const results = await model.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            ...options // esto aplica `include`, `order`, etc.
        });

        res.json({
            total: results.count,
            pagina: parseInt(page),
            totalPaginas: Math.ceil(results.count / limit),
            data: results.rows,
        });
    } catch (error) {
        res.status(500).json({ error: "Error en la paginación", detalle: error.message });
    }
};

export default paginate;