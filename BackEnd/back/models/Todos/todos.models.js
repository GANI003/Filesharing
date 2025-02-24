import mongoose  from "mongoose";

const todosSchema = new mongoose.Schema({
        title : {
            type :  String,
            require : true,
            },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        // subTodos  : [
        //         {
        //             type : mongoose.Schema.Types.ObjectId;
        //             ref : "subTodo",        
        //         }
        //     ]
        },
        
    {
        timestamps: true,
    }
);

export const Todos = mongoose.model("Todo",todosSchema);