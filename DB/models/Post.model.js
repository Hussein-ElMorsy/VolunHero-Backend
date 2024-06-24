import mongoose, { Schema, Types, model } from "mongoose";

const postSchema = new Schema(
  {
    content: String,
    specification: {
      // Check again
      type: String,
      required: function () {
        return this.role === "User";
      },
      default: "General",
      enum: ["General", "Medical", "Educational"],
    },
    attachments: [Object],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
          required:true,
        },
      },
    ],
    sharedUsers: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
          required:true,
        },
        sharedAt:{
          type:Date,
          default: Date.now 
        }
      },
    ],

    mainPost: {
      type: Types.ObjectId,
      ref: 'Post',
      default: null
    },

    sharedFrom:{ // Added for sharing
      type: Types.ObjectId,
      ref: "Post",
      default: null,
    },
    // modifiedContent: {
    //   type: String,
    //   default: null
    // },

    comments: [{
        commentId: {
            type: Types.ObjectId,
            ref: "Comment",
        }
    }],
    customId:String,
    likesCount:{type:Number,default:0},
    shareCount:{type:Number,default:0},
    commentsCount:{type:Number, default:0},
  },
  {
    timestamps: true,
  }
);

// postSchema.pre('find', async function(next) {
//   this.select('-likes -sharedUsers'); // Exclude likes and sharedUsers fields
//   next();
// });
postSchema.post('find', async function(docs,next) {
  for (let doc of docs) {
    doc.likesCount = doc.likes.length;
    doc.shareCount = doc.sharedUsers.length;
  }

});

postSchema.statics.aggregatePostss = async function(userId) {
  try {
    
      const posts = await this.aggregate([
          { $match: { createdBy: userId } },
          {
              $addFields: {
                  likesCount: { $size: "$likes" },
                  sharedCount: { $size: "$sharedUsers" }
              }
          },
          {
              $project: {
                  likes: 0,
                  sharedUsers: 0
              }
          }
      ]);
      return posts;
  } catch (error) {
      throw new Error('Error in aggregation');
  }
};

postSchema.statics.aggregatePosts = async function(userId) {
  try {
    
      const posts = await this.aggregate([
          { $match: { createdBy: userId } },
          {
              $addFields: {
                  likesCount: { $size: "$likes" },
                  sharedCount: { $size: "$sharedUsers" }
              }
          },
          {
              $project: {
                  likes: 0,
                  sharedUsers: 0
              }
          }
      ]);
      return posts;
  } catch (error) {
      throw new Error('Error in aggregation');
  }
};

const postModel = mongoose.models.Post || model("Post", postSchema);
export default postModel;
