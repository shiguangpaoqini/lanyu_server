const filter = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'g') // 过滤敏感字

/**
 * 为controller添加通用的方法
 * @param {*} model 
 */
module.exports = model => (controller = {}) => {
  const actions = {
    create: async (ctx) => {
      const result = await model.create(ctx.request.body)
      ctx.status = 201
      return ctx.body = result
    },

    findAll: async (ctx) => {
      let query = ctx.request.query;
      // 条件查询
      let conditions = {};
      query.conditions && (conditions = JSON.parse(query.conditions));

      // 分页查询
      let { page = 1, pageSize = 20, keyword = '' } = ctx.request.query;
      page = +page;
      pageSize = +pageSize;
      const skip = page === 0 ? 0 : (page - 1) * pageSize;

      if (conditions.keyword) {
        keyword = conditions.keyword
        delete conditions.keyword
      }

      // 关键字查询
      if (!!keyword) {
        keyword = keyword.replace(filter, '');
        const reg = new RegExp(keyword, 'i');
        conditions.$or = [
          { title: { $regex: reg }},
          { desc: { $regex: reg }},
        ];
      }

      let builder = model.find(conditions).limit(pageSize).skip(skip);
      
      ['sort', 'select'].forEach(key => {
        if (query[key]) {
          builder[key](JSON.parse(query[key]));
        }
      });
      
      // 展开字段
      let embedded = query.embedded && JSON.parse(query.embedded)

      if (embedded) {
        Object.keys(embedded).forEach(key => {
          builder.populate(key)
        })
      }

      const result = await builder.exec();
      const total = await builder.count();
      return ctx.body = { status: 'ok', data: result, total }
    },

    findById: async (ctx) => {
      let query = ctx.request.query;
      let builder = model.findById(ctx.params.id);
      ['sort', 'select'].forEach(key => {
        if (query[key]) {
          builder[key](JSON.parse(query[key]));
        }
      });

      let embedded = query.embedded && JSON.parse(query.embedded)

      if (embedded) {
        Object.keys(embedded).forEach(key => {
          builder.populate(key)
        })
      }

      const result = await builder.exec();
      return ctx.body = { status: 'ok', data: result }
    },

    updateById: async (ctx) => {
      await model.update({_id: ctx.params.id}, {
        ...ctx.request.body,
        updateAt: new Date() 
      });
      const result = await model.findById(id);

      return ctx.body = result;
    },

    replaceById: async (ctx) => {
      await model.findByIdAndRemove(ctx.params.id).exec();
      const newDocument = ctx.request.body;
      newDocument._id = ctx.params.id;
      const result = await model.create(newDocument)

      return ctx.body = result;
    },

    deleteById: async (ctx) => {
      const result = await model.findByIdAndRemove(ctx.params.id).exec();
  
      return ctx.body = result;
    }
  };

  Object.keys(actions).forEach(key => controller[key] = actions[key])

  return controller
}