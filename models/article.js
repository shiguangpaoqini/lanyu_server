const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  id: Number,
  title: {                             // 标题
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  cover: String,                       // 封面
  content: {                           // 内容
    type: String,
    required: true
  },
  html: String,                        // HTML内容
  toc: Array,                          // TOC
  // tags: [{                              // 标签
  //   type: Schema.Types.ObjectId,
  //   ref: 'Tag'
  // }],
  // state: {                             // 状态（‘草稿‘或者’发布‘）
  //   type: String,
  //   default: 'draft',
  //   set: function (state) {
  //     return ['draft', 'publish'].indexOf(state) > -1
  //         ? state
  //         : 'draft'
  //   }
  // },
  readingQuantity: {                   // 阅读量
    type: Number,
    default: 0,
  },
  likeUsers:[{                        // 点赞用户
      type: Schema.Types.ObjectId,
      ref: 'User'
  }],
  createAt: {                          // 创建日期
    type: Date,
    default: Date.now()
  },
  updateAt: {                          // 更新日期
    type: Date,
    default: Date.now()
  },
  author: {                            // 作者
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hot: {                            // 热门
    type: Boolean,
    default: false
  }
});


articleSchema.index({ id: 1 });

// 时间更新
articleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: new Date() });
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;