export const paginate = async (model : any, pageSize : any, pageLimit : any, search = {}, order = [], include = {}, transform : any) => {
  try {
      const limit = parseInt(pageLimit, 10) || 10
      const page = parseInt(pageSize, 10) || 1;

      // create an options object
      let options: any = {};

      // check if the search object is empty
      if (Object.keys(search).length) {
          options = {...options, ...search}
      }

      options = {...options, ...{offset: getOffset(page, limit), limit: limit, raw:true}}
      
      // check if the order array is empty
      if (order && order.length) {
          options['order'] = order;
      }

      if (include) {
        options['include'] = include
      }
      // await ProductModel.findAndCountAll({include:[{model:MerkModel,where:{is_deleted : false}}]})

      // take in the model, take in the options
      let {count, rows} = await model.findAndCountAll(options);

      // check if the transform is a function and is not null
      if (transform && typeof transform === 'function') {
         rows = transform(rows);
      }

      return {
        docs: rows,
        totalDocs:count,
        limit: limit,
        page: page,
        totalPages: Math.ceil(count / limit),
        pagingCounter: ((page * limit) + 1) - limit,
        hasPrevPage: (page > 1) ? true : false,
        hasNextPage: (page < Math.ceil(count / limit)) ? true : false,
        prevPage: getPreviousPage(page),
        nextPage: getNextPage(page, limit, count)
        // previousPage: getPreviousPage(page),
        // currentPage: page,
        // nextPage: getNextPage(page, limit, count),
        // total: count,
        // limit: limit,
      }
  } catch (error) {
      console.log(error);
  }
}

const getOffset = (page : number, limit : number) => {
return (page * limit) - limit;
}

const getNextPage = (page : number, limit : number, total : number) => {
  if ((total/limit) > page) {
      return page + 1;
  }

  return null
}

const getPreviousPage = (page : number) => {
  if (page <= 1) {
      return null
  }
  return page - 1;
}