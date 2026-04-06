"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/use-composed-ref";
exports.ids = ["vendor-chunks/use-composed-ref"];
exports.modules = {

/***/ "(ssr)/./node_modules/use-composed-ref/dist/use-composed-ref.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/use-composed-ref/dist/use-composed-ref.esm.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ useComposedRef)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n// basically Exclude<React.ClassAttributes<T>[\"ref\"], string>\nvar updateRef = function updateRef(ref, value) {\n    if (typeof ref === \"function\") {\n        ref(value);\n        return;\n    }\n    ref.current = value;\n};\nvar useComposedRef = function useComposedRef(libRef, userRef) {\n    var prevUserRef = react__WEBPACK_IMPORTED_MODULE_0___default().useRef();\n    return react__WEBPACK_IMPORTED_MODULE_0___default().useCallback(function(instance) {\n        libRef.current = instance;\n        if (prevUserRef.current) {\n            updateRef(prevUserRef.current, null);\n        }\n        prevUserRef.current = userRef;\n        if (!userRef) {\n            return;\n        }\n        updateRef(userRef, instance);\n    }, [\n        userRef\n    ]);\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXNlLWNvbXBvc2VkLXJlZi9kaXN0L3VzZS1jb21wb3NlZC1yZWYuZXNtLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUUxQiw2REFBNkQ7QUFFN0QsSUFBSUMsWUFBWSxTQUFTQSxVQUFVQyxHQUFHLEVBQUVDLEtBQUs7SUFDM0MsSUFBSSxPQUFPRCxRQUFRLFlBQVk7UUFDN0JBLElBQUlDO1FBQ0o7SUFDRjtJQUNBRCxJQUFJRSxPQUFPLEdBQUdEO0FBQ2hCO0FBQ0EsSUFBSUUsaUJBQWlCLFNBQVNBLGVBQWVDLE1BQU0sRUFBRUMsT0FBTztJQUMxRCxJQUFJQyxjQUFjUixtREFBWTtJQUM5QixPQUFPQSx3REFBaUIsQ0FBQyxTQUFVVyxRQUFRO1FBQ3pDTCxPQUFPRixPQUFPLEdBQUdPO1FBQ2pCLElBQUlILFlBQVlKLE9BQU8sRUFBRTtZQUN2QkgsVUFBVU8sWUFBWUosT0FBTyxFQUFFO1FBQ2pDO1FBQ0FJLFlBQVlKLE9BQU8sR0FBR0c7UUFDdEIsSUFBSSxDQUFDQSxTQUFTO1lBQ1o7UUFDRjtRQUNBTixVQUFVTSxTQUFTSTtJQUNyQixHQUFHO1FBQUNKO0tBQVE7QUFDZDtBQUVxQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbnZvYWktY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3VzZS1jb21wb3NlZC1yZWYvZGlzdC91c2UtY29tcG9zZWQtcmVmLmVzbS5qcz81ZTAzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbi8vIGJhc2ljYWxseSBFeGNsdWRlPFJlYWN0LkNsYXNzQXR0cmlidXRlczxUPltcInJlZlwiXSwgc3RyaW5nPlxuXG52YXIgdXBkYXRlUmVmID0gZnVuY3Rpb24gdXBkYXRlUmVmKHJlZiwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiByZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZWYodmFsdWUpO1xuICAgIHJldHVybjtcbiAgfVxuICByZWYuY3VycmVudCA9IHZhbHVlO1xufTtcbnZhciB1c2VDb21wb3NlZFJlZiA9IGZ1bmN0aW9uIHVzZUNvbXBvc2VkUmVmKGxpYlJlZiwgdXNlclJlZikge1xuICB2YXIgcHJldlVzZXJSZWYgPSBSZWFjdC51c2VSZWYoKTtcbiAgcmV0dXJuIFJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIGxpYlJlZi5jdXJyZW50ID0gaW5zdGFuY2U7XG4gICAgaWYgKHByZXZVc2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgIHVwZGF0ZVJlZihwcmV2VXNlclJlZi5jdXJyZW50LCBudWxsKTtcbiAgICB9XG4gICAgcHJldlVzZXJSZWYuY3VycmVudCA9IHVzZXJSZWY7XG4gICAgaWYgKCF1c2VyUmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZVJlZih1c2VyUmVmLCBpbnN0YW5jZSk7XG4gIH0sIFt1c2VyUmVmXSk7XG59O1xuXG5leHBvcnQgeyB1c2VDb21wb3NlZFJlZiBhcyBkZWZhdWx0IH07XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1cGRhdGVSZWYiLCJyZWYiLCJ2YWx1ZSIsImN1cnJlbnQiLCJ1c2VDb21wb3NlZFJlZiIsImxpYlJlZiIsInVzZXJSZWYiLCJwcmV2VXNlclJlZiIsInVzZVJlZiIsInVzZUNhbGxiYWNrIiwiaW5zdGFuY2UiLCJkZWZhdWx0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/use-composed-ref/dist/use-composed-ref.esm.js\n");

/***/ })

};
;