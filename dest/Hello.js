"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hello = Hello;
exports.hello = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var hello = 'hello, world';
exports.hello = hello;

function Hello() {
  return /*#__PURE__*/_react["default"].createElement("span", null, hello);
}