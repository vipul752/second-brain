"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tagsSchema = new mongoose_1.default.Schema({
    title: { type: String },
});
const Tags = mongoose_1.default.model("Tags", tagsSchema);
exports.default = Tags;
