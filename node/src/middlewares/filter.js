const generateFilters = (query, allowedFields) => {
    let filters = {};

    Object.keys(query).forEach((key) => {
        if (allowedFields.includes(key)) {
            filters[key] = query[key];
        }
    });

    return filters;
};

export default generateFilters;